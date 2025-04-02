import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
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
import { BarChart, Calendar, ChevronRight, Clock, Dumbbell, Plus, Trash2 } from "lucide-react"
import WorkoutProgressChart from "../components/workout-progress-chart"
import { fetchActiveWorkouts, fetchCompletedWorkouts, deleteWorkoutPlan, selectWorkout, restartWorkout, setStatus } from "../../../../store/userWorkoutSlice2"
import { useState } from "react"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';


export default function MyWorkoutsPage() {
  const dispatch = useDispatch()
  const { activeWorkouts, completedWorkouts, selectedWorkout, status, error } = useSelector(
    (state) => ({
      activeWorkouts: state.userWorkout2.data.activeWorkouts,
      completedWorkouts: state.userWorkout2.data.completedWorkouts,
      selectedWorkout: state.userWorkout2.data.selectedWorkout,
      status: state.userWorkout2.status,
      error: state.userWorkout2.error
    })
  )
  const [workoutToDelete, setWorkoutToDelete] = useState(null)
  console.log(activeWorkouts)

  useEffect(() => {
    // Fetch data when component mounts
    dispatch(fetchActiveWorkouts())
    dispatch(fetchCompletedWorkouts())
  }, [dispatch])

  const handleSelectWorkout = (id) => {
    dispatch(selectWorkout(id))
  }

  const handleDeleteWorkout = (id) => {
    setWorkoutToDelete(id)
  }

  const confirmDeleteWorkout = () => {
    if (workoutToDelete) {
      dispatch(deleteWorkoutPlan(workoutToDelete))
      setWorkoutToDelete(null)
    }
  }


  useEffect(() => {
     if (status?.status === "success") {
      // navigate("/");
      toast.success(status.message);
      dispatch(setStatus(null));
    }
  }, [status])

  // Loading state
  if (status === "loading" && !activeWorkouts.length) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">My Workouts</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto mb-4"></div>
            <p>Loading your workouts...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (status === "error" && error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">My Workouts</h1>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
          <Button onClick={() => dispatch(fetchActiveWorkouts())} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
     <ToastContainer position="bottom-right" theme="dark" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Workouts</h1>
          <p className="text-muted-foreground">Track and manage your active workout plans</p>
        </div>

        <div className="flex gap-3">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Workout Plan
            </Button>
          </Link>
          <Link to="/user/schedule1">
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
              <Link to="/">
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
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedWorkout && selectedWorkout.id === workout.id ? "border-primary" : ""
                      }`}
                      onClick={() => handleSelectWorkout(workout.id)}
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
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Card className="border-dashed">
                    <Link to="/" className="block p-4">
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

              {selectedWorkout && (
                <div className="lg:col-span-2">
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
                        </div>
                        <div className="bg-muted rounded-lg p-4 text-center">
                          <div className="text-sm text-muted-foreground mb-1">Workouts</div>
                          <div className="text-2xl font-bold">
                            {selectedWorkout.completedWorkouts}/{selectedWorkout.totalWorkouts}
                          </div>
                        </div>
                        <div className="bg-muted rounded-lg p-4 text-center">
                          <div className="text-sm text-muted-foreground mb-1">Streak</div>
                          <div className="text-2xl font-bold">{selectedWorkout.streak} days</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Progress Tracking</h3>
                        <div className="h-64">
                          <WorkoutProgressChart history={selectedWorkout.history} />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
                        <div className="space-y-2">
                          {selectedWorkout.history?.slice(0, 5).map((day, index) => (
                            <div key={index} className="flex items-center py-2 border-b last:border-0">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                  day.completed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {day.completed ? <Dumbbell className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{day.completed ? "Workout Completed" : "Rest Day"}</div>
                                <div className="text-sm text-muted-foreground">{day.date}</div>
                              </div>
                              {day.completed && (
                                <div className="text-right">
                                  <div className="font-medium">{day.duration} min</div>
                                </div>
                              )}
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
                      <Link to={`/MyWorkoutsID/${selectedWorkout.id}`}>
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
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-4 w-4" />
                        <span>{workout.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        <span>{workout.completedWorkouts} workouts completed</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto pt-4">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button className="flex-1" onClick={() => dispatch(restartWorkout(workout.id))}>
                        Restart Plan
                      </Button>
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