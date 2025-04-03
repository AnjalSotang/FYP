// components/dashboard/ProgressTab.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ProgressChart } from "../../../components/progress-chart"
import { StatItem } from "../resuableComponents/StatItem"
import { monthlyStats } from "../../data/mockData"

export function ProgressTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Workout Progress</CardTitle>
          <CardDescription>Your activity over the past 4 weeks</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ProgressChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Stats</CardTitle>
          <CardDescription>March 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyStats.map((stat, index) => (
              <StatItem 
                key={index}
                icon={stat.icon}
                label={stat.label}
                description={stat.description}
                value={stat.value}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

