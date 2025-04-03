// components/dashboard/StatItem.jsx
import { CheckCircle2, Clock, Flame, Trophy, Dumbbell } from "lucide-react"

const iconComponents = {
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
  Dumbbell
}

export function StatItem({ icon, label, description, value }) {
  const IconComponent = iconComponents[icon] || CheckCircle2
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}