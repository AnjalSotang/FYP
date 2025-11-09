import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  Clock,
  Dumbbell,
  Play,
  Share,
  Trophy,
  Battery,
  Check,
  Pause,
  RotateCcw,
  AlertCircle,
  Timer
} from "lucide-react";
import { useParams } from "react-router-dom";
import { fetchActiveWorkout, completeWorkoutDay, fetchCompletedWorkouts } from "../../../../../store/userWorkoutSlice2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { setStatus } from "../../../../../store/userWorkoutSlice2";
import RootLayout from '../../../../components/layout/UserLayout';
import { getUserWorkout } from "../../../../../store/userWorkoutSlice"

export default function WorkoutPage() {
  const { id } = useParams();
  console.log(id)
  const dispatch = useDispatch();

  // Get workout from Redux store
  const activeWorkout = useSelector((state) => state.userWorkout2.data.activeWorkouts1);
  const {data} = useSelector((state) => state.userWorkout);
  console.log(data)

  const completed = useSelector((state) => state.userWorkout2.data.completedWorkouts);
  const { status } = useSelector((state) => state.userWorkout2);

  const workout = activeWorkout;
  console.log(workout);
  // console.log(data)

  console.log(completed)

  // Local state for workout tracking
  const [activeExercises, setActiveExercises] = useState([]);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [isRestDay, setIsRestDay] = useState(false);
  const [showProgramCompleteDialog, setShowProgramCompleteDialog] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [exerciseTimers, setExerciseTimers] = useState({});
  const [activeExerciseId, setActiveExerciseId] = useState(null);
  const [totalRestTime, setTotalRestTime] = useState(0);
  const [totalActiveTime, setTotalActiveTime] = useState(0);
  const [previousWorkoutTime, setPreviousWorkoutTime] = useState(null);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(null);

  // Audio notifications
  const restEndSound = useRef(null);

  // Initialize audio elements
  useEffect(() => {
    restEndSound.current = new Audio('/sounds/rest-end.mp3');
  }, []);

  // Fetch workout data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchActiveWorkout(id));
      dispatch(getUserWorkout(id));
    }
  }, [dispatch, id]);


  useEffect(() => {
    dispatch(fetchCompletedWorkouts());
  }, [dispatch]);

  

  // Update local state when workout data is loaded
  useEffect(() => {
    if (workout && workout.days && workout.days.length > 0) {
      const currentDay = workout.days.find(day => day.day === workout.currentDay);
      if (currentDay && currentDay.dayName === "Rest Day") {
        setIsRestDay(true);
        // No exercises to set for rest days
      } else if (currentDay && currentDay.exercises) {
        // Initialize with exercise timers
        const initializedExercises = currentDay.exercises.map(exercise => ({
          ...exercise,
          completed: false
        }));
        setActiveExercises(initializedExercises);

        // Initialize timers for each exercise
        const timers = {};
        initializedExercises.forEach(ex => {
          timers[ex.id] = 0;
        });
        setExerciseTimers(timers);

        // Set initial estimated completion time
        const avgTimePerExercise = 120; // 2 minutes per exercise as default
        const totalRestTimeEstimate = initializedExercises.length * 30; // 30 seconds rest between exercises
        setEstimatedTimeRemaining((initializedExercises.length * avgTimePerExercise) + totalRestTimeEstimate);

        setIsRestDay(false);
      }

      // Check if there's a previous workout to compare with
      if (workout.previousWorkouts && workout.previousWorkouts.length > 0) {
        const lastWorkout = workout.previousWorkouts[0];
        if (lastWorkout && lastWorkout.duration) {
          setPreviousWorkoutTime(lastWorkout.duration);
        }
      }
    }
  }, [workout]);

  const toggleExerciseComplete = (id) => {
    // Find the exercise we're toggling
    const exercise = activeExercises.find(ex => ex.id === id);
    const wasCompleted = exercise?.completed || false;

    // Update the exercises
    const updatedExercises = activeExercises.map((exercise) =>
      exercise.id === id ? { ...exercise, completed: !exercise.completed } : exercise
    );
    setActiveExercises(updatedExercises);

    // If marking as complete, capture the time for this exercise
    if (!wasCompleted) {
      // Save time for this exercise
      setExerciseTimers(prev => ({
        ...prev,
        [id]: workoutTimer - (totalRestTime + Object.values(prev).reduce((sum, time) => sum + time, 0))
      }));

      // If we have more exercises, start rest timer
      const remainingExercises = updatedExercises.filter(ex => !ex.completed && ex.id !== id);
      if (remainingExercises.length > 0) {
        startRestTimer(parseInt(exercise.rest) || 60);
      }
    }

    // Check if all exercises are completed
    if (updatedExercises.every((exercise) => exercise.completed)) {
      setWorkoutComplete(true);
    } else {
      setWorkoutComplete(false);
    }

    // Update estimated time remaining
    updateEstimatedTimeRemaining(updatedExercises);
  };

  const updateEstimatedTimeRemaining = (exercises) => {
    const completedExercises = exercises.filter(ex => ex.completed);
    const remainingExercises = exercises.filter(ex => !ex.completed);

    if (remainingExercises.length === 0) {
      setEstimatedTimeRemaining(0);
      return;
    }

    // Calculate average time per completed exercise
    let avgTimePerExercise = 120; // Default: 2 minutes
    if (completedExercises.length > 0) {
      const totalCompletedTime = Object.values(exerciseTimers).reduce((sum, time) => sum + time, 0);
      avgTimePerExercise = totalCompletedTime / completedExercises.length;
    }

    // Estimate remaining time
    const remainingExerciseTime = remainingExercises.length * avgTimePerExercise;
    const remainingRestTime = Math.max(0, remainingExercises.length - 1) * 60; // Assume 60 sec rest between remaining exercises

    setEstimatedTimeRemaining(Math.round(remainingExerciseTime + remainingRestTime));
  };

  const startRestTimer = (duration) => {
    setRestTimer(duration);
    setIsResting(true);

    // Start the rest countdown
    const restInterval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          // Rest is over
          clearInterval(restInterval);
          setIsResting(false);
          setTotalRestTime(prev => prev + duration);

          // Play sound when rest ends
          if (restEndSound.current) {
            restEndSound.current.play().catch(e => console.log("Audio play failed:", e));
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
    setIsPaused(false);

    // If there's an active exercise, track that one
    if (activeExercises.length > 0 && !activeExerciseId) {
      setActiveExerciseId(activeExercises[0].id);
    }

    const interval = setInterval(() => {
      setWorkoutTimer(prev => prev + 1);

      // Also update active time if not in rest period
      if (!isResting) {
        setTotalActiveTime(prev => prev + 1);
      }
    }, 1000);
    setTimerInterval(interval);
  };

  const pauseWorkout = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsPaused(true);
  };

  const resumeWorkout = () => {
    startWorkout();
  };

  const completeWorkout = async () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    try {
      // Include detailed timing data
      const result = await dispatch(completeWorkoutDay({
        id: workout.id,
        duration: workoutTimer,
        activeTime: totalActiveTime,
        restTime: totalRestTime,
        exerciseTimings: exerciseTimers
      }));

      setWorkoutTimer(0);
      setWorkoutStarted(false);
      setWorkoutComplete(false);
      setTotalActiveTime(0);
      setTotalRestTime(0);

      // Check if the program is complete
      if (result && result.nextWorkout === "All Workouts Completed") {
        setShowProgramCompleteDialog(true);
      }

    } catch (error) {
      console.error("Error completing workout:", error);
      toast.error("Failed to save your workout progress. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const completeRestDay = async () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    try {
      const result = await dispatch(completeWorkoutDay({
        id: workout.id,
        duration: workoutTimer,
        isRestDay: true
      }));

      setWorkoutTimer(0);
      setWorkoutStarted(false);

      if (result && result.nextWorkout === "All Workouts Completed") {
        setShowProgramCompleteDialog(true);
      }
    } catch (error) {
      console.error("Error completing rest day:", error);
      toast.error("Failed to save your rest day progress. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 0) return "00:00";

    // Format with hours if needed
    if (seconds >= 3600) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
  };

  const getExerciseTimeComparison = (exerciseId) => {
    // If we have previous workout data, we could compare times
    // This is a placeholder that would be implemented with real data
    const currentTime = exerciseTimers[exerciseId] || 0;

    // Mock comparison - would be replaced with real comparison data
    const previousTime = currentTime * 1.1; // Just for demonstration

    if (currentTime > previousTime) {
      return { status: "slower", difference: Math.round(currentTime - previousTime) };
    } else if (currentTime < previousTime) {
      return { status: "faster", difference: Math.round(previousTime - currentTime) };
    }
    return { status: "same", difference: 0 };
  };

  const getCompletionPercentage = () => {
    if (activeExercises.length === 0) return 0;
    return (activeExercises.filter(e => e.completed).length / activeExercises.length) * 100;
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading workout...</h1>
        </div>
      </div>
    )
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">An error occurred while loading the workout.</p>
          <Link to="/MyWorkouts">
            <Button>My Workouts</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Not found state
  if (!workout) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Workout Not Found</h1>
          <p className="text-muted-foreground mb-6">The workout you're looking for doesn't exist.</p>
          <Link to="/MyWorkouts">
            <Button>My Workouts</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <RootLayout>
      <div className="container mx-auto py-10 px-12">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        <Link to="/MyWorkouts" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to my workouts
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                <div>
                  <h1 className="text-3xl font-bold">{workout.title}</h1>
                  <p className="text-muted-foreground">
                    Day {workout.currentDay} of {workout.totalDays}: {workout?.days?.find(day => day.day === workout.currentDay)?.dayName || "No workout today"}
                  </p>
                </div>

                {workoutStarted ? (
                  <div className="flex items-center gap-2">
                    {/* Enhanced timer display */}
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-mono bg-primary/10 text-primary px-3 py-1 rounded-md">
                        {formatTime(workoutTimer)}
                      </div>
                      {estimatedTimeRemaining !== null && !workoutComplete && !isRestDay && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Est. remaining: {formatTime(estimatedTimeRemaining)}
                        </div>
                      )}
                    </div>

                    {/* Rest timer overlay */}
                    {isResting && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-background rounded-lg p-6 max-w-md w-full text-center">
                          <h3 className="text-2xl font-bold mb-2">Rest Time</h3>
                          <div className="text-6xl font-mono mb-6 text-primary">{formatTime(restTimer)}</div>
                          <p className="mb-4">Take a break before the next exercise</p>
                          <Button onClick={() => setIsResting(false)} variant="outline">
                            Skip Rest
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Workout control buttons */}
                    <div className="flex gap-2">
                      {isPaused ? (
                        <Button onClick={resumeWorkout} size="icon" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button onClick={pauseWorkout} size="icon" variant="outline">
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}

                      {workoutComplete || isRestDay ? (
                        <Button onClick={isRestDay ? completeRestDay : completeWorkout} className="gap-2">
                          <Trophy className="h-4 w-4" />
                          Finish {isRestDay ? "Rest Day" : "Workout"}
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          In Progress
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <Button onClick={startWorkout} className="gap-2">
                    <Play className="h-4 w-4" />
                    Start {isRestDay ? "Rest Day" : "Workout"}
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant={
                    workout.level === "Beginner"
                      ? "default"
                      : workout.level === "Intermediate"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {workout.level}
                </Badge>
                <Badge variant="outline">{workout.category}</Badge>
                {!isRestDay && <Badge variant="outline">{activeExercises.length} exercises</Badge>}
                {isRestDay && <Badge variant="outline">Rest Day</Badge>}
              </div>

              {/* Enhanced progress visualization */}
              <div className="mb-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Progress</span>
                  <span>{workout.progress}%</span>
                </div>
                <Progress value={workout.progress} className="h-2 mb-2" />

                {/* Workout completion timeline */}
                {!isRestDay && workoutStarted && (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Today's Workout</span>
                      <span>{getCompletionPercentage().toFixed(0)}%</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-primary rounded-full"
                        style={{ width: `${getCompletionPercentage()}%` }}
                      />
                      {/* Exercise completion markers */}
                      {activeExercises.map((ex, index) => {
                        if (ex.completed) {
                          return (
                            <div
                              key={ex.id}
                              className="absolute top-0 h-full w-1 bg-green-500"
                              style={{
                                left: `${((index + 1) / activeExercises.length) * 100}%`,
                                transform: 'translateX(-50%)'
                              }}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Previous workout comparison */}
              {previousWorkoutTime && !isRestDay && (
                <div className="text-sm text-muted-foreground mb-4 p-2 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Last workout: {formatTime(previousWorkoutTime)}</span>
                    {workoutTimer > 0 && (
                      <span className={workoutTimer > previousWorkoutTime ? "text-yellow-500" : "text-green-500"}>
                        {workoutTimer > previousWorkoutTime
                          ? `(${formatTime(workoutTimer - previousWorkoutTime)} slower)`
                          : `(${formatTime(previousWorkoutTime - workoutTimer)} faster)`}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isRestDay ? (
              <Card>
                <CardHeader>
                  <CardTitle>Rest Day</CardTitle>
                  <CardDescription>Today is your scheduled rest day. Focus on recovery!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <div className="mb-4">
                      <Battery className="h-16 w-16 mx-auto text-green-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Recovery Recommendations:</h3>
                    <ul className="text-left space-y-2 max-w-md mx-auto">
                      <li>• Stay hydrated</li>
                      <li>• Get adequate sleep</li>
                      <li>• Light stretching if needed</li>
                      <li>• Proper nutrition</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Exercises</CardTitle>
                  <CardDescription>Complete all exercises to finish today's workout</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeExercises.map((exercise, index) => (
                      <div
                        key={exercise.id}
                        className={`p-4 rounded-lg border ${exercise.completed ? "bg-primary/5 border-primary/20" : "bg-background"}`}
                      >
                        <div className="flex items-start">
                          <div className="mr-4">
                            <Checkbox
                              checked={exercise.completed}
                              onCheckedChange={() => toggleExerciseComplete(exercise.id)}
                              disabled={!workoutStarted}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                              <h3 className="font-medium text-lg">
                                {index + 1}. {exercise.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="w-fit">
                                  {exercise.equipment}
                                </Badge>

                                {/* Time tracking per exercise */}
                                {exercise.completed && exerciseTimers[exercise.id] > 0 && (
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(exerciseTimers[exercise.id])}

                                    {/* Time comparison with previous */}
                                    {workoutStarted && (
                                      <span className="ml-1">
                                        {(() => {
                                          const comparison = getExerciseTimeComparison(exercise.id);
                                          if (comparison.status === "faster") {
                                            return <span className="text-green-500 text-xs">↓{formatTime(comparison.difference)}</span>;
                                          } else if (comparison.status === "slower") {
                                            return <span className="text-red-500 text-xs">↑{formatTime(comparison.difference)}</span>;
                                          }
                                          return null;
                                        })()}
                                      </span>
                                    )}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Sets: </span>
                                <span className="font-medium">{exercise.sets}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Reps: </span>
                                <span className="font-medium">{exercise.reps}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Rest: </span>
                                <span className="font-medium">{exercise.rest}</span>
                              </div>
                            </div>

                            {/* Timer control per exercise */}
                            {workoutStarted && !exercise.completed && (
                              <div className="mt-3 flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startRestTimer(parseInt(exercise.rest) || 60)}
                                  className="text-xs flex items-center gap-1"
                                >
                                  <Timer className="h-3 w-3" />
                                  Start Rest Timer
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Workout Summary</CardTitle>
                <CardDescription>Track your progress for this workout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isRestDay && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exercises:</span>
                      <span>
                        {activeExercises.filter((e) => e.completed).length} of {activeExercises.length} completed
                      </span>
                    </div>
                    <Progress
                      value={(activeExercises.filter((e) => e.completed).length / activeExercises.length) * 100}
                      className="h-2"
                    />
                  </div>
                )}

                {/* Enhanced time tracking */}
                <div className="pt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Total Time</span>
                    </div>
                    <div className="font-mono">{formatTime(workoutTimer)}</div>
                  </div>

                  {workoutStarted && !isRestDay && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Dumbbell className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>Active Time</span>
                        </div>
                        <div className="font-mono">{formatTime(totalActiveTime)}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Timer className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>Rest Time</span>
                        </div>
                        <div className="font-mono">{formatTime(totalRestTime)}</div>
                      </div>

                      {estimatedTimeRemaining !== null && !workoutComplete && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>Est. Remaining</span>
                          </div>
                          <div className="font-mono">{formatTime(estimatedTimeRemaining)}</div>
                        </div>
                      )}
                    </>
                  )}

                  {!isRestDay && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Dumbbell className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>Total Sets</span>
                      </div>
                      <div>{activeExercises.reduce((sum, ex) => sum + parseInt(ex.sets || 0), 0)}</div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Status</span>
                    </div>
                    <div>
                      {!workoutStarted ? (
                        <Badge variant="outline">Not Started</Badge>
                      ) : isRestDay ? (
                        <Badge variant="secondary">Rest Day</Badge>
                      ) : workoutComplete ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          Completed
                        </Badge>
                      ) : isPaused ? (
                        <Badge variant="warning">Paused</Badge>
                      ) : (
                        <Badge variant="secondary">In Progress</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                {workoutStarted ? (
                  isRestDay ? (
                    <Button
                      className="w-full gap-2"
                      onClick={completeRestDay}
                    >
                      <Check className="h-4 w-4" />
                      Complete Rest Day
                    </Button>
                  ) : workoutComplete ? (
                    <Button className="w-full gap-2" onClick={completeWorkout}>
                      <Trophy className="h-4 w-4" />
                      Finish Workout
                    </Button>
                  ) : isPaused ? (
                    <Button className="w-full gap-2" onClick={resumeWorkout}>
                      <Play className="h-4 w-4" />
                      Resume Workout
                    </Button>
                  ) : (
                    <Button className="w-full gap-2" onClick={pauseWorkout}>
                      <Pause className="h-4 w-4" />
                      Pause Workout
                    </Button>
                  )
                ) : (
                  <Button className="w-full gap-2" onClick={startWorkout}>
                    <Play className="h-4 w-4" />
                    Start {isRestDay ? "Rest Day" : "Workout"}
                  </Button>
                )}

                {/* <Button variant="outline" className="w-full gap-2">
                  <Share className="h-4 w-4" />
                  Share Workout
                </Button> */}

                {workoutStarted && !isRestDay && !workoutComplete && (
                  <Button variant="outline" className="w-full gap-2" onClick={() => startRestTimer(60)}>
                    <Timer className="h-4 w-4" />
                    Start Rest Timer
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Circular Timer Visualization */}
        {workoutStarted && !isRestDay && (
          <div className="fixed bottom-6 right-6 h-24 w-24">
            <div className="relative h-full w-full">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>

                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="45" fill="transparent"
                  stroke="#3b82f6" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - getCompletionPercentage() / 100)}
                  transform="rotate(-90 50 50)"
                />

                {/* TIME TEXT */}
                <text
                  x="50"
                  y="45"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="url(#timeGradient)"
                >
                  {formatTime(workoutTimer)}
                </text>

                {/* PERCENTAGE TEXT */}
                <text
                  x="50"
                  y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="#94a3b8"
                >
                  {getCompletionPercentage().toFixed(0)}%
                </text>
              </svg>

            </div>
          </div>
        )}

        {/* Workout complete dialog */}
        {/* {console.log(workout)}
        {console.log(completed[0])} */}
      {/* Workout complete dialog */}
<Dialog open={showProgramCompleteDialog} onOpenChange={setShowProgramCompleteDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Program Completed!</DialogTitle>
      <DialogDescription>Congratulations! You've completed the entire workout program.</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <div className="flex items-center justify-center mb-6">
        <Trophy className="h-16 w-16 text-yellow-500" />
      </div>
      <div className="space-y-4">
        {/* Program Title */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Program:</span>
          <span className="font-medium">{workout?.title || "Workout Program"}</span>
        </div>
        
        {/* Workouts Completed Count */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Workouts Completed:</span>
          <span className="font-medium">
            {(() => {
              // Check if completed data exists
              if (!completed || !Array.isArray(completed) || completed.length === 0) {
                return "0/0";
              }
              
              // Find the completed workout that matches the current workout ID
              const completedWorkout = completed.find(item => item.id === workout.id);
              
              if (completedWorkout) {
                return `${completedWorkout.completedWorkouts}/${completedWorkout.totalWorkouts}`;
              } else {
                // If matching workout not found, search by title as fallback
                const completedByTitle = completed.find(item => 
                  item.title && workout.title && item.title === workout.title
                );
                
                return completedByTitle
                  ? `${completedByTitle.completedWorkouts}/${completedByTitle.totalWorkouts}`
                  : "0/0";
              }
            })()}
          </span>
        </div>
        
        {/* Streak */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Your Streak:</span>
          <span className="font-medium">{workout?.streak || 0} days</span>
        </div>
        
        {/* Total Duration if available */}
        {(() => {
          // Find the completed workout to get total duration
          if (completed && Array.isArray(completed) && completed.length > 0) {
            const completedWorkout = completed.find(item => item.id === workout.id);
            
            if (completedWorkout && completedWorkout.totalDuration) {
              return (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Time Invested:</span>
                  <span className="font-medium">{formatTime(completedWorkout.totalDuration)}</span>
                </div>
              );
            }
          }
          return null;
        })()}
      </div>
    </div>
    <DialogFooter>
      <Button asChild className="w-full">
        <Link to="/MyWorkouts">View All Workouts</Link>
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
        {/* Daily workout complete dialog */}
        <Dialog open={workoutComplete && workoutStarted && !isRestDay} onOpenChange={(open) => setWorkoutComplete(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Workout Completed!</DialogTitle>
              <DialogDescription>Great job! You've completed today's workout.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center justify-center mb-6">
                <Trophy className="h-16 w-16 text-yellow-500" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Workout:</span>
                  <span className="font-medium">{workout.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Day:</span>
                  <span className="font-medium">
                    Day {workout?.days?.[0]?.day} - {workout?.days?.[0]?.focus}
                  </span>
                </div>

                {/* Enhanced completion stats */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Time:</span>
                  <span className="font-medium">{formatTime(workoutTimer)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Time:</span>
                  <span className="font-medium">{formatTime(totalActiveTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rest Time:</span>
                  <span className="font-medium">{formatTime(totalRestTime)}</span>
                </div>

                {previousWorkoutTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compared to last time:</span>
                    <span className={workoutTimer > previousWorkoutTime ? "text-yellow-500" : "text-green-500"}>
                      {workoutTimer > previousWorkoutTime
                        ? `${formatTime(workoutTimer - previousWorkoutTime)} slower`
                        : `${formatTime(previousWorkoutTime - workoutTimer)} faster`}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exercises Completed:</span>
                  <span className="font-medium">
                    {activeExercises.length}/{activeExercises.length}
                  </span>
                </div>

                {/* Exercise breakdown */}
                <div className="mt-2 pt-2 border-t">
                  <h4 className="text-sm font-medium mb-2">Exercise Breakdown:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {activeExercises.map((exercise, idx) => (
                      <div key={exercise.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{idx + 1}. {exercise.name}:</span>
                        <span className="font-mono">{formatTime(exerciseTimers[exercise.id] || 0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={completeWorkout} className="w-full">
                Save & Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RootLayout>
  )
}