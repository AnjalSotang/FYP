import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Dumbbell, Plus, X } from "lucide-react"
import RootLayout from "@/components/layout/UserLayout"

export default function SchedulePage() {
  const [date, setDate] = useState()
  const [selectedWorkout, setSelectedWorkout] = useState()
  const [selectedTime, setSelectedTime] = useState()
  const [scheduledWorkouts, setScheduledWorkouts] = useState([
    {
      id: 1,
      name: "Upper Body Strength",
      date: new Date(),
      time: "5:00 PM",
      duration: "45 min",
    },
    {
      id: 2,
      name: "HIIT Cardio",
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "6:30 AM",
      duration: "30 min",
    },
    {
      id: 3,
      name: "Leg Day",
      date: new Date(Date.now() + 86400000 * 2), // Day after tomorrow
      time: "5:30 PM",
      duration: "60 min",
    },
  ])

  // Mock workout data for selection
  const availableWorkouts = [
    { id: 1, name: "Full Body Strength" },
    { id: 2, name: "HIIT Cardio Blast" },
    { id: 3, name: "Yoga Flow" },
    { id: 4, name: "Core Crusher" },
    { id: 5, name: "Lower Body Focus" },
    { id: 6, name: "Upper Body Builder" },
  ]

  // Time slots for selection
  const timeSlots = [
    "5:00 AM",
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
  ]

  const handleAddWorkout = () => {
    if (date && selectedWorkout && selectedTime) {
      const workout = availableWorkouts.find((w) => w.name === selectedWorkout)
      if (workout) {
        setScheduledWorkouts([
          ...scheduledWorkouts,
          {
            id: Date.now(),
            name: selectedWorkout,
            date: date,
            time: selectedTime,
            duration: "45 min", // Default duration
          },
        ])
        setSelectedWorkout(undefined)
        setSelectedTime(undefined)
      }
    }
  }

  const handleRemoveWorkout = (id) => {
    setScheduledWorkouts(scheduledWorkouts.filter((workout) => workout.id !== id))
  }

  // Filter workouts for the selected date
  const getWorkoutsForDate = (selectedDate) => {
    return scheduledWorkouts.filter((workout) => workout.date.toDateString() === selectedDate.toDateString())
  }

  const selectedDateWorkouts = date ? getWorkoutsForDate(date) : []

  return (
    <RootLayout>
     
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Workout Schedule</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Workout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule a New Workout</DialogTitle>
              <DialogDescription>Select a workout, date, and time to add to your schedule.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="workout" className="text-sm font-medium">
                  Workout
                </label>
                <Select value={selectedWorkout} onValueChange={setSelectedWorkout}>
                  <SelectTrigger id="workout">
                    <SelectValue placeholder="Select a workout" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWorkouts.map((workout) => (
                      <SelectItem key={workout.id} value={workout.name}>
                        {workout.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Time
                </label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddWorkout} disabled={!selectedWorkout || !selectedTime}>
                Add to Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view or schedule workouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {date
                ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                : "Select a date"}
            </CardTitle>
            <CardDescription>
              {selectedDateWorkouts.length === 0
                ? "No workouts scheduled for this day"
                : `${selectedDateWorkouts.length} workout${selectedDateWorkouts.length > 1 ? "s" : ""} scheduled`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateWorkouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Dumbbell className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No workouts scheduled for this day</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Workout
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule a New Workout</DialogTitle>
                        <DialogDescription>Select a workout and time to add to your schedule.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label htmlFor="workout" className="text-sm font-medium">
                            Workout
                          </label>
                          <Select value={selectedWorkout} onValueChange={setSelectedWorkout}>
                            <SelectTrigger id="workout">
                              <SelectValue placeholder="Select a workout" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableWorkouts.map((workout) => (
                                <SelectItem key={workout.id} value={workout.name}>
                                  {workout.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="time" className="text-sm font-medium">
                            Time
                          </label>
                          <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger id="time">
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddWorkout} disabled={!selectedWorkout || !selectedTime}>
                          Add to Schedule
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                selectedDateWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{workout.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          {workout.time} • {workout.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveWorkout(workout.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Workouts</CardTitle>
          <CardDescription>Your scheduled workouts for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="space-y-4 pt-4">
              {scheduledWorkouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <p className="text-muted-foreground">No upcoming workouts scheduled</p>
                </div>
              ) : (
                scheduledWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{workout.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="mr-2">
                            {workout.date.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <Clock className="mr-1 h-4 w-4" />
                          {workout.time} • {workout.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveWorkout(workout.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
            <TabsContent value="calendar" className="pt-4">
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">Calendar view will be implemented here</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
     
    </RootLayout>
  )
}

