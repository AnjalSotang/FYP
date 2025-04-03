// components/dashboard/WorkoutsTab.jsx
import { WorkoutCard } from "../resuableComponents/WorkoutCard"
import { AddWorkoutCard } from "../resuableComponents/AddWorkoutCard"
import { activeWorkouts } from "../../data/mockData"

export function WorkoutsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeWorkouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
      <AddWorkoutCard />
    </div>
  )
}