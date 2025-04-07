// components/dashboard/ActivityItem.jsx
import { CheckCircle2, Clock } from "lucide-react"

export function ActivityItem({ day, index }) {
  // Format date to "Mar 14" format
  const dateObj = new Date(day.date);
  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const dayNumber = dateObj.getDate(); // Renamed to avoid conflict
  const formattedDate = `${month} ${dayNumber}`;
  console.log(formattedDate);

  return (
    <div key={index} className="flex items-center py-2 border-b last:border-0">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${day.duration ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          }`}
      >
        {day.duration ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
      </div>


      <div className="flex-1">
        {/* {console.log(day.duration)} */}
        <div className="font-medium">{day.calories ? "Workout Completed" : "Rest Day"}</div>
        <div className="text-sm text-muted-foreground">{formattedDate}</div>
      </div>
      {day.duration !== 0 && (
        <div className="text-right">
          <div className="font-medium">{day.duration} min</div>
          <div className="text-sm text-muted-foreground">{day.calories} calories</div>
        </div>
      )}
    </div>
  )
}
