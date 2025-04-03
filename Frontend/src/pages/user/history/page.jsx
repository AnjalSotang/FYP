import { useState } from "react"
import {Link} from 'react-router-dom'
import { format, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronLeft, Clock, Dumbbell, Flame } from "lucide-react"

// Mock data for workout history - this would come from the API
const workoutHistoryData = [
  {
    id: 1,
    date: "2025-03-14",
    workoutName: "Upper Body Strength",
    duration: 45,
    calories: 320,
    exercises: [
      { name: "Bench Press", sets: 3, reps: "8, 8, 6", weight: "135, 145, 155" },
      { name: "Pull-ups", sets: 3, reps: "10, 8, 8", weight: "Bodyweight" },
      { name: "Shoulder Press", sets: 3, reps: "10, 10, 8", weight: "45, 50, 50" },
      { name: "Bicep Curls", sets: 3, reps: "12, 12, 10", weight: "25, 25, 30" },
    ],
    notes: "Felt strong today, increased weight on bench press.",
  },
  {
    id: 2,
    date: "2025-03-12",
    workoutName: "Lower Body Focus",
    duration: 50,
    calories: 380,
    exercises: [
      { name: "Squats", sets: 4, reps: "10, 10, 8, 8", weight: "185, 205, 225, 225" },
      { name: "Deadlifts", sets: 3, reps: "8, 8, 6", weight: "225, 245, 265" },
      { name: "Leg Press", sets: 3, reps: "12, 12, 10", weight: "270, 290, 310" },
      { name: "Calf Raises", sets: 3, reps: "15, 15, 15", weight: "120, 120, 120" },
    ],
    notes: "Great leg day, feeling the burn!",
  },
  {
    id: 3,
    date: "2025-03-11",
    workoutName: "Core & Cardio",
    duration: 30,
    calories: 250,
    exercises: [
      { name: "Plank", sets: 3, reps: "60s, 45s, 45s", weight: "Bodyweight" },
      { name: "Russian Twists", sets: 3, reps: "20, 20, 20", weight: "15, 15, 15" },
      { name: "Mountain Climbers", sets: 3, reps: "30s, 30s, 30s", weight: "Bodyweight" },
      { name: "Treadmill", sets: 1, reps: "15 min", weight: "Incline 2.0" },
    ],
    notes: "Quick session but effective.",
  },
  {
    id: 4,
    date: "2025-03-09",
    workoutName: "Full Body Workout",
    duration: 45,
    calories: 340,
    exercises: [
      { name: "Push-ups", sets: 3, reps: "15, 12, 10", weight: "Bodyweight" },
      { name: "Dumbbell Rows", sets: 3, reps: "12, 12, 12", weight: "40, 45, 45" },
      { name: "Lunges", sets: 3, reps: "10, 10, 10", weight: "25, 25, 25" },
      { name: "Shoulder Press", sets: 3, reps: "10, 8, 8", weight: "35, 35, 35" },
    ],
    notes: "Solid full body session.",
  },
  {
    id: 5,
    date: "2025-03-08",
    workoutName: "HIIT Training",
    duration: 60,
    calories: 450,
    exercises: [
      { name: "Burpees", sets: 4, reps: "15, 15, 12, 12", weight: "Bodyweight" },
      { name: "Box Jumps", sets: 4, reps: "12, 12, 10, 10", weight: "24 inch box" },
      { name: "Battle Ropes", sets: 4, reps: "30s, 30s, 30s, 30s", weight: "Heavy ropes" },
      { name: "Kettlebell Swings", sets: 4, reps: "15, 15, 15, 15", weight: "35, 35, 35, 35" },
    ],
    notes: "Intense session, really pushed myself today.",
  },
]

// Helper function to get workout dates for calendar highlighting
const getWorkoutDates = (history) => {
  return history.map((workout) => new Date(workout.date))
}

export default function WorkoutHistoryPage() {
  const [view, setView] = useState("list")
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [timeframe, setTimeframe] = useState("all")

  // Filter workouts based on timeframe
  const filteredWorkouts = (() => {
    switch (timeframe) {
      case "week":
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return workoutHistoryData.filter((workout) => new Date(workout.date) >= oneWeekAgo)
      case "month":
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        return workoutHistoryData.filter((workout) => new Date(workout.date) >= oneMonthAgo)
      case "all":
      default:
        return workoutHistoryData
    }
  })()

  // Calendar date highlighting
  const workoutDates = getWorkoutDates(workoutHistoryData)

  // Stats calculation
  const totalWorkouts = filteredWorkouts.length
  const totalDuration = filteredWorkouts.reduce((sum, workout) => sum + workout.duration, 0)
  const totalCalories = filteredWorkouts.reduce((sum, workout) => sum + workout.calories, 0)

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Workout History</h1>
          <p className="text-muted-foreground">Track and review your past workouts</p>
        </div>

        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-3xl font-bold mr-3">{totalWorkouts}</div>
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-3xl font-bold mr-3">
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
            </div>
            <Clock className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-3xl font-bold mr-3">{totalCalories}</div>
            <Flame className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Trained</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-3xl font-bold mr-3">Legs</div>
            <Dumbbell className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" onValueChange={setView} className="mb-8">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {filteredWorkouts.length > 0 ? (
            <div className="space-y-4">
              {filteredWorkouts.map((workout) => (
                <Card key={workout.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 bg-muted p-6 flex flex-col justify-center items-center">
                      <div className="text-2xl font-bold">{format(new Date(workout.date), "MMM d")}</div>
                      <div className="text-lg">{format(new Date(workout.date), "yyyy")}</div>
                      <Badge className="mt-2">{workout.workoutName}</Badge>
                    </div>
                    <div className="flex-1">
                      <CardHeader>
                        <CardTitle>{workout.workoutName}</CardTitle>
                        <CardDescription>
                          {workout.duration} minutes • {workout.calories} calories
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="font-medium">Exercises:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {workout.exercises.map((exercise, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{exercise.name}</span>
                                <span className="text-muted-foreground">
                                  {exercise.sets} × {exercise.reps}
                                </span>
                              </div>
                            ))}
                          </div>
                          {workout.notes && (
                            <div className="mt-4 text-sm">
                              <div className="font-medium">Notes:</div>
                              <div className="text-muted-foreground">{workout.notes}</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No workouts found</h3>
              <p className="text-muted-foreground mb-4">No workout history found for the selected timeframe.</p>
              <Button>Log a Workout</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Calendar</CardTitle>
              <CardDescription>View your workout history by date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <Calendar
                    mode="single"
                    selected={selectedWorkout ? new Date(selectedWorkout.date) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const workout = workoutHistoryData.find((w) => isSameDay(new Date(w.date), date))
                        setSelectedWorkout(workout || null)
                      }
                    }}
                    className="rounded-md border"
                    modifiers={{
                      workout: workoutDates,
                    }}
                    modifiersStyles={{
                      workout: {
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        fontWeight: "bold",
                        borderRadius: "0.25rem",
                      },
                    }}
                  />
                </div>

                <div className="md:w-1/2">
                  {selectedWorkout ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold">{selectedWorkout.workoutName}</h3>
                        <p className="text-muted-foreground">
                          {format(new Date(selectedWorkout.date), "MMMM d, yyyy")}
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedWorkout.duration} min</span>
                        </div>
                        <div className="flex items-center">
                          <Flame className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedWorkout.calories} cal</span>
                        </div>
                      </div>

                      <div>
                        <div className="font-medium mb-2">Exercises:</div>
                        <div className="space-y-2">
                          {selectedWorkout.exercises.map((exercise, idx) => (
                            <div key={idx} className="flex flex-col">
                              <div className="font-medium">{exercise.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {exercise.sets} sets • {exercise.reps} • {exercise.weight}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedWorkout.notes && (
                        <div>
                          <div className="font-medium">Notes:</div>
                          <div className="text-muted-foreground">{selectedWorkout.notes}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Select a date to view workout details</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

