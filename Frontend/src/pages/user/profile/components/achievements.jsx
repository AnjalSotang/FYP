import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Trophy,
   
  } from "lucide-react"
  import { Badge } from "@/components/ui/badge"

const achievement = () => {

    // Mock achievements
      const achievements = [
        { id: 1, title: "First Workout", description: "Completed your first workout", date: "Mar 1, 2025", icon: "🏋️" },
        {
          id: 2,
          title: "Week Streak",
          description: "Completed workouts for 7 consecutive days",
          date: "Mar 8, 2025",
          icon: "🔥",
        },
        { id: 3, title: "Plan Finisher", description: "Completed a full workout plan", date: "Feb 28, 2025", icon: "🏆" },
      ]
    

    return(
        <Card id="achievements" >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-lime-400" />
                Achievements
              </CardTitle>
              <CardDescription >View your fitness achievements</CardDescription>
            </CardHeader>
            <CardContent>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {achievements.map((achievement) => (
      <div
        key={achievement.id}
        className="border border-navy-600 bg-navy-800 rounded-lg p-4 flex flex-col items-center text-center shadow-sm"
      >
        <div className="text-3xl mb-2 text-lime-400">{achievement.icon}</div>
        <h3 className="font-medium text-white">{achievement.title}</h3>
        <p className="text-sm text-navy-300 mb-2">{achievement.description}</p>
        <Badge variant="outline" className="bg-navy-700 text-lime-400 border-navy-700">
          {achievement.date}
        </Badge>
      </div>
    ))}
  </div>
</CardContent>

            <CardFooter>
              <Button variant="default" className="w-full">
                View All Achievements
              </Button>
            </CardFooter>
          </Card>
    )
}

export default achievement

