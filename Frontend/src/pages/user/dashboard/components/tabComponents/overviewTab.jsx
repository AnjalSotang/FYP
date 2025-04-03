
// components/dashboard/OverviewTab.jsx
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { StatCard } from "../resuableComponents/StatCard"
import { WorkoutCard } from "../resuableComponents/WorkoutCard"
import { AddWorkoutCard } from "../resuableComponents/AddWorkoutCard"
import { ActivityItem } from "../resuableComponents/ActivityItem"
import { Trophy } from "lucide-react"
import { activeWorkouts, workoutHistory } from "../../data/mockData"

export function OverviewTab() {
  // Calculate stats
  const totalWorkouts = workoutHistory.filter((day) => day.completed).length
  const totalMinutes = workoutHistory.reduce((sum, day) => sum + day.duration, 0)
  const totalCalories = workoutHistory.reduce((sum, day) => sum + day.calories, 0)
  const streakCount = 1 // This would be calculated based on consecutive workout days

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Weekly Workouts" 
          value={totalWorkouts} 
          subValue="/ 7" 
          progress={(totalWorkouts / 7) * 100} 
        />
        
        <StatCard 
          title="Current Streak" 
          value={`${streakCount} days`} 
          icon={<Trophy className="h-5 w-5 text-yellow-500" />} 
        />
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-1">
              <div>Total Time</div>
              <div>{totalMinutes} min</div>
            </div>
            <div className="flex justify-between text-sm">
              <div>Calories Burned</div>
              <div>{totalCalories}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4">Active Workout Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {activeWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} compact={true} />
        ))}

        <AddWorkoutCard />
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
          <CardDescription>Your activity over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {workoutHistory.map((day, index) => (
              <ActivityItem key={index} day={day} index={index} />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full gap-1">
            View Full History
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
