// components/dashboard/StatCard.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy } from "lucide-react"

export function StatCard({ title, value, subValue, icon, progress }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {progress ? (
          <>
            <div className="text-3xl font-bold">
              {value} <span className="text-muted-foreground text-sm font-normal">{subValue}</span>
            </div>
            <Progress value={progress} className="h-2 mt-2" />
          </>
        ) : (
          <div className="flex items-center">
            <div className="text-3xl font-bold mr-3">{value}</div>
            {icon && icon}
          </div>
        )}
      </CardContent>
    </Card>
  )
}