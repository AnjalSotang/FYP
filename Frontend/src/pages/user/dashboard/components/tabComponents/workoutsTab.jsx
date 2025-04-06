// components/dashboard/WorkoutsTab.jsx
import { WorkoutCard } from "../resuableComponents/WorkoutCard"
import { AddWorkoutCard } from "../resuableComponents/AddWorkoutCard"
// import { activeWorkouts } from "../../data/mockData"
// import { fetchActiveWorkoutsWithHistory, fetchWorkoutHistory } from "../../../../../../store/userWorkoutHistorySlice";
import { useSelector } from "react-redux";
// import { useEffect } from "react"



export function WorkoutsTab() {

  // const dispatch = useDispatch();
    // const historyEntries = useSelector((state) => state.userWorkoutHistory?.data?.historyEntries || []);
    const activeWorkoutEntries = useSelector((state) => state.userWorkoutHistory?.data?.activeWorkoutsHistory || []);

    // console.log(activeWorkoutEntries)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeWorkoutEntries.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
      <AddWorkoutCard />
    </div>
  )
}