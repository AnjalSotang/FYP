import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Printer, Save, Share, Dumbbell, Clock, RotateCcw } from "lucide-react"
import { WorkoutDay } from "./workout-day"
import { useEffect, useState } from 'react';
import { addUserWorkout, setStatus } from "../../../../../store/userWorkoutSlice";
import { useDispatch, useSelector } from "react-redux";
import STATUSES from "../../../../globals/status/statuses";
import "react-toastify/dist/ReactToastify.css";
import classNames from "classnames"
import RootLayout from "../../../../components/layout/UserLayout";



export function GeneratedWorkout({ formData, workoutData, onReset }) {
  const dispatch = useDispatch();
  const { status: status1 } = useSelector((state) => state.userWorkout);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null); // <-- Add this
  

  // Use the AI-generated workout if available, otherwise fall back to the mock data
  console.log("Received workout data:", workoutData)
  const workout = (workoutData && Object.keys(workoutData).length > 0)
    ? workoutData.workout
    : generateMockWorkout(formData)


  const planId = workout.id;


  // useEffect to dispatch when selectedPlanId changes
  useEffect(() => {
    if (selectedPlanId !== null) { // Prevent initial empty state from dispatching
      console.log("Dispatching workout for plan:", selectedPlanId);
      dispatch(addUserWorkout(selectedPlanId));
      setSelectedPlanId(null); // Reset state to prevent infinite loop
    }
  }, [selectedPlanId, dispatch]); // Runs when selectedPlanId changes



  // Make sure the workout days exist to prevent errors
  const workoutDays = workout?.days || []

  // Transform workout days to match the expected format for the component
  const transformedDays = workoutDays.map(day => ({
    day: day.dayNumber.toString(),
    focus: day.dayName.includes(":") ? day.dayName.split(":")[1].trim() : day.dayName,
    exercises: day.excercises.map(exercise => ({
      name: exercise.name,
      sets: exercise.WorkoutDayExercise.sets,
      reps: exercise.WorkoutDayExercise.reps,
      rest: `${exercise.WorkoutDayExercise.rest_time} sec`,
      equipment: exercise.equipment,
      instructions: exercise.instructions,
      muscle_group: exercise.muscle_group
    }))
  }))

  const handleSaveWorkout = async (planId) => {
    if (planId && planId !== selectedPlanId) {
      try {
        setIsLoading(true); // 🔹 Start loading
        setSelectedPlanId(planId); // This triggers the useEffect
        toast.success("Your workout plan has been saved to your profile.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      } catch (error) {
        console.error("Error saving workout:", error);
        toast.error("Something went wrong while saving the workout.");
      } finally {
        setIsLoading(false); // 🔹 Stop loading after save
      }
    }
  };
  

  const handleShareWorkout = () => {
    // In a real app, this would generate a shareable link
    navigator.clipboard
      .writeText(`${window.location.origin}/shared-workout/${workout.id || '123'}`)
      .then(() => {
        toast.info("Shareable link has been copied to your clipboard.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      })
      .catch(() => {
        toast.error("Failed to copy link to clipboard.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      })
  }

  const handlePrintWorkout = () => {
    window.print();
    toast.info("Printing workout plan...", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true
    });
  }

  // If workout is undefined or missing critical data, show an error state
  if (!workout || (!workout.name && !workout.title)) {
    return (
      <div className="container mx-auto py-10 px-4">
        <ToastContainer />
        <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to home
        </Link>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Error Loading Workout</CardTitle>
            <CardDescription>There was a problem generating your workout plan</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We couldn't generate your workout plan. This might be due to missing information.</p>
            <Button onClick={onReset}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Map the workout properties to the expected format
  const workoutTitle = workout.name || workout.title
  const workoutDescription = workout.description
  const workoutLevel = workout.level || formData?.experience || "Beginner"
  const workoutDuration = workout.duration || formData?.duration || 45
  const workoutFocus = (formData?.focus && formData.focus.length > 0)
    ? formData.focus.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(", ")
    : "Full Body"

    // 🔥 Handle Status Updates
    useEffect(() => {
      if (status1?.status === STATUSES.SUCCESS) {
        // navigate("/");
        toast.success(status1.message);
        console.log(status1.message);
        setIsLoading(false);
        dispatch(setStatus(null));
      } else if (status1?.status === STATUSES.ERROR) {
        toast.error(status1.message);
      }
    }, [status1]);
  

  return (
    <RootLayout>
 <div className="container mx-auto py-10 px-12">
      <ToastContainer />
      <Link to="/user" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to home
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{workoutTitle}</h1>
            <p className="text-muted-foreground">{workoutDescription}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onReset} className="gap-1">
              <RotateCcw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={handlePrintWorkout}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={handleShareWorkout}>
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button
              className={classNames(
                "w-full sm:w-auto gap-3",
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              )}
              size="sm"
              onClick={() => handleSaveWorkout(planId)}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save 
                </>
              )}
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Workout Overview</CardTitle>
            <CardDescription>A {workoutDays.filter(day => !day.dayName.includes("Rest Day")).length}-day workout plan tailored to your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Days Per Week</div>
                <div className="text-2xl font-bold">{workoutDays.filter(day => !day.dayName.includes("Rest Day")).length}</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Duration</div>
                <div className="text-2xl font-bold">{workoutDuration} min</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Level</div>
                <div className="text-2xl font-bold capitalize">{workoutLevel}</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Goal</div>
                <div className="text-2xl font-bold capitalize">
                  {workout.goal ? workout.goal.replace(/-/g, ' ') : "Build Muscle"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {transformedDays.length > 0 ? (
          <Tabs defaultValue="1" className="mb-8">
            <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${transformedDays.length}, 1fr)` }}>
              {transformedDays.map((day) => (
                <TabsTrigger key={day.day} value={day.day}>
                  Day {day.day}
                </TabsTrigger>
              ))}
            </TabsList>

            {transformedDays.map((day) => (
              <TabsContent key={day.day} value={day.day}>
                <WorkoutDay day={day} />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Card className="mb-8">
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">No workout days have been generated.</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Ready to start?</CardTitle>
            <CardDescription>Save this workout plan to your profile to track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{workoutTitle}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{workoutDuration} min per session</span>
                  </div>
                </div>
              </div>

              <Badge variant="outline" className="text-sm">
                {workoutDays.filter(day => !day.dayName.includes("Rest Day")).length} days/week
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">




            <Button
              className={classNames(
                "w-full sm:w-auto gap-3",
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              )}
              size="lg"
              onClick={() => handleSaveWorkout(planId)}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save to My Workouts
                </>
              )}
            </Button>

            <Link to="/user" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full" size="lg">
                View in Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>

    </RootLayout>
   
  )
}

// Keep the generateMockWorkout function as a fallback
function generateMockWorkout(formData) {
  // Handle case where formData might be undefined or incomplete
  if (!formData) {
    formData = {
      days: 3,
      goal: "general-fitness",
      equipment: "minimal",
      experience: "beginner",
      duration: 45,
      focus: []
    }
  }

  // Ensure formData has default values for essential properties
  const days = formData.days || 3
  const workoutDays = []

  const workoutTypes = {
    "lose-weight": "Fat Loss",
    "build-muscle": "Muscle Building",
    "increase-strength": "Strength Training",
    "improve-endurance": "Endurance",
    "general-fitness": "General Fitness",
  }

  const workoutTitle = workoutTypes[formData.goal] || "Custom Workout"

  // Generate workout days based on user preferences
  for (let i = 1; i <= days; i++) {
    let dayFocus = ""

    // Check if focus exists before accessing it
    if (formData.focus && formData.focus.includes && formData.focus.includes("upper")) {
      dayFocus = "Upper Body"
    } else if (formData.focus && formData.focus.includes && formData.focus.includes("lower")) {
      dayFocus = "Lower Body"
    } else if (formData.focus && formData.focus.includes && formData.focus.includes("core")) {
      dayFocus = "Core"
    } else {
      // If no specific focus or "all" is selected, rotate through different focuses
      if (days <= 3) {
        dayFocus = i === 1 ? "Full Body" : i === 2 ? "Cardio & Core" : "Full Body"
      } else {
        dayFocus = i % 4 === 1 ? "Upper Body" : i % 4 === 2 ? "Lower Body" : i % 4 === 3 ? "Core & Cardio" : "Full Body"
      }
    }

    const exercises = generateExercisesForDay(dayFocus, formData.equipment, formData.experience)

    workoutDays.push({
      day: i.toString(),
      focus: dayFocus,
      exercises,
    })
  }

  return {
    title: `${workoutTitle} Plan`,
    description: `${days}-day workout plan designed for ${formData.experience || "beginner"} level with ${formData.equipment === "full" ? "full gym access" : formData.equipment === "home" ? "home gym equipment" : formData.equipment === "minimal" ? "minimal equipment" : "no equipment"}. Each workout takes approximately ${formData.duration || 45} minutes.`,
    days: workoutDays,
  }
}

// Helper function to generate exercises for each day
function generateExercisesForDay(focus, equipment, experience) {
  // Ensure defaults for null/undefined parameters
  focus = focus || "Full Body"
  equipment = equipment || "minimal"
  experience = experience || "beginner"

  // This would be replaced with actual AI-generated exercises
  const exercisesByFocus = {
    "Upper Body": [
      { name: "Push-ups", sets: 3, reps: "10-12", rest: "60 sec", equipment: "Bodyweight" },
      { name: "Dumbbell Rows", sets: 3, reps: "12", rest: "60 sec", equipment: "Dumbbells" },
      { name: "Shoulder Press", sets: 3, reps: "10", rest: "90 sec", equipment: "Dumbbells" },
      { name: "Bicep Curls", sets: 3, reps: "12", rest: "60 sec", equipment: "Dumbbells" },
      { name: "Tricep Dips", sets: 3, reps: "10-15", rest: "60 sec", equipment: "Bench" },
    ],
    "Lower Body": [
      { name: "Squats", sets: 4, reps: "12", rest: "90 sec", equipment: "Bodyweight/Barbell" },
      { name: "Lunges", sets: 3, reps: "10 each leg", rest: "60 sec", equipment: "Bodyweight/Dumbbells" },
      { name: "Deadlifts", sets: 3, reps: "8-10", rest: "120 sec", equipment: "Barbell" },
      { name: "Calf Raises", sets: 3, reps: "15-20", rest: "60 sec", equipment: "Bodyweight/Dumbbells" },
      { name: "Leg Press", sets: 3, reps: "12", rest: "90 sec", equipment: "Machine" },
    ],
    Core: [
      { name: "Plank", sets: 3, reps: "30-60 sec", rest: "45 sec", equipment: "Bodyweight" },
      { name: "Russian Twists", sets: 3, reps: "20 total", rest: "45 sec", equipment: "Bodyweight/Weight" },
      { name: "Bicycle Crunches", sets: 3, reps: "20 total", rest: "45 sec", equipment: "Bodyweight" },
      { name: "Leg Raises", sets: 3, reps: "12-15", rest: "60 sec", equipment: "Bodyweight" },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec", rest: "30 sec", equipment: "Bodyweight" },
    ],
    "Full Body": [
      { name: "Burpees", sets: 3, reps: "10", rest: "60 sec", equipment: "Bodyweight" },
      { name: "Dumbbell Thrusters", sets: 3, reps: "12", rest: "60 sec", equipment: "Dumbbells" },
      { name: "Kettlebell Swings", sets: 3, reps: "15", rest: "60 sec", equipment: "Kettlebell" },
      { name: "Push-ups", sets: 3, reps: "12-15", rest: "60 sec", equipment: "Bodyweight" },
      { name: "Renegade Rows", sets: 3, reps: "8 each side", rest: "60 sec", equipment: "Dumbbells" },
      { name: "Jumping Jacks", sets: 3, reps: "30 sec", rest: "30 sec", equipment: "Bodyweight" },
    ],
    "Cardio & Core": [
      { name: "Jump Rope", sets: 1, reps: "5 min", rest: "60 sec", equipment: "Jump Rope" },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec", rest: "30 sec", equipment: "Bodyweight" },
      { name: "Plank", sets: 3, reps: "45 sec", rest: "30 sec", equipment: "Bodyweight" },
      { name: "High Knees", sets: 3, reps: "30 sec", rest: "30 sec", equipment: "Bodyweight" },
      { name: "Russian Twists", sets: 3, reps: "20 total", rest: "30 sec", equipment: "Bodyweight/Weight" },
    ],
  }

  // Filter exercises based on equipment availability
  let availableExercises = exercisesByFocus[focus] || exercisesByFocus["Full Body"]

  if (equipment === "none") {
    availableExercises = availableExercises.filter((ex) => ex.equipment === "Bodyweight")
  } else if (equipment === "minimal") {
    availableExercises = availableExercises.filter(
      (ex) =>
        ex.equipment === "Bodyweight" ||
        ex.equipment === "Dumbbells" ||
        ex.equipment === "Resistance Bands" ||
        ex.equipment.includes("Bodyweight"),
    )
  }

  // Adjust number of exercises based on experience level
  const exerciseCount = experience === "beginner" ? 4 : experience === "intermediate" ? 5 : 6

  // If we don't have enough exercises after filtering, add some bodyweight ones
  if (availableExercises.length < exerciseCount) {
    const bodyweightExercises = exercisesByFocus["Full Body"].filter((ex) => ex.equipment === "Bodyweight")
    availableExercises = [...availableExercises, ...bodyweightExercises]
  }

  return availableExercises.slice(0, exerciseCount)
}