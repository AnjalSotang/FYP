import { useState } from "react"
import { format, subDays } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Clock, Filter, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

// Generate more comprehensive mock data for workout history
const generateMockWorkoutHistory = () => {
  const workouts = []
  const today = new Date()
  const workoutTypes = ["Strength Training", "Cardio", "HIIT", "Yoga", "Rest Day"]

  for (let i = 60; i >= 0; i--) {
    const date = subDays(today, i)
    const isRestDay = i % 7 === 0 || Math.random() < 0.2

    workouts.push({
      id: i,
      date: date,
      completed: !isRestDay,
      type: isRestDay ? "Rest Day" : workoutTypes[Math.floor(Math.random() * (workoutTypes.length - 1))],
      duration: isRestDay ? 0 : Math.floor(Math.random() * 60) + 20,
      calories: isRestDay ? 0 : Math.floor(Math.random() * 400) + 150,
      exercises: isRestDay
        ? []
        : [
            { name: "Exercise 1", sets: 3, reps: 12 },
            { name: "Exercise 2", sets: 4, reps: 10 },
            { name: "Exercise 3", sets: 3, reps: 15 },
          ],
    })
  }

  return workouts
}



export function WorkoutHistoryModal({ open, onOpenChange }) {
  const [workoutHistory] = useState(generateMockWorkoutHistory())
  const [activeTab, setActiveTab] = useState("list")
  const [filterType, setFilterType] = useState("all")
  const [selectedDate, setSelectedDate] = useState(null)
  const [chartMetric, setChartMetric] = useState("workouts")

//   const chartData = generateChartData(workoutHistory)

  // Filter workouts based on selected filters
  const filteredWorkouts = workoutHistory.filter((workout) => {
    // Filter by type
    if (filterType !== "all" && workout.type !== filterType) {
      return false
    }

    // Filter by date
    if (selectedDate && format(workout.date, "yyyy-MM-dd") !== format(selectedDate, "yyyy-MM-dd")) {
      return false
    }

    return true
  })

  // Reset filters
  const resetFilters = () => {
    setFilterType("all")
    setSelectedDate(null)
  }

  // Get unique workout types for filter
  const workoutTypes = ["all", ...new Set(workoutHistory.map((w) => w.type))]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Workout History</DialogTitle>
          <DialogDescription>View and analyze your past workouts</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              {/* <TabsTrigger value="stats">Statistics</TabsTrigger> */}
            </TabsList>

            {activeTab === "list" && (
              <div className="flex items-center gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Workout Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" onClick={resetFilters} title="Reset filters">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            )}

            {activeTab === "stats" && (
              <Select value={chartMetric} onValueChange={setChartMetric}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workouts">Workouts</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="calories">Calories</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <TabsContent value="list" className="space-y-4">
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center py-3 border-b last:border-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      workout.completed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {workout.completed ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="font-medium">{workout.completed ? workout.type : "Rest Day"}</div>
                      <Badge variant="outline" className="ml-2">
                        {format(workout.date, "EEE")}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{format(workout.date, "MMMM d, yyyy")}</div>
                  </div>
                  {workout.completed && (
                    <div className="text-right">
                      <div className="font-medium">{workout.duration} min</div>
                      <div className="text-sm text-muted-foreground">{workout.calories} calories</div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No workouts match your filters</p>
                <Button variant="outline" className="mt-2" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <div className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border mb-4"
                modifiers={{
                  workout: (date) => {
                    const dateStr = format(date, "yyyy-MM-dd")
                    return workoutHistory.some((w) => format(w.date, "yyyy-MM-dd") === dateStr && w.completed)
                  },
                  rest: (date) => {
                    const dateStr = format(date, "yyyy-MM-dd")
                    return workoutHistory.some((w) => format(w.date, "yyyy-MM-dd") === dateStr && !w.completed)
                  },
                }}
                modifiersStyles={{
                  workout: { backgroundColor: "rgba(147, 51, 234, 0.1)", fontWeight: "bold" },
                  rest: { backgroundColor: "rgba(100, 116, 139, 0.1)" },
                }}
              />

              {selectedDate && (
                <Card className="w-full p-4">
                  <h3 className="font-medium mb-2">{format(selectedDate, "MMMM d, yyyy")}</h3>

                  {workoutHistory
                    .filter((w) => format(w.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
                    .map((workout) => (
                      <div key={workout.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{workout.completed ? workout.type : "Rest Day"}</span>
                          {workout.completed && (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-1" /> {workout.duration} min
                              </span>
                              <span className="flex items-center text-sm">
                                <Flame className="h-4 w-4 mr-1" /> {workout.calories} cal
                              </span>
                            </div>
                          )}
                        </div>

                        {workout.completed && workout.exercises.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {workout.exercises.map((ex, i) => (
                              <div key={i}>
                                {ex.name}: {ex.sets} sets × {ex.reps} reps
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </Card>
              )}
            </div>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

