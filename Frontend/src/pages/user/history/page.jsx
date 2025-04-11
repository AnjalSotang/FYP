import { useState, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import {
  Calendar,
  Clock,
  Flame,
  Star,
  Filter,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  BarChart3,
  ListFilter,
  ArrowLeft,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchWorkoutHistory } from "../../../../store/userWorkoutHistorySlice"

// Helper component for workout history items
const WorkoutHistoryItem = () => {
  const workout = useSelector((state) => state.userWorkoutHistory?.data?.historyEntries || []);
  console.log(workout)
  console.log(workout.date)
  const formattedDate = format(parseISO(workout.date), "MMM d, yyyy")
  const formattedTime = format(parseISO(workout.date), "h:mm a")

  // Generate stars based on rating
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < workout.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
    ))

  // Determine badge color based on level
  const getLevelColor = (level) => {
    if (!level) return "bg-gray-100 text-gray-800"

    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-blue-100 text-blue-800"
      case "advanced":
        return "bg-purple-100 text-purple-800"
      case "all":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0">
        <img
          src={workout.workout?.imagePath || "/placeholder.svg?height=80&width=80"}
          alt={workout.workout?.name || "Workout"}
          className="w-20 h-20 rounded-md object-cover"
        />
      </div>

      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-medium text-lg">{workout.workout?.name || "Workout"}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            {formattedDate} at {formattedTime}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {workout.workout?.level && (
            <Badge variant="outline" className={getLevelColor(workout.workout.level)}>
              {workout.workout.level}
            </Badge>
          )}

          <div className="flex items-center text-sm">
            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{workout.duration} min</span>
          </div>

          <div className="flex items-center text-sm">
            <Flame className="h-3.5 w-3.5 mr-1 text-orange-500" />
            <span>{workout.calories} cal</span>
          </div>

          {workout.rating > 0 && <div className="flex items-center gap-0.5">{stars}</div>}
        </div>

        {workout.notes && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{workout.notes}</p>}
      </div>
    </div>
  )
}

// Helper component for calendar view
const WorkoutHistoryCalendar = ({ workouts, currentDate, setCurrentDate }) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getWorkoutsForDay = (day) => {
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.date)
      return isSameDay(workoutDate, day)
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{format(currentDate, "MMMM yyyy")}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayWorkouts = getWorkoutsForDay(day)
          const hasWorkouts = dayWorkouts.length > 0

          return (
            <div
              key={day.toString()}
              className={`min-h-24 p-2 border rounded-md ${hasWorkouts ? "border-primary/30 bg-primary/5" : "border-border"}`}
            >
              <div className="text-sm font-medium mb-1">{format(day, "d")}</div>

              {hasWorkouts ? (
                <div className="space-y-1">
                  {dayWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="text-xs p-1 rounded bg-primary/10 truncate"
                      title={workout.workout?.name || "Workout"}
                    >
                      {workout.workout?.name || "Workout"}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-0 hover:opacity-30 transition-opacity">
                  <CalendarIcon className="h-4 w-4" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function WorkoutHistoryPage() {
  const dispatch = useDispatch()
  const historyEntries = useSelector((state) => state.userWorkoutHistory?.data?.historyEntries || [])
  const isLoading = useSelector((state) => state.userWorkoutHistory?.loading || false)

  const [searchQuery, setSearchQuery] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("list")

  useEffect(() => {
    dispatch(fetchWorkoutHistory())
  }, [dispatch])

  const filteredHistory = useMemo(() => {
    let result = [...historyEntries]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (workout) =>
          workout.workout?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workout.notes?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply level filter
    if (filterLevel !== "all") {
      result = result.filter((workout) => workout.workout?.level?.toLowerCase() === filterLevel.toLowerCase())
    }

    // Apply sorting
    if (sortOrder === "newest") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else if (sortOrder === "duration") {
      result.sort((a, b) => b.duration - a.duration)
    } else if (sortOrder === "calories") {
      result.sort((a, b) => b.calories - a.calories)
    } else if (sortOrder === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [historyEntries, searchQuery, filterLevel, sortOrder])

  // Calculate stats
  const stats = useMemo(() => {
    const totalWorkouts = historyEntries.length
    const totalMinutes = historyEntries.reduce((sum, workout) => sum + (workout.duration || 0), 0)
    const totalCalories = historyEntries.reduce((sum, workout) => sum + (workout.calories || 0), 0)

    // Calculate average rating, handling potential division by zero
    let averageRating = "0.0"
    const validRatings = historyEntries.filter((workout) => workout.rating > 0)
    if (validRatings.length > 0) {
      averageRating = (validRatings.reduce((sum, workout) => sum + workout.rating, 0) / validRatings.length).toFixed(1)
    }

    return {
      totalWorkouts,
      totalMinutes,
      totalCalories,
      averageRating,
    }
  }, [historyEntries])

  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex items-center mb-6">
        <Link to="/dashboard" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workout History</h1>
          <p className="text-muted-foreground">Track your fitness journey and progress</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Workouts</p>
                <div className="flex items-baseline mt-1">
                  <h4 className="text-2xl font-bold">{stats.totalWorkouts}</h4>
                </div>
              </div>
              <div className="p-2 bg-muted rounded-full">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Minutes</p>
                <div className="flex items-baseline mt-1">
                  <h4 className="text-2xl font-bold">{stats.totalMinutes}</h4>
                  <span className="text-sm text-muted-foreground ml-1">min</span>
                </div>
              </div>
              <div className="p-2 bg-muted rounded-full">
                <Clock className="h-4 w-4 text-indigo-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Calories Burned</p>
                <div className="flex items-baseline mt-1">
                  <h4 className="text-2xl font-bold">{stats.totalCalories}</h4>
                </div>
              </div>
              <div className="p-2 bg-muted rounded-full">
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-baseline mt-1">
                  <h4 className="text-2xl font-bold">{stats.averageRating}</h4>
                </div>
              </div>
              <div className="p-2 bg-muted rounded-full">
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="list">
              <ListFilter className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Stats
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workouts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="calories">Calories</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="list" className="m-0">
          <Card>
            <CardContent className="p-0 sm:p-6">
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredHistory.length > 0 ? (
                <div className="divide-y">
                  {filteredHistory.map((workout) => (
                    <WorkoutHistoryItem key={workout.id} workout={workout} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No workouts found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery || filterLevel !== "all"
                      ? "Try adjusting your filters to see more results"
                      : "You haven't completed any workouts yet"}
                  </p>
                </div>
              )}
            </CardContent>
            {filteredHistory.length > 10 && (
              <CardFooter className="flex justify-center p-4 border-t">
                <Button variant="outline">Load More</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="m-0">
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <WorkoutHistoryCalendar
                  workouts={filteredHistory}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Workout Statistics</CardTitle>
              <CardDescription>Detailed breakdown of your workout performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Monthly Progress */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Monthly Progress</h3>
                  <div className="h-[200px] flex items-end gap-2">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const height = Math.floor(Math.random() * 100) + 20
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-primary/80 rounded-t" style={{ height: `${height}px` }}></div>
                          <span className="text-xs text-muted-foreground">{format(new Date(2025, i, 1), "MMM")}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Workout Types */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Workout Types</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Strength", "Cardio", "Yoga", "HIIT"].map((type) => (
                      <Card key={type}>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">{type}</div>
                          <div className="text-xl font-bold mt-1">{Math.floor(Math.random() * 20) + 5}</div>
                          <div className="w-full h-1 bg-muted mt-2">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

