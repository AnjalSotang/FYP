import { useEffect, useState } from "react"
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
import {
  // Status and common actions
  setStatus,
  // Workout plan actions
  fetchWorkouts,
  selectFormData,
  selectWorkoutPlans,
  selectWorkoutPlanById,


  
} from "../../../../store/workoutScheduleSlice"
import { useDispatch, useSelector } from "react-redux";


// Mock data for scheduled workouts
const initialScheduledWorkouts = [
  {
    id: 1,
    workoutPlan: "30-Day Strength Challenge",
    day: "Day 5: Upper Body",
    date: new Date(2025, 2, 16), // March 16, 2025
    time: "18:00",
    reminder: true,
  },
  {
    id: 2,
    workoutPlan: "Core Crusher",
    day: "Day 3: Obliques Focus",
    date: new Date(2025, 2, 18), // March 18, 2025
    time: "07:30",
    reminder: true,
  },
  {
    id: 3,
    workoutPlan: "HIIT Fat Burner",
    day: "Day 1: Full Body",
    date: new Date(2025, 2, 20), // March 20, 2025
    time: "19:00",
    reminder: false,
  },
]

// // Mock data for available workout plans
// const availableWorkoutPlans = [
//   {
//     id: 1,
//     title: "30-Day Strength Challenge",
//     days: [
//       "Day 1: Upper Body",
//       "Day 2: Lower Body",
//       "Day 3: Rest & Recovery",
//       "Day 4: Push (Chest, Shoulders, Triceps)",
//       "Day 5: Pull (Back, Biceps)",
//       "Day 6: Legs & Core",
//       "Day 7: Rest & Recovery",
//     ],
//   },
//   {
//     id: 2,
//     title: "Core Crusher",
//     days: ["Day 1: Core Basics", "Day 2: Obliques Focus", "Day 3: Lower Abs", "Day 4: Full Core Circuit"],
//   },
//   {
//     id: 3,
//     title: "HIIT Fat Burner",
//     days: [
//       "Day 1: Full Body",
//       "Day 2: Upper Body Focus",
//       "Day 3: Lower Body Focus",
//       "Day 4: Core & Cardio",
//       "Day 5: Total Body Burnout",
//     ],
//   },
// ]

export default function SchedulePage() {
  const dispatch = useDispatch()
  

  // Use Redux selectors to access state
  const workoutPlans = useSelector(selectWorkoutPlans)
  // const scheduledWorkouts = useSelector(selectScheduledWorkouts)
  // const workoutsForSelectedDate = useSelector(selectWorkoutsForSelectedDate)
  // const upcomingWorkouts = useSelector(selectUpcomingWorkouts)
  // const selectedDate = useSelector(selectSelectedDate)
  const formData = useSelector(selectFormData)
  // const isDialogOpen = useSelector(selectIsDialogOpen)
  // const status = useSelector(selectStatus)
  // const datesWithWorkouts = useSelector(selectDatesWithWorkouts)


  const [date, setDate] = useState(new Date());
  const [scheduledWorkouts, setScheduledWorkouts] = useState(initialScheduledWorkouts)

  // New workout form state
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState("")
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedTime, setSelectedTime] = useState("08:00")
  const [enableReminder, setEnableReminder] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Get the selected workout plan object
  // const workoutPlan = availableWorkoutPlans.find((plan) => plan.title === selectedWorkoutPlan)

   // Get the selected workout plan object using the selector
    const workoutPlan = useSelector((state) => 
      selectWorkoutPlanById(state, formData.selectedWorkoutPlanId)
    )

    // Initial data loading
    useEffect(() => {
      // Fetch all required data on initial load
      dispatch(fetchWorkouts())
      // dispatch(fetchScheduledWorkouts())
      // dispatch(fetchUpcomingWorkouts())
      // dispatch(fetchWorkoutsForDate(selectedDate))
    }, [dispatch])

    


  // Filter workouts for the selected date
  const workoutsForSelectedDate = scheduledWorkouts.filter(
    (workout) => date && workout.date.toDateString() === date.toDateString(),
  )

  // Get all dates that have workouts scheduled
  const datesWithWorkouts = scheduledWorkouts.map((workout) => workout.date.toDateString())

  // Handle scheduling a new workout
  const handleScheduleWorkout = () => {
    if (!date || !selectedWorkoutPlan || !selectedDay || !selectedTime) return

    const newWorkout = {
      id: scheduledWorkouts.length + 1,
      workoutPlan: selectedWorkoutPlan,
      day: selectedDay,
      date: date,
      time: selectedTime,
      reminder: enableReminder,
    }

    setScheduledWorkouts([...scheduledWorkouts, newWorkout])
    setIsDialogOpen(false)

    // Reset form
    setSelectedWorkoutPlan("")
    setSelectedDay("")
    setSelectedTime("08:00")
    setEnableReminder(true)
  }

  // Handle deleting a scheduled workout
  const handleDeleteWorkout = (id) => {
    setScheduledWorkouts(scheduledWorkouts.filter((workout) => workout.id !== id))
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Workout Schedule</h1>
          <p className="text-muted-foreground">Plan and organize your workout sessions</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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


                <Select value={formData.selectedWorkoutPlanId} onValueChange={setSelectedWorkoutPlan}>

                {/* <Select value={selectedWorkoutPlan} onValueChange={setSelectedWorkoutPlan}> */}
                  <SelectTrigger id="workout-plan">
                    <SelectValue placeholder="Select workout plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        {plan.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="workout-day">Workout Day</Label>
                <Select 
                  value={formData.selectedDayId} 
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
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder"
                  checked={enableReminder}
                  onCheckedChange={(checked) => setEnableReminder(checked)}
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleWorkout}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view scheduled workouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                workout: (date) => datesWithWorkouts.includes(date.toDateString()),
              }}
              modifiersStyles={{
                workout: {
                  fontWeight: "bold",
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                  borderRadius: "0.25rem",
                },
              }}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const prevMonth = new Date(!date)
                prevMonth.setMonth(prevMonth.getMonth() - 1)
                setDate(prevMonth)
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const nextMonth = new Date(!date)
                nextMonth.setMonth(nextMonth.getMonth() + 1)
                setDate(nextMonth)
              }}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{date ? format(date, "MMMM d, yyyy") : "Select a date"}</CardTitle>
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
                <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  Schedule a Workout
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {workoutsForSelectedDate.map((workout) => (
                  <Card key={workout.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{workout.workoutPlan}</h3>
                            <p className="text-sm text-muted-foreground">{workout.day}</p>
                            <div className="flex items-center mt-2 text-sm">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{workout.time}</span>
                              {workout.reminder && (
                                <span className="ml-3 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  Reminder On
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteWorkout(workout.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
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
          {scheduledWorkouts
            .filter((workout) => workout.date >= new Date())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 3)
            .map((workout) => (
              <Card key={workout.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{workout.workoutPlan}</CardTitle>
                    <div className="text-sm font-medium text-primary">{format(workout.date, "MMM d")}</div>
                  </div>
                  <CardDescription>{workout.day}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{workout.time}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Link href={`/workout/${workout.workoutPlan.toLowerCase().replace(/\s+/g, "-")}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Workout
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

