import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"

export function CalendarHeatmap({ workoutHistory }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  // Get day of week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = startOfMonth(currentMonth).getDay()

  // Create array for empty cells before the first day of the month
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  // Function to check if a day has a workout
  const getWorkoutForDay = (day) => {
    return workoutHistory.find((workout) => {
      const workoutDate = new Date(workout.date)
      return isSameDay(workoutDate, day)
    })
  }

  // Function to get cell color based on workout performance
  const getCellColor = (workout) => {
    if (!workout || !workout.completed) return "bg-muted"

    if (workout.performance >= 90) return "bg-green-500"
    if (workout.performance >= 80) return "bg-green-400"
    if (workout.performance >= 70) return "bg-green-300"
    if (workout.performance >= 60) return "bg-yellow-400"
    return "bg-yellow-300"
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-1 rounded hover:bg-muted"
          >
            ←
          </button>
          <button onClick={() => setCurrentMonth(new Date())} className="px-2 py-1 text-xs rounded hover:bg-muted">
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-1 rounded hover:bg-muted"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyCells.map((i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {daysInMonth.map((day) => {
          const workout = getWorkoutForDay(day)
          return (
            <div
              key={day.toString()}
              className={`aspect-square rounded-md flex items-center justify-center text-xs relative ${getCellColor(workout)}`}
            >
              <span className={workout?.completed ? "text-white" : ""}>{format(day, "d")}</span>
              {workout?.completed && <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-white"></div>}
            </div>
          )
        })}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted"></div>
          <span className="text-xs text-muted-foreground">No workout</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-yellow-300"></div>
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-300"></div>
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-500"></div>
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  )
}

