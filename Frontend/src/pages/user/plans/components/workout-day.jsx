import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Clock } from "lucide-react"

export function WorkoutDay({ day }) {
  // Extract exercises from the day
  const exercises = day.excercises || [];
  
  // Calculate estimated workout time based on actual data structure
  const calculateWorkoutTime = (exercises) => {
    let totalMinutes = 0;

    exercises.forEach((exercise) => {
      const sets = parseInt(exercise.WorkoutDayExercise.sets);
      // Calculate rest time in minutes
      const restTimeMinutes = exercise.WorkoutDayExercise.rest_time / 60;
      // Add exercise duration plus rest time
      totalMinutes += sets * (exercise.duration + restTimeMinutes);
    });

    // Add 5 minutes for warm-up
    totalMinutes += 5;

    return Math.round(totalMinutes);
  };

  const workoutTime = calculateWorkoutTime(exercises);

  // Extract day name parts (assuming format like "Sunday - Chest Day")
  const dayParts = day.dayName.split(' - ');
  const dayName = dayParts[0]; // "Sunday"
  const focus = dayParts.length > 1 ? dayParts[1] : ""; // "Chest Day"

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>
            {day.dayName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>~{workoutTime} min</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Warm-up (5 minutes)</h3>
          <p className="text-sm">
            5 minutes of light cardio (jumping jacks, high knees, or jogging in place) followed by dynamic stretching.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-medium">Main Workout</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 text-sm font-medium">Exercise</th>
                  <th className="text-center py-2 px-2 text-sm font-medium">Sets</th>
                  <th className="text-center py-2 px-2 text-sm font-medium">Reps</th>
                  <th className="text-center py-2 px-2 text-sm font-medium">Rest</th>
                  <th className="text-right py-2 px-2 text-sm font-medium">Equipment</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((exercise, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 px-2 text-sm">{exercise.name}</td>
                    <td className="py-3 px-2 text-sm text-center">{exercise.WorkoutDayExercise.sets}</td>
                    <td className="py-3 px-2 text-sm text-center">{exercise.WorkoutDayExercise.reps}</td>
                    <td className="py-3 px-2 text-sm text-center">{exercise.WorkoutDayExercise.rest_time}s</td>
                    <td className="py-3 px-2 text-sm text-right flex justify-end">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Dumbbell className="h-3 w-3" />
                        <span>{exercise.equipment}</span>
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Cool Down (5 minutes)</h3>
          <p className="text-sm">Static stretching focusing on the muscle groups worked during this session.</p>
        </div>
      </CardContent>
    </Card>
  )
}