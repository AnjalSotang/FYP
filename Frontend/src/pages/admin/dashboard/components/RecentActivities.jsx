import React from "react"
import { Activity } from "lucide-react"

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "Completed workout",
      plan: "Full Body Strength",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "Mike Chen",
      action: "Created new workout",
      plan: "HIIT Cardio",
      time: "4 hours ago",
    },
    {
      id: 3,
      user: "Emma Davis",
      action: "Subscribed",
      plan: "Premium Plan",
      time: "6 hours ago",
    },
    {
      id: 4,
      user: "James Wilson",
      action: "Achieved goal",
      plan: "Weight Loss Challenge",
      time: "12 hours ago",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action} - {activity.plan}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  )
}