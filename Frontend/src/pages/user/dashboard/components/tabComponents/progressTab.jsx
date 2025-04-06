// components/dashboard/ProgressTab.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ProgressChart } from "../../../components/progress-chart"
import { StatItem } from "../resuableComponents/StatItem"
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkoutHistory } from "../../../../../../store/userWorkoutHistorySlice";
import { useEffect, useMemo } from "react";

// Function to calculate monthly statistics from workout data
const calculateMonthlyStats = (workoutData) => {
  // Get current date to determine the current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Format month name for display
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);
  
  // Filter workouts from the current month
  const currentMonthWorkouts = workoutData.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate.getMonth() === currentMonth && 
           workoutDate.getFullYear() === currentYear && 
           workout.completed === true;
  });
  
  // 1. Count total completed workouts
  const totalWorkouts = currentMonthWorkouts.length;
  
  // 2. Calculate total time in hours
  const totalMinutes = currentMonthWorkouts.reduce((sum, workout) => 
    sum + (workout.duration || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  
  // 3. Calculate total calories burned
  const totalCalories = currentMonthWorkouts.reduce((sum, workout) => 
    sum + (workout.calories || 0), 0);
  
  // 4. Calculate best streak (consecutive days with workouts)
  const calculateBestStreak = (workouts) => {
    if (!workouts.length) return 0;
    
    // Get unique dates (in YYYY-MM-DD format) with workouts
    const workoutDates = new Set();
    workouts.forEach(workout => {
      const date = new Date(workout.date);
      workoutDates.add(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    });
    
    // Convert to array of dates, sort them
    const sortedDates = Array.from(workoutDates)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a - b);
    
    let currentStreak = 1;
    let bestStreak = 1;
    
    // Calculate streaks by checking for consecutive days
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currDate = sortedDates[i];
      
      // Check if dates are consecutive (diff of exactly 1 day in milliseconds)
      const diffTime = currDate - prevDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return bestStreak;
  };
  
  const bestStreak = calculateBestStreak(currentMonthWorkouts);
  
  // Format the stats in the required structure
  return {
    stats: [
      { label: "Workouts", description: "Completed", value: totalWorkouts.toString(), icon: "CheckCircle2" },
      { label: "Total Time", description: "This month", value: `${totalHours}h`, icon: "Clock" },
      { label: "Calories", description: "Burned", value: totalCalories.toLocaleString(), icon: "Flame" },
      { label: "Best Streak", description: "Consecutive days", value: bestStreak.toString(), icon: "Trophy" },
    ],
    monthDisplay: `${monthName} ${currentYear}`
  };
};


export function ProgressTab() {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.userWorkoutHistory?.data?.historyEntries || []);

   // Calculate monthly stats from actual history data
   const { stats: monthlyStats, monthDisplay } = useMemo(() => 
    calculateMonthlyStats(history), [history]);

  console.log(history)

    useEffect(() => {
          dispatch(fetchWorkoutHistory());
          // dispatch(fetchActiveWorkoutsWithHistory())
      }, [dispatch]);

    
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Workout Progress</CardTitle>
          <CardDescription>Your activity over the past 4 weeks</CardDescription>
        </CardHeader>
        <CardContent className="h-140">
          <ProgressChart historyEntries={history} />
        </CardContent>
      </Card>

     {/* Second column - Monthly Stats */}
     <Card>
        <CardHeader>
          <CardTitle>Monthly Stats</CardTitle>
          <CardDescription>{monthDisplay}</CardDescription>
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

