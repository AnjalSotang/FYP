import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, Clock, Dumbbell, Play, Share, Trophy } from "lucide-react"
import { useParams } from "react-router-dom";
import { fetchActiveWorkout, completeWorkoutDay } from "../../../../../store/userWorkoutSlice2"
// Near the top of your file, import the toast components
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setStatus } from "../../../../../store/userWorkoutSlice2"
import RootLayout from '../../../../components/layout/UserLayout';


export default function WorkoutPage() {
  const [showProgramCompleteDialog, setShowProgramCompleteDialog] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  console.log(id)


  // Get workout from Redux store
  const activeWorkout = useSelector((state) => state.userWorkout2.data.activeWorkouts1); // ✅ Safe access
  const { status } = useSelector((state) => state.userWorkout2); // ✅ Safe access


  // console.log(status)
  const workout = activeWorkout;
  console.log(workout)
  console.log(workout.id)


  // Local state for workout tracking
  const [activeExercises, setActiveExercises] = useState([])
  const [workoutComplete, setWorkoutComplete] = useState(false)
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [workoutTimer, setWorkoutTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState(null)


  // Fetch workout data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchActiveWorkout(id));
    }
  }, [dispatch, id]);

  // Update local state when workout data is loaded
  useEffect(() => {
    if (workout && workout.days && workout.days.length > 0) {
      setActiveExercises(workout.days[0].exercises || []);
    }
  }, [workout]);


  // console.log(activeExercises)

  const toggleExerciseComplete = (id) => {
    setActiveExercises(
      activeExercises.map((exercise) =>
        exercise.id === id ? { ...exercise, completed: !exercise.completed } : exercise,
      ),
    )

    // Check if all exercises are completed
    const updatedExercises = activeExercises.map((exercise) =>
      exercise.id === id ? { ...exercise, completed: !exercise.completed } : exercise,
    )

    if (updatedExercises.every((exercise) => exercise.completed)) {
      setWorkoutComplete(true)
    } else {
      setWorkoutComplete(false)
    }
  }

  const startWorkout = () => {
    setWorkoutStarted(true)
    const interval = setInterval(() => {
      setWorkoutTimer((prev) => prev + 1)
    }, 1000)
    setTimerInterval(interval)
  }

  // In your completeWorkout function
  const completeWorkout = async () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    try {
      const result = await dispatch(completeWorkoutDay({ id: workout.id, duration: workoutTimer }));
      // console.log(workout.id)
      // Reset state after completion

      // const responseData = result.payload || result;

      setWorkoutTimer(0);
      setWorkoutStarted(false);
      setWorkoutComplete(false);

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

  //   // Add this useEffect to your component
  // useEffect(() => {
  //   if (workout && workout.nextWorkout === "All Workouts Completed") {
  //     setShowProgramCompleteDialog(true);
  //   }
  // }, [workout]);
  // const completeWorkout = async () => {
  //   if (timerInterval) {
  //     clearInterval(timerInterval);
  //     setTimerInterval(null);
  //   }

  //   try {
  //     await dispatch(completeWorkoutDay({ id: workout.id, duration: workoutTimer }));

  //     // Reset state after completion
  //     setWorkoutTimer(0);
  //     setWorkoutStarted(false);
  //     setWorkoutComplete(false);

  //     dispatch(fetchActiveWorkout(id));
  //   } catch (error) {
  //     console.error("Error completing workout:", error);
  //   }
  // };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }


  // Handle status updates
  useEffect(() => {
    if (status && status.status === 'success') {
      // First, capture the message to use in toast
      const message = status.message;

      // Clear the status first to prevent infinite loop
      // dispatch(setStatus(null));

      // Show the success toast with the captured message
      toast.success(message);

      // Now fetch the updated workout data
      // We need to wrap this in a setTimeout to ensure the status is fully cleared
      // before triggering a new action that might set status again
      // window.location.reload();

    }
  }, [status]);

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
          <p className="text-muted-foreground mb-6">{error || "An error occurred while loading the workout."}</p>
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
      <div className="container mx-auto py-10 px-4">
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
                    <div className="text-lg font-mono bg-primary/10 text-primary px-3 py-1 rounded-md">
                      {formatTime(workoutTimer)}
                    </div>
                    {workoutComplete ? (
                      <Button onClick={completeWorkout} className="gap-2">
                        <Trophy className="h-4 w-4" />
                        Finish Workout
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        In Progress
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button onClick={startWorkout} className="gap-2">
                    <Play className="h-4 w-4" />
                    Start Workout
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
                <Badge variant="outline">{activeExercises.length} exercises</Badge>
              </div>

              <Progress value={workout.progress} className="h-2 mb-2" />
              <div className="text-sm text-muted-foreground">{workout.progress}% of program completed</div>
            </div>

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
                            <Badge variant="outline" className="w-fit">
                              {exercise.equipment}
                            </Badge>
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Workout Summary</CardTitle>
                <CardDescription>Track your progress for this workout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="pt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Workout Time</span>
                    </div>
                    <div className="font-mono">{formatTime(workoutTimer)}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Dumbbell className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Total Sets</span>
                    </div>
                    <div>{activeExercises.reduce((sum, ex) => sum + parseInt(ex.sets || 0), 0)}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Status</span>
                    </div>
                    <div>
                      {!workoutStarted ? (
                        <Badge variant="outline">Not Started</Badge>
                      ) : workoutComplete ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="secondary">In Progress</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                {workoutComplete ? (
                  <Button className="w-full gap-2" onClick={completeWorkout}>
                    <Trophy className="h-4 w-4" />
                    Finish Workout
                  </Button>
                ) : !workoutStarted ? (
                  <Button className="w-full gap-2" onClick={startWorkout}>
                    <Play className="h-4 w-4" />
                    Start Workout
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    Complete All Exercises
                  </Button>
                )}

                <Button variant="outline" className="w-full gap-2">
                  <Share className="h-4 w-4" />
                  Share Workout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Add this dialog at the end of your component */}
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Program:</span>
                  <span className="font-medium">{workout.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Workouts Completed:</span>
                  <span className="font-medium">{workout.completedWorkouts}/{workout.totalWorkouts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Streak:</span>
                  <span className="font-medium">{workout.streak} days</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button asChild className="w-full">
                <Link to="/my-workouts">View All Workouts</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={workoutComplete && workoutStarted} onOpenChange={(open) => setWorkoutComplete(open)}>
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{formatTime(workoutTimer)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exercises Completed:</span>
                  <span className="font-medium">
                    {activeExercises.length}/{activeExercises.length}
                  </span>
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