import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart } from "lucide-react"
// Import the static image for user role
import userWorkoutImage from "../../../../../assets/images/Planning.jpg" // Adjust the path/filename as needed

export function WorkoutCard({ workout, compact = false }) {
  console.log(userWorkoutImage)
  // Determine which image to use based on role
  console.log(workout)
  const getImageSrc = () => {
    if (workout.role === "user") {
      // Use static image for user role
      return userWorkoutImage;
    } else {
      // Use dynamic image for other roles
      const profileImageUrl = workout?.image ? workout.image.replace(/\\/g, "/") : "";
      return profileImageUrl ? `http://localhost:3001/${profileImageUrl}` : undefined;
    }
  };

  if (compact) {
    return (
      <Card key={workout.id} className="overflow-hidden">
        <div className="flex">
          <div className="flex h-full items-center justify-center">
            <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden">
              <img
                src={getImageSrc()}
                alt={workout.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{workout.title}</CardTitle>
              <CardDescription>{workout.progress}% complete</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <Progress value={workout.progress} className="h-2 mb-3" />
              <div className="text-sm">
                <div className="font-medium">Next: {workout.nextWorkout}</div>
                <div className="text-muted-foreground">Last completed: {workout.lastCompleted}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to={`/MyWorkoutsID/${workout.id}`} className="w-full">
                <Button variant="outline" className="w-full text-sm">
                  Continue Workout
                </Button>
              </Link>
            </CardFooter>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card key={workout.id} className="flex flex-col h-full">
      <div className="relative">
        <img
          src={getImageSrc()}
          alt={workout.title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <Badge className="absolute top-3 right-3">{workout.progress}% Complete</Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle>{workout.title}</CardTitle>
        <CardDescription>Next: {workout.nextWorkout}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <Progress value={workout.progress} className="h-2 mb-4" />
        <div className="text-sm text-muted-foreground">Last completed: {workout.lastCompleted}</div>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Link to={`/MyWorkoutsID/${workout.id}`} className="flex-1">
          <Button className="w-full">Continue</Button>
        </Link>
        <Button variant="outline" size="icon">
          <BarChart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}