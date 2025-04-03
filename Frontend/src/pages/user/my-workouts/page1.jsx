"use client"

import { useState } from "react"
import {Link} from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  BarChart,
  Calendar,
  ChevronRight,
  Clock,
  Dumbbell,
  Plus,
  Trash2,
  Activity,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { WorkoutProgressChart } from "../components/workout-progress-chart2"
import { CalendarHeatmap } from "../components/calender-heatmap"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for user's active workouts
const initialActiveWorkouts = [
  {
    id: 1,
    title: "30-Day Strength Challenge",
    progress: 40,
    nextWorkout: "Day 5: Upper Body",
    lastCompleted: "2 days ago",
    startDate: "Mar 1, 2025",
    image: "/placeholder.svg?height=200&width=300",
    category: "Strength",
    level: "Intermediate",
    completedWorkouts: 12,
    totalWorkouts: 30,
    streak: 3,
    history: [
      { date: "Mar 14", completed: true, duration: 45, performance: 95 },
      { date: "Mar 13", completed: false, duration: 0, performance: 0 },
      { date: "Mar 12", completed: true, duration: 50, performance: 90 },
      { date: "Mar 11", completed: true, duration: 30, performance: 85 },
      { date: "Mar 10", completed: false, duration: 0, performance: 0 },
      { date: "Mar 9", completed: true, duration: 45, performance: 92 },
      { date: "Mar 8", completed: true, duration: 60, performance: 88 },
      { date: "Mar 7", completed: true, duration: 55, performance: 91 },
      { date: "Mar 6", completed: false, duration: 0, performance: 0 },
      { date: "Mar 5", completed: true, duration: 40, performance: 87 },
      { date: "Mar 4", completed: true, duration: 45, performance: 89 },
      { date: "Mar 3", completed: true, duration: 50, performance: 93 },
      { date: "Mar 2", completed: false, duration: 0, performance: 0 },
      { date: "Mar 1", completed: true, duration: 45, performance: 90 },
    ],
    metrics: {
      totalDuration: 510,
      averageDuration: 45,
      totalCaloriesBurned: 3800,
      averagePerformance: 90,
      improvementRate: 5.2,
      consistencyRate: 71,
    },
    muscleGroups: {
      chest: 25,
      back: 20,
      legs: 20,
      shoulders: 15,
      arms: 10,
      core: 10,
    },
    goals: [
      { name: "Complete 30 workouts", progress: 40 },
      { name: "Increase bench press by 10%", progress: 70 },
      { name: "Maintain 4 workouts per week", progress: 85 },
    ],
  },
  {
    id: 2,
    title: "Core Crusher",
    progress: 25,
    nextWorkout: "Day 3: Obliques Focus",
    lastCompleted: "Yesterday",
    startDate: "Mar 10, 2025",
    image: "/placeholder.svg?height=200&width=300",
    category: "Core",
    level: "Intermediate",
    completedWorkouts: 2,
    totalWorkouts: 8,
    streak: 1,
    history: [
      { date: "Mar 14", completed: true, duration: 30, performance: 88 },
      { date: "Mar 13", completed: false, duration: 0, performance: 0 },
      { date: "Mar 12", completed: true, duration: 35, performance: 85 },
    ],
    metrics: {
      totalDuration: 65,
      averageDuration: 32.5,
      totalCaloriesBurned: 450,
      averagePerformance: 86.5,
      improvementRate: 3.5,
      consistencyRate: 66,
    },
    muscleGroups: {
      core: 70,
      back: 15,
      shoulders: 10,
      legs: 5,
    },
    goals: [
      { name: "Complete 8 core workouts", progress: 25 },
      { name: "Improve plank time by 30s", progress: 40 },
      { name: "Develop visible abs definition", progress: 15 },
    ],
  },
]

// Mock data for completed workout plans
const completedWorkouts = [
  {
    id: 101,
    title: "HIIT Fat Burner",
    completedDate: "Feb 28, 2025",
    duration: "3 weeks",
    image: "/placeholder.svg?height=200&width=300",
    category: "Cardio",
    level: "Advanced",
    completedWorkouts: 15,
    totalWorkouts: 15,
    rating: 4,
    metrics: {
      totalDuration: 450,
      averageDuration: 30,
      totalCaloriesBurned: 4500,
      averagePerformance: 92,
      improvementRate: 8.5,
      consistencyRate: 100,
    },
  },
  {
    id: 102,
    title: "Beginner Full Body",
    completedDate: "Jan 15, 2025",
    duration: "6 weeks",
    image: "/placeholder.svg?height=200&width=300",
    category: "Full Body",
    level: "Beginner",
    completedWorkouts: 18,
    totalWorkouts: 18,
    rating: 5,
    metrics: {
      totalDuration: 720,
      averageDuration: 40,
      totalCaloriesBurned: 5400,
      averagePerformance: 88,
      improvementRate: 15.2,
      consistencyRate: 100,
    },
  },
]

export default function MyWorkoutsPage() {
  const [activeWorkouts, setActiveWorkouts] = useState(initialActiveWorkouts)
  const [selectedWorkout, setSelectedWorkout] = useState(activeWorkouts[0])
  const [workoutToDelete, setWorkoutToDelete] = useState(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState("all")
  const [selectedMetric, setSelectedMetric] = useState("performance")

  const handleDeleteWorkout = (id) => {
    setWorkoutToDelete(id)
  }

  const confirmDeleteWorkout = () => {
    if (workoutToDelete) {
      setActiveWorkouts(activeWorkouts.filter((workout) => workout.id !== workoutToDelete))
      setWorkoutToDelete(null)

      // If the deleted workout was the selected one, select the first available workout
      if (selectedWorkout.id === workoutToDelete) {
        const remainingWorkouts = activeWorkouts.filter((workout) => workout.id !== workoutToDelete)
        if (remainingWorkouts.length > 0) {
          setSelectedWorkout(remainingWorkouts[0])
        }
      }
    }
  }

  // Filter history based on selected timeframe
  const getFilteredHistory = () => {
    if (!selectedWorkout) return []

    const history = [...selectedWorkout.history].reverse() // Most recent first

    if (selectedTimeframe === "week") {
      return history.slice(0, 7)
    } else if (selectedTimeframe === "month") {
      return history.slice(0, 30)
    }

    return history
  }

  // Calculate completion percentage for the current week
  const calculateWeeklyCompletion = (workout) => {
    const lastSevenDays = workout.history.slice(0, 7)
    const completedDays = lastSevenDays.filter((day) => day.completed).length
    return (completedDays / 7) * 100
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Workouts</h1>
          <p className="text-muted-foreground">Track and manage your active workout plans</p>
        </div>

        <div className="flex gap-3">
          <Link href="/plans">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Workout Plan
            </Button>
          </Link>
          <Link href="/schedule">
            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Workout
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="active" className="mb-8">
        <TabsList>
          <TabsTrigger value="active">Active Plans ({activeWorkouts.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Plans ({completedWorkouts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Workout Plans</h3>
              <p className="text-muted-foreground mb-6">You don't have any active workout plans yet.</p>
              <Link href="/plans">
                <Button>Browse Workout Plans</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  {activeWorkouts.map((workout) => (
                    <Card
                      key={workout.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${selectedWorkout.id === workout.id ? "border-primary" : ""}`}
                      onClick={() => setSelectedWorkout(workout)}
                    >
                      <div className="flex p-4">
                        <img
                          src={workout.image || "/placeholder.svg"}
                          alt={workout.title}
                          className="w-20 h-20 object-cover rounded-md mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{workout.title}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteWorkout(workout.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {workout.completedWorkouts} of {workout.totalWorkouts} workouts completed
                          </div>
                          <Progress value={workout.progress} className="h-2" />

                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>Started: {workout.startDate}</span>
                            <span>{workout.progress}% complete</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Card className="border-dashed">
                    <Link href="/plans" className="block p-4">
                      <div className="flex items-center justify-center h-20">
                        <div className="text-center">
                          <Plus className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                          <span className="text-sm font-medium">Add Workout Plan</span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                </div>
              </div>

              <div className="lg:col-span-2">
                {selectedWorkout && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{selectedWorkout.title}</CardTitle>
                            <CardDescription>Started on {selectedWorkout.startDate}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                selectedWorkout.level === "Beginner"
                                  ? "default"
                                  : selectedWorkout.level === "Intermediate"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {selectedWorkout.level}
                            </Badge>
                            <Badge variant="outline">{selectedWorkout.category}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <div className="text-sm text-muted-foreground mb-1">Progress</div>
                            <div className="text-2xl font-bold">{selectedWorkout.progress}%</div>
                            <Progress value={selectedWorkout.progress} className="h-1.5 mt-2" />
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <div className="text-sm text-muted-foreground mb-1">Workouts</div>
                            <div className="text-2xl font-bold">
                              {selectedWorkout.completedWorkouts}/{selectedWorkout.totalWorkouts}
                            </div>
                            <Progress
                              value={(selectedWorkout.completedWorkouts / selectedWorkout.totalWorkouts) * 100}
                              className="h-1.5 mt-2"
                            />
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <div className="text-sm text-muted-foreground mb-1">Weekly Goal</div>
                            <div className="text-2xl font-bold">
                              {calculateWeeklyCompletion(selectedWorkout).toFixed(0)}%
                            </div>
                            <Progress value={calculateWeeklyCompletion(selectedWorkout)} className="h-1.5 mt-2" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Progress Tracking</h3>
                            <div className="flex gap-2">
                              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Timeframe" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="week">Last Week</SelectItem>
                                  <SelectItem value="month">Last Month</SelectItem>
                                  <SelectItem value="all">All Time</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Metric" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="performance">Performance</SelectItem>
                                  <SelectItem value="duration">Duration</SelectItem>
                                  <SelectItem value="completion">Completion</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="h-64">
                            <WorkoutProgressChart history={getFilteredHistory()} metric={selectedMetric} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Workout Metrics</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Total Duration</span>
                                </div>
                                <span className="font-medium">{selectedWorkout.metrics.totalDuration} min</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Avg. Performance</span>
                                </div>
                                <span className="font-medium">{selectedWorkout.metrics.averagePerformance}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Improvement Rate</span>
                                </div>
                                <span className="font-medium">+{selectedWorkout.metrics.improvementRate}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Consistency Rate</span>
                                </div>
                                <span className="font-medium">{selectedWorkout.metrics.consistencyRate}%</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-4">Workout Goals</h3>
                            <div className="space-y-4">
                              {selectedWorkout.goals.map((goal, index) => (
                                <div key={index}>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm">{goal.name}</span>
                                    <span className="text-sm font-medium">{goal.progress}%</span>
                                  </div>
                                  <Progress value={goal.progress} className="h-2" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Activity Calendar</h3>
                          <CalendarHeatmap workoutHistory={selectedWorkout.history} />
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Muscle Group Focus</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.entries(selectedWorkout.muscleGroups).map(([muscle, percentage]) => (
                              <div key={muscle} className="bg-muted rounded-lg p-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm capitalize">{muscle}</span>
                                  <span className="text-xs font-medium">{percentage}%</span>
                                </div>
                                <Progress value={percentage} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" className="gap-1">
                          <BarChart className="h-4 w-4" />
                          Detailed Stats
                        </Button>
                        <Link href={`/workout/${selectedWorkout.id}`}>
                          <Button className="gap-1">
                            Continue Workout
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Completed Workout Plans</h3>
              <p className="text-muted-foreground mb-6">You haven't completed any workout plans yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedWorkouts.map((workout) => (
                <Card key={workout.id} className="flex flex-col h-full">
                  <div className="relative">
                    <img
                      src={workout.image || "/placeholder.svg"}
                      alt={workout.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">Completed</Badge>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{workout.title}</CardTitle>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < workout.rating ? "text-yellow-500" : "text-muted"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <CardDescription>Completed on {workout.completedDate}</CardDescription>
                  </CardHeader>

                  <CardContent className="pb-2 pt-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline">{workout.category}</Badge>
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
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Total Duration</span>
                        </div>
                        <span className="text-sm font-medium">{workout.metrics.totalDuration} min</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Avg. Performance</span>
                        </div>
                        <span className="text-sm font-medium">{workout.metrics.averagePerformance}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Improvement</span>
                        </div>
                        <span className="text-sm font-medium">+{workout.metrics.improvementRate}%</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto pt-4">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button className="flex-1">Restart Plan</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={workoutToDelete !== null} onOpenChange={(open) => !open && setWorkoutToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the workout plan from your active plans. Your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteWorkout}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

