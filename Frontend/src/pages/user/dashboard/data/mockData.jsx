// data/mockData.js

// Mock data for user's active workouts
export const activeWorkouts = [
    {
      id: 1,
      title: "30-Day Strength Challenge",
      progress: 40,
      nextWorkout: "Day 5: Upper Body",
      lastCompleted: "2 days ago",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      title: "Core Crusher",
      progress: 25,
      nextWorkout: "Day 3: Obliques Focus",
      lastCompleted: "Yesterday",
      image: "/placeholder.svg?height=100&width=150",
    },
  ]
  
  // Mock data for workout history
  export const workoutHistory = [
    { date: "Mar 14", duration: 45, calories: 320, completed: true },
    { date: "Mar 13", duration: 0, calories: 0, completed: false },
    { date: "Mar 12", duration: 50, calories: 380, completed: true },
    { date: "Mar 11", duration: 30, calories: 250, completed: true },
    { date: "Mar 10", duration: 0, calories: 0, completed: false },
    { date: "Mar 9", duration: 45, calories: 340, completed: true },
    { date: "Mar 8", duration: 60, calories: 450, completed: true },
  ]
  
  // Mock data for personal records
  export const personalRecords = [
    { exercise: "Bench Press", type: "1 rep max", value: "185 lbs" },
    { exercise: "Squat", type: "1 rep max", value: "225 lbs" },
    { exercise: "Deadlift", type: "1 rep max", value: "275 lbs" },
  ]
  
  // Mock data for monthly stats
  export const monthlyStats = [
    { label: "Workouts", description: "Completed", value: "12", icon: "CheckCircle2" },
    { label: "Total Time", description: "This month", value: "8.5h", icon: "Clock" },
    { label: "Calories", description: "Burned", value: "4,320", icon: "Flame" },
    { label: "Best Streak", description: "Consecutive days", value: "5", icon: "Trophy" },
  ]