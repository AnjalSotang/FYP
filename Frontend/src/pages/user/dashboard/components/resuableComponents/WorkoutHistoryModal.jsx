import { useState } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Clock, Filter, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { fetchAllHistory } from "../../../../../../store/userWorkoutHistorySlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react"

export function WorkoutHistoryModal({ open, onOpenChange }) {
  const dispatch = useDispatch();
  const workoutHistory = useSelector((state) => state.userWorkoutHistory?.data?.allHistory || []);

  console.log(workoutHistory)

  const [activeTab, setActiveTab] = useState("list")
  const [filterType, setFilterType] = useState("all")
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    dispatch(fetchAllHistory());
  }, [dispatch]);

  // Filter workouts based on selected filters
  const filteredWorkouts = workoutHistory.filter((item) => {
    // Filter by type
    if (filterType !== "all" && item.workout.goal !== filterType) {
      return false
    }

    // Filter by date
    if (selectedDate && format(new Date(item.date), "yyyy-MM-dd") !== format(selectedDate, "yyyy-MM-dd")) {
      return false
    }

    return true
  })

  // Reset filters
  const resetFilters = () => {
    setFilterType("all")
    setSelectedDate(null)
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      if (minutes === 0 && remainingSeconds === 0) {
        return `${hours}h`;
      } else if (remainingSeconds === 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      }
    } else if (minutes > 0) {
      if (remainingSeconds === 0) {
        return `${minutes}m`;
      } else {
        return `${minutes}m ${remainingSeconds}s`;
      }
    } else {
      return `${remainingSeconds}s`;
    }
  }

  // Function to check if workout is a rest day or if workoutDay is null
  const isRestDay = (workout) => {
    return !workout.workoutDay || (workout.workoutDay.dayName && workout.workoutDay.dayName.includes("Rest"));
  }

  // Function to get workout name safely
  const getWorkoutName = (workout) => {
    if (!workout.workoutDay) {
      return "Unknown Workout";
    }
    return isRestDay(workout) ? "Rest Day" : workout.workoutDay.dayName;
  }

  // Get unique workout types for filter
  const workoutTypes = ["all", ...new Set(workoutHistory.map((w) => w.workout.goal))]

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
          </div>

          <TabsContent value="list" className="space-y-4">
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center py-3 border-b last:border-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${!isRestDay(workout) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {!isRestDay(workout) ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="font-medium">{getWorkoutName(workout)}</div>
                      <Badge variant="outline" className="ml-2">
                        {format(new Date(workout.date), "EEE")}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{format(new Date(workout.date), "MMMM d, yyyy")}</div>
                  </div>
                  {!isRestDay(workout) && (
                    <div className="text-right">
                      <div className="font-medium">{formatDuration(workout.duration)}</div>
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
                    return workoutHistory.some((w) => format(new Date(w.date), "yyyy-MM-dd") === dateStr && w.completed)
                  },
                  rest: (date) => {
                    const dateStr = format(date, "yyyy-MM-dd")
                    return workoutHistory.some((w) => format(new Date(w.date), "yyyy-MM-dd") === dateStr && !w.completed)
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

                  <div className="space-y-4">
                    {/* Filter workouts for selected date */}
                    {workoutHistory
                      .filter((w) => format(new Date(w.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
                      .map((workout) => (
                        <div key={workout.id} className="space-y-2 border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {getWorkoutName(workout)}
                            </span>
                            {!isRestDay(workout) && (
                              <div className="flex items-center gap-2">
                                <span className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-1" /> {formatDuration(workout.duration)}
                                </span>
                                <span className="flex items-center text-sm">
                                  <Flame className="h-4 w-4 mr-1" /> {workout.calories} cal
                                </span>
                              </div>
                            )}
                          </div>

                          {!isRestDay(workout) && workout.workoutDay.exercises && workout.workoutDay.exercises.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {workout.workoutDay.exercises.map((ex, i) => (
                                <div key={i}>
                                  {ex.name}: {ex.sets} sets × {ex.reps} reps
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}