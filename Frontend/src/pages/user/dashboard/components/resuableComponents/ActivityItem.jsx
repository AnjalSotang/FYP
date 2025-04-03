// components/dashboard/ActivityItem.jsx
import { CheckCircle2, Clock } from "lucide-react"

export function ActivityItem({ day, index }) {
  return (
    <div key={index} className="flex items-center py-2 border-b last:border-0">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
          day.completed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        {day.completed ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <div className="font-medium">{day.completed ? "Workout Completed" : "Rest Day"}</div>
        <div className="text-sm text-muted-foreground">{day.date}</div>
      </div>
      {day.completed && (
        <div className="text-right">
          <div className="font-medium">{day.duration} min</div>
          <div className="text-sm text-muted-foreground">{day.calories} calories</div>
        </div>
      )}
    </div>
  )
}
