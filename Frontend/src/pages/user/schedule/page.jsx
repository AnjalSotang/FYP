import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Dumbbell, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux"

import {
  // Status and common actions
  setStatus,

  // Workout plan actions
  fetchWorkouts,
  fetchWorkout,

  // Scheduling actions
  fetchScheduledWorkouts,
  fetchWorkoutsForDate,
  fetchUpcomingWorkouts,
  setSelectedDate,
  scheduleWorkout,
  deleteScheduledWorkout,

  // Form actions
  setFormWorkoutPlan,
  setFormWorkoutDay,
  setFormTime,
  setFormReminder,
  setDialogOpen,
  resetForm,

  // Selectors
  selectWorkoutPlans,
  selectScheduledWorkouts,
  selectWorkoutsForSelectedDate,
  selectUpcomingWorkouts,
  selectSelectedDate,
  selectFormData,
  selectIsDialogOpen,
  selectStatus,
  selectDatesWithWorkouts,
  selectWorkoutPlanById,
} from "../../../../store/workoutScheduleSlice" // Adjust path as needed
import STATUSES from "@/globals/status/statuses";
import RootLayout from '../../../components/layout/UserLayout';


export default function SchedulePage() {
  const dispatch = useDispatch()

  // Use Redux selectors to access state
  const workoutPlans = useSelector(selectWorkoutPlans)
  const scheduledWorkouts = useSelector(selectScheduledWorkouts)
  const workoutsForSelectedDate = useSelector(selectWorkoutsForSelectedDate)
  const upcomingWorkouts = useSelector(selectUpcomingWorkouts)
  const selectedDate = useSelector(selectSelectedDate)
  const formData = useSelector(selectFormData)
  const isDialogOpen = useSelector(selectIsDialogOpen)
  const status = useSelector(selectStatus)
  const datesWithWorkouts = useSelector(selectDatesWithWorkouts)

  // Convert loading/error states from Redux status
  const isLoading = status === "LOADING"
  const error = status?.status === "ERROR" ? status.message : null

  // Get the selected workout plan object using the selector
  const workoutPlan = useSelector((state) =>
    selectWorkoutPlanById(state, formData.selectedWorkoutPlanId)
  )

  // Initial data loading
  useEffect(() => {
    // Fetch all required data on initial load
    dispatch(fetchWorkouts())
    dispatch(fetchScheduledWorkouts())
    dispatch(fetchUpcomingWorkouts())
    dispatch(fetchWorkoutsForDate(selectedDate))
  }, [dispatch])

  // // Initial data loading
  // useEffect(() => {
  //   // Fetch all required data on initial load
  //   dispatch(fetchWorkouts())
  //   dispatch(fetchScheduledWorkouts())
  //   dispatch(fetchUpcomingWorkouts())
  //   dispatch(fetchWorkoutsForDate(selectedDate))
  // }, [dispatch, selectedDate])



  // Handle date selection - wrapped in useCallback
  const handleDateChange = useCallback((date) => {
    if (date) {
      dispatch(setSelectedDate(date.toISOString()));
      dispatch(fetchWorkoutsForDate(date));
    }
  }, [dispatch]);

  // Navigate to previous month
  const handlePrevMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    dispatch(setSelectedDate(prevMonth.toISOString()));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    dispatch(setSelectedDate(nextMonth.toISOString()));
  };



  // Handle workout plan selection - wrapped in useCallback
  const handleWorkoutPlanChange = useCallback((value) => {
    dispatch(setFormWorkoutPlan(value));
  }, [dispatch]);

  // Handle day selection - wrapped in useCallback
  const handleDaySelection = useCallback((value) => {
    dispatch(setFormWorkoutDay(value));
  }, [dispatch]);

  // Handle time selection - wrapped in useCallback
  const handleTimeChange = useCallback((e) => {
    dispatch(setFormTime(e.target.value));
  }, [dispatch]);

  // Handle reminder toggle - wrapped in useCallback
  const handleReminderChange = useCallback((checked) => {
    dispatch(setFormReminder(checked));
  }, [dispatch]);

  // Handle dialog open/close - wrapped in useCallback
  const handleDialogChange = useCallback((open) => {
    dispatch(setDialogOpen(open));
    if (!open) {
      dispatch(resetForm());
    }
  }, [dispatch]);



  // Handle scheduling a new workout
  const handleScheduleWorkout = () => {
    if (!selectedDate || !formData.selectedWorkoutPlanId || !formData.selectedDayId || !formData.selectedTime) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const workoutData = {
      workoutPlanId: parseInt(formData.selectedWorkoutPlanId),
      workoutDayId: parseInt(formData.selectedDayId),
      scheduledDate: format(selectedDate, "yyyy-MM-dd"),
      scheduledTime: formData.selectedTime,
      reminderEnabled: formData.enableReminder
    }

    console.log("Workout Data:", workoutData);

    dispatch(scheduleWorkout(workoutData));
    dispatch(setDialogOpen(false));
  }




  // Handle deleting a scheduled workout
  const handleDeleteWorkout = (id) => {
    dispatch(deleteScheduledWorkout(id));
  }



  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center min-h-[60vh]">
        <p>Loading workout schedule...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || "Error loading workout data. Please try again later."}</p>
        </div>
      </div>
    )
  }

 // 🔥 Handle Status Updates
 useEffect(() => {
 if (status?.status === STATUSES.ERROR) {
    toast.error(status.message);
  }
}, [status]);


  return (
    <RootLayout>
    <div className="container mx-auto py-9 px-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Workout Schedule</h1>
          <p className="text-muted-foreground">Plan and organize your workout sessions</p>
        </div>

        {/* / Workout Schedule */}
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Workout
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule a Workout</DialogTitle>
              <DialogDescription>
                Plan your next workout session. Set the date, time, and enable reminders.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="workout-plan">Workout Plan</Label>
                <Select value={formData.selectedWorkoutPlanId} onValueChange={handleWorkoutPlanChange}>
                  <SelectTrigger id="workout-plan">
                    <SelectValue placeholder="Select workout plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="workout-day">Workout Day</Label>
                <Select
                  value={formData.selectedDayId}
                  onValueChange={handleDaySelection}
                  disabled={!formData.selectedWorkoutPlanId}
                >
                  <SelectTrigger id="workout-day">
                    <SelectValue placeholder="Select workout day" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutPlan?.days?.map((day) => (
                      <SelectItem key={day.id} value={day.id.toString()}>
                        {day.dayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.selectedTime}
                  onChange={handleTimeChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder"
                  checked={formData.enableReminder}
                  onCheckedChange={handleReminderChange}
                />
                <label
                  htmlFor="reminder"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Enable reminder notification
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => dispatch(setDialogOpen(false))}>
                Cancel
              </Button>
              <Button onClick={handleScheduleWorkout}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>




      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Workout Calendar */}

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view scheduled workouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
  
  
              className="rounded-md border border-[#1E3A6D] p-3"
              modifiers={{
                workout: (date) => datesWithWorkouts.includes(new Date(date).toDateString()),
              }}
              modifiersStyles={{
                workout: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(163, 209, 30, 0.1)",  // Semi-transparent background
                  color: "#9FE830",  // Text color
                  borderRadius: "0.25rem",
                },
              }}
            />

          </CardContent>


          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>


            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>





        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}</CardTitle>


            <CardDescription>
              {workoutsForSelectedDate.length === 0
                ? "No workouts scheduled for this date"
                : `${workoutsForSelectedDate.length} workout${workoutsForSelectedDate.length > 1 ? "s" : ""} scheduled`}
            </CardDescription>


          </CardHeader>



          <CardContent>
            {workoutsForSelectedDate.length === 0 ? (
              <div className="text-center py-8">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No workouts scheduled for this date</p>
                <Button variant="outline" className="mt-4" onClick={() => dispatch(setDialogOpen(true))}>
                  Schedule a Workout
                </Button>
              </div>
            ) : (


              <div className="space-y-4">
                {workoutsForSelectedDate.map((workout) => (
                  <Card key={workout.id}>
                   <CardContent className="p-4 border border-[#1E3A6D] rounded-">
                    <div className="flex items-start justify-between"> 
                        <div className="flex items-start gap-3">
                          <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{workout.workoutPlan}</h3>
                            <p className="text-sm text-muted-md">{workout.day}</p>


                            <div className="flex items-center mt-2 text-sm">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>
                                {new Date(`2000-01-01T${workout.time}`).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                              {workout.reminder && (
                                <span className="ml-3 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  Reminder On
                                </span>
                              )}


                              {workout.status && workout.status !== 'scheduled' && (
                                <span className={`ml-3 text-xs ${workout.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                  } px-2 py-0.5 rounded-full`}>
                                  {workout.status.charAt(0).toUpperCase() + workout.status.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                       
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="group"
                        >
                            <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-blue-800 transition-colors duration-200" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>



            )}
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">Tip: Click on a workout to see details or edit it.</div>
          </CardFooter>
        </Card>
      </div>



      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Upcoming Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingWorkouts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No upcoming workouts scheduled</p>
              <Button variant="outline" className="mt-4" onClick={() => dispatch(setDialogOpen(true))}>
                Schedule a Workout
              </Button>
            </div>
          ) : (
            upcomingWorkouts.map((workout) => (
              <Card key={workout.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{workout.workoutPlan}</CardTitle>
                    <div className="text-sm font-medium text-primary">
                      {format(new Date(workout.date), "MMM d")}
                    </div>
                  </div>
                  <CardDescription>{workout.day}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {new Date(`2000-01-01T${workout.time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Link
                    to={`/workout/${workout.id}`}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      View Workout
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
    </RootLayout>
  )
}