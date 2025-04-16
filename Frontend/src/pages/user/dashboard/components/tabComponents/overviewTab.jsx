// components/dashboard/OverviewTab.jsx
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Trophy, TrendingUp, Calendar, Activity, Clock, Flame } from "lucide-react"
import { StatCard } from "../resuableComponents/StatCard"
import { WorkoutCard } from "../resuableComponents/WorkoutCard"
import { AddWorkoutCard } from "../resuableComponents/AddWorkoutCard"
import { ActivityItem } from "../resuableComponents/ActivityItem"
import { fetchActiveWorkoutsWithHistory, fetchWorkoutHistory } from "../../../../../../store/userWorkoutHistorySlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react"
import { WorkoutHistoryModal } from "../resuableComponents/WorkoutHistoryModal"

export function OverviewTab() {
  const dispatch = useDispatch();
  const historyEntries = useSelector((state) => state.userWorkoutHistory?.data?.historyEntries || []);
  const activeWorkoutEntries = useSelector((state) => state.userWorkoutHistory?.data?.activeWorkoutsHistory || []);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkoutHistory());
    dispatch(fetchActiveWorkoutsWithHistory());
  }, [dispatch]);

  // Get date strings in YYYY-MM-DD format to avoid timezone issues
  const getDateString = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toISOString().split('T')[0];
  };

  // Properly calculate start date of the current week (Sunday)
  const getStartOfWeek = () => {
    const now = new Date();
    const today = now.getDay(); // 0 is Sunday, 1 is Monday, etc.   

    // If today is already Sunday, return today's date
    // Otherwise, go back to the previous Sunday
    const daysToSubtract = today;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysToSubtract);

    // Reset time to midnight
    startOfWeek.setHours(0, 0, 0, 0);

    return startOfWeek;
  };

  // Calculate end date of the current week (Saturday)
  const getEndOfWeek = () => {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday is 6 days after Sunday

    // Set to end of day
    endOfWeek.setHours(23, 59, 59, 999);

    return endOfWeek;
  };

  // Get last week's date range
  const getLastWeekRange = () => {
    const startOfThisWeek = getStartOfWeek();

    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setDate(startOfThisWeek.getDate() - 1);
    endOfLastWeek.setHours(23, 59, 59, 999);

    const startOfLastWeek = new Date(endOfLastWeek);
    startOfLastWeek.setDate(endOfLastWeek.getDate() - 6);
    startOfLastWeek.setHours(0, 0, 0, 0);

    return { startOfLastWeek, endOfLastWeek };
  };

  // Calculate stats from workout history
  const {
    weeklyWorkouts,
    totalWeeklyWorkouts,
    totalWeeklyMinutes,
    totalWeeklyCalories,
    totalWorkouts,
    totalMinutes,
    totalCalories,
    streakCount,
    recentActivityEntries,
    lastWeekStats,
    weekOverWeekComparison,
    isEarlyInWeek
  } = useMemo(() => {
    if (!historyEntries?.length) {
      return {
        weeklyWorkouts: [],
        totalWeeklyWorkouts: 0,
        totalWeeklyMinutes: 0,
        totalWeeklyCalories: 0,
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        streakCount: 0,
        recentActivityEntries: [],
        lastWeekStats: { workouts: 0, minutes: 0, calories: 0 },
        weekOverWeekComparison: { workouts: 0, minutes: 0, calories: 0 },
        isEarlyInWeek: false
      };
    }

    // Get start of week date string
    const startOfWeek = getStartOfWeek();
    const endOfWeek = getEndOfWeek();

    // Get today
    const today = new Date();
    // Consider it early in the week if it's Sunday or Monday
    const isEarlyInWeek = today.getDay() <= 1;

    // Filter for workouts in current week
    const weeklyWorkouts = historyEntries.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfWeek && workoutDate <= endOfWeek;
    });

    // Calculate weekly stats
    // Track unique days with completed workouts
    const uniqueWorkoutDays = new Set();
    weeklyWorkouts.forEach(workout => {
      if (workout.completed) {
        uniqueWorkoutDays.add(getDateString(workout.date));
      }
    });

    const totalWeeklyWorkouts = uniqueWorkoutDays.size; // Count of unique days with workouts
    const totalWeeklyMinutes = weeklyWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const totalWeeklyCalories = weeklyWorkouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);

    // Calculate all-time stats
    const totalWorkouts = historyEntries.filter(workout => workout.completed).length;
    const totalMinutes = historyEntries.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const totalCalories = historyEntries.reduce((sum, workout) => sum + (workout.calories || 0), 0);

    // Get last week's workouts
    const { startOfLastWeek, endOfLastWeek } = getLastWeekRange();
    const lastWeekWorkouts = historyEntries.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfLastWeek && workoutDate <= endOfLastWeek;
    });

    // Calculate last week's stats
    const uniqueLastWeekWorkoutDays = new Set();
    lastWeekWorkouts.forEach(workout => {
      if (workout.completed) {
        uniqueLastWeekWorkoutDays.add(getDateString(workout.date));
      }
    });

    const lastWeekStats = {
      workouts: uniqueLastWeekWorkoutDays.size,
      minutes: lastWeekWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0),
      calories: lastWeekWorkouts.reduce((sum, workout) => sum + (workout.calories || 0), 0)
    };

    // Calculate week-over-week comparison
    const weekOverWeekComparison = {
      workouts: totalWeeklyWorkouts - lastWeekStats.workouts,
      minutes: totalWeeklyMinutes - lastWeekStats.minutes,
      calories: totalWeeklyCalories - lastWeekStats.calories
    };

    // Use the same weekly workout entries for recent activity (Sunday to Saturday)
    // But sort them by date - newest first
    const recentActivityEntries = [...weeklyWorkouts].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate streak
    const calculateStreak = () => {
      // Sort entries by date descending (newest first)
      const sorted = [...historyEntries]
        .filter(entry => entry.completed)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      if (sorted.length === 0) {
        return 0;
      }

      // Track dates we've had workouts
      const workoutDays = new Set(sorted.map(entry => getDateString(entry.date)));

      // Count consecutive days
      let streak = 1;
      let currentDate = new Date();

      // Check previous days
      for (let i = 1; i <= 366; i++) {
        currentDate.setDate(currentDate.getDate() - 1);
        const dateToCheck = getDateString(currentDate);

        if (workoutDays.has(dateToCheck)) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    };

    return {
      weeklyWorkouts,
      totalWeeklyWorkouts,
      totalWeeklyMinutes,
      totalWeeklyCalories,
      totalWorkouts,
      totalMinutes,
      totalCalories,
      streakCount: calculateStreak(),
      recentActivityEntries,
      lastWeekStats,
      weekOverWeekComparison,
      isEarlyInWeek
    };
  }, [historyEntries]);

  // Format percentage change with + or - sign
  const formatChange = (value) => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  console.log(recentActivityEntries)
  return (
    <>
      {/* New Week Welcome Message */}
      {isEarlyInWeek && totalWeeklyWorkouts === 0 && (
        <Card className="border-l-4 border-l-amber-500 mb-8">
          <CardContent className="flex items-center p-4">
            <div className="bg-amber-100 p-2 rounded-full mr-4">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">New week started!</p>
              <p className="text-sm text-muted-foreground">Time to set new fitness goals and continue your progress.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Weekly Workouts"
          value={totalWeeklyWorkouts}
          subValue="/ 7"
          progress={(totalWeeklyWorkouts / 7) * 100}
          icon={<Activity className="h-5 w-5 text-primary" />}
        />

        <StatCard
          title="Current Streak"
          value={`${streakCount} ${streakCount === 1 ? "day" : "days"}`}
          icon={<Trophy className="h-5 w-5 text-amber-500" />}
        />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-sm">Total Time</span>
              </div>
              <div className="font-medium">{totalWeeklyMinutes} min</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
              <Flame className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm">Calories Burned</span>
              </div>
              <div className="font-medium">{totalWeeklyCalories}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Week Summary */}
      {isEarlyInWeek && lastWeekStats.workouts > 0 && (
        
        <Card className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white border-0 mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <div className="bg-white/20 p-1.5 rounded-full mr-2">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-white">Last Week's Performance</CardTitle>
            </div>
            <CardDescription className="text-blue-100">Summary of your previous week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-white/10 border-0">
                <CardContent className="p-4">
                  <div className="text-sm text-blue-100 mb-1">Workouts</div>
                  <div className="text-xl font-semibold flex items-baseline">
                    {lastWeekStats.workouts} <span className="text-sm ml-1 opacity-70">/ 7</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-0">
                <CardContent className="p-4">
                  <div className="text-sm text-blue-100 mb-1">Total Time</div>
                  <div className="text-xl font-semibold flex items-baseline">
                    {lastWeekStats.minutes} <span className="text-sm ml-1 opacity-70">min</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-0">
                <CardContent className="p-4">
                  <div className="text-sm text-blue-100 mb-1">Calories</div>
                  <div className="text-xl font-semibold">{lastWeekStats.calories}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}


      <h2 className="text-xl font-bold mb-4">Active Workout Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {activeWorkoutEntries && activeWorkoutEntries.length > 0 ? (
          activeWorkoutEntries.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} compact={true} />
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500">No active workout plans</div>
        )}

        <AddWorkoutCard />
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
          <CardDescription>Your activity this week (Sunday-Saturday)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivityEntries && recentActivityEntries.length > 0 ? (
 
              recentActivityEntries.map((day, index) => (
                <ActivityItem key={index} day={day} index={index} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No workout activity this week</div>
            )}
          </div>
        </CardContent>
        <CardFooter>
              <Button variant="outline" className="w-full gap-1" onClick={() => setHistoryModalOpen(true)}>
                View Full History
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
             {/* Workout History Modal */}
          <WorkoutHistoryModal open={historyModalOpen} onOpenChange={setHistoryModalOpen} />
      </Card>
    </>
  )
}