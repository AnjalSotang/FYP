import {Link} from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Dumbbell, Flame } from "lucide-react"

// Mock data for featured workouts
const featuredWorkouts = [
  {
    id: 1,
    title: "30-Day Strength Challenge",
    level: "Intermediate",
    duration: "4 weeks",
    category: "Strength",
    calories: "300-500",
    image: "/placeholder.svg?height=200&width=300",
    equipment: ["Dumbbells", "Bench"],
    description: "Build muscle and increase strength with this progressive 30-day program.",
  },
  {
    id: 2,
    title: "HIIT Fat Burner",
    level: "Advanced",
    duration: "3 weeks",
    category: "Cardio",
    calories: "400-600",
    image: "/placeholder.svg?height=200&width=300",
    equipment: ["Bodyweight"],
    description: "Intense interval training designed to maximize calorie burn and improve conditioning.",
  },
  {
    id: 3,
    title: "Beginner Full Body",
    level: "Beginner",
    duration: "6 weeks",
    category: "Full Body",
    calories: "200-400",
    image: "/placeholder.svg?height=200&width=300",
    equipment: ["Dumbbells", "Resistance Bands"],
    description: "Perfect starting point for fitness newcomers focusing on proper form and building a foundation.",
  },
]

export function FeaturedWorkouts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredWorkouts.map((workout) => (
        <Card key={workout.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="relative">
            <img
              src={workout.image || "/placeholder.svg"}
              alt={workout.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <Badge
              className="absolute top-3 right-3"
              variant={
                workout.level === "Beginner"
                  ? "default"
                  : workout.level === "Intermediate"
                    ? "secondary"
                    : "destructive"
              }
            >
              {workout.level}
            </Badge>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{workout.title}</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 pb-4">
            <p className="text-muted-foreground mb-4 text-sm">{workout.description}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{workout.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                <span>{workout.equipment.join(", ")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-muted-foreground" />
                <span>{workout.calories} cal/session</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <Link href={`/plans/${workout.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Plan
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

