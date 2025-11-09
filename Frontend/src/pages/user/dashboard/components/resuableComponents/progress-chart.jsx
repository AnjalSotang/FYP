import { useEffect, useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";

// In the formatChartData function, convert seconds to minutes
const formatChartData = (historyEntries, viewMonth, viewYear) => {
  const workoutsByDay = new Map();
  
  // Filter entries for the selected month and year
  const filteredEntries = historyEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === viewMonth && entryDate.getFullYear() === viewYear;
  });

  filteredEntries.forEach(entry => {
    // Ensure we're working with a Date object
    
    const workoutDate = new Date(entry.date);
    const dateKey = workoutDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Convert duration from seconds to minutes
    const durationInMinutes = entry.duration ? Math.round(entry.duration / 60) : 0;
  

    if (workoutsByDay.has(dateKey)) {
      const existingEntry = workoutsByDay.get(dateKey);
      workoutsByDay.set(dateKey, {
        date: dateKey,
        minutes: existingEntry.minutes + durationInMinutes,
        calories: existingEntry.calories + (entry.calories || 0),
        workouts: existingEntry.workouts + 1,
        rawDate: workoutDate
      });
    } else {
      workoutsByDay.set(dateKey, {
        date: dateKey,
        minutes: durationInMinutes,
        calories: entry.calories || 0,
        workouts: 1,
        rawDate: workoutDate
      });
    }
  });

  let result = Array.from(workoutsByDay.values());
  result.sort((a, b) => a.rawDate - b.rawDate);
  return fillMissingDaysForMonth(result, viewMonth, viewYear);
};




// Function to ensure we have data for all days in the selected month
const fillMissingDaysForMonth = (data, month, year) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // Last day of month
  const filledData = [];
  const existingDates = new Map(data.map(item => [item.date, item]));

  // Create a date for each day in the month
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    filledData.push(existingDates.get(dateStr) || { 
      date: dateStr, 
      minutes: 0, 
      calories: 0, 
      workouts: 0,
      rawDate: new Date(d)
    });
  }

  return filledData;
};

// Get properly aligned calendar weeks for the selected month
const getCalendarWeeks = (month, year) => {
  // Get first day of the month
  const firstDay = new Date(year, month, 1);
  
  // Get last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Array to hold weeks
  const weeks = [];
  
  // Start from the first day of the month adjusted to previous Sunday
  let currentDate = new Date(firstDay);
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());
  
  // Create weeks until we include the last day of the month
  while (currentDate <= lastDay) {
    const weekStart = new Date(currentDate);
    
    // Create weekly data object
    const weekData = {
      week: `${weekStart.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}`,
      startDate: new Date(weekStart),
      endDate: new Date(weekStart),
      minutes: 0,
      calories: 0,
      workouts: 0
    };
    
    // Set end date to Saturday of this week
    weekData.endDate.setDate(weekStart.getDate() + 6);
    
    // Format week label to show range
    weekData.week = `${weekData.startDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })} - ${weekData.endDate.toLocaleDateString("en-US", { day: 'numeric' })}`;
    
    weeks.push(weekData);
    
    // Move to next week's Sunday
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return weeks;
};

// Group data by week for weekly view
const getWeeklyData = (dailyData, viewMonth, viewYear) => {
  // Get calendar weeks for the selected month
  const weeks = getCalendarWeeks(viewMonth, viewYear);
  
  // For each week, sum up the values from dailyData that fall within that week
  weeks.forEach(week => {
    dailyData.forEach(day => {
      const dayDate = day.rawDate;
      
      // Check if this day falls within the current week
      if (dayDate >= week.startDate && dayDate <= week.endDate) {
        week.minutes += day.minutes;
        week.calories += day.calories;
        week.workouts += day.workouts;
      }
    });
  });
  
  return weeks;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div style={{ backgroundColor: entry.color }} className="w-3 h-3 rounded-full"></div>
            <span>{entry.name}: {entry.value} {entry.name === "Calories" ? "kcal" : entry.name === "Minutes" ? "min" : ""}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Component to display stats
const StatsCard = ({ title, value, icon, secondaryValue, secondaryLabel }) => (
  <Card className="overflow-hidden">
    <CardContent className="p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
          {secondaryValue && (
            <p className="text-xs text-muted-foreground">{secondaryValue} {secondaryLabel}</p>
          )}
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Month navigation button component
const NavButton = ({ onClick, icon, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="h-8 w-8 rounded-full flex items-center justify-center bg-background border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {icon}
  </button>
);

export function ProgressChart() {
  const historyEntries = useSelector((state) => state.userWorkoutHistory?.data?.historyEntries || []);
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState("daily");
  
// Inside your ProgressChart component, replace the code related to navigation constraints:

// Get current date
const today = new Date();

// Add state for month/year navigation
const [viewMonth, setViewMonth] = useState(today.getMonth());
const [viewYear, setViewYear] = useState(today.getFullYear());

// Filter out incomplete workouts
const validEntries = useMemo(() => 
  historyEntries.filter(entry => entry.completed), 
  [historyEntries]
);

// Determine if navigation buttons should be disabled
const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();

// Get earliest workout date for debugging
const earliestWorkoutDate = useMemo(() => {
  if (!validEntries || validEntries.length === 0) return new Date();
  
  // Use a try-catch to handle any potential date parsing issues
  try {
    const dates = validEntries
      .filter(entry => entry.date) // Ensure entry has a date
      .map(entry => new Date(entry.date).getTime())
      .filter(time => !isNaN(time)); // Filter out invalid dates
      
    return dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
  } catch (error) {
    console.error("Error calculating earliest date:", error);
    return new Date(); // Fallback to current date
  }
}, [validEntries]);

// DEBUG: Log the earliest date to help diagnose the issue
useEffect(() => {
  console.log("Earliest workout date:", earliestWorkoutDate);
  console.log("Current view:", viewMonth, viewYear);
}, [earliestWorkoutDate, viewMonth, viewYear]);

// Simplify the navigation button logic - just check if data exists
// We'll remove restrictions based on the earliest date completely
const isPrevMonthDisabled = false; // Allow navigation regardless of earliest date

// Navigation handlers
const goToPrevMonth = () => {
  if (viewMonth === 0) {
    setViewMonth(11);
    setViewYear(prev => prev - 1);
  } else {
    setViewMonth(prev => prev - 1);
  }
};

const goToNextMonth = () => {
  if (isCurrentMonth) return;
  
  if (viewMonth === 11) {
    setViewMonth(0);
    setViewYear(prev => prev + 1);
  } else {
    setViewMonth(prev => prev + 1);
  }
};
  // Reset to current month
  const goToCurrentMonth = () => {
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
  };

  // Memoized data processing for current view month/year
  const chartData = useMemo(() => 
    formatChartData(validEntries, viewMonth, viewYear), 
    [validEntries, viewMonth, viewYear]
  );
  
  const weeklyData = useMemo(() => 
    getWeeklyData(chartData, viewMonth, viewYear), 
    [chartData, viewMonth, viewYear]
  );

// Update the monthly stats calculation
const currentMonthStats = useMemo(() => {
  const entriesThisMonth = validEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === viewMonth && entryDate.getFullYear() === viewYear;
  });
  
  const calories = entriesThisMonth.reduce((sum, entry) => sum + (entry.calories || 0), 0);
  
  // Convert duration from seconds to minutes
  const seconds = entriesThisMonth.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const minutes = Math.round(seconds / 60);

  console.log(minutes)
  
  const workouts = entriesThisMonth.length;
  
  return {
    calories,
    minutes,
    workouts,
    avgCaloriesPerWorkout: workouts ? Math.round(calories / workouts) : 0,
    avgMinutesPerWorkout: workouts ? Math.round(minutes / workouts) : 0
  };
}, [validEntries, viewMonth, viewYear]);

// Update the total stats calculation
const totalStats = useMemo(() => {
  const calories = validEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
  
  // Convert duration from seconds to minutes
  const seconds = validEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const minutes = Math.round(seconds / 60);
  
  const workouts = validEntries.length;
  
  return {
    calories,
    minutes,
    workouts,
    avgCaloriesPerWorkout: workouts ? Math.round(calories / workouts) : 0,
    avgMinutesPerWorkout: workouts ? Math.round(minutes / workouts) : 0
  };
}, [validEntries]);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <div className="flex items-center justify-center h-full">Loading chart...</div>;
  }

  if (!historyEntries.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="mb-4 text-muted-foreground">
          <CalendarIcon size={48} />
        </div>
        <h3 className="text-lg font-medium mb-2">No workout data yet</h3>
        <p className="text-muted-foreground">Complete your first workout to see your progress!</p>
      </div>
    );
  }

  // Format the month and year for display
  const monthYearDisplay = new Date(viewYear, viewMonth).toLocaleDateString("en-US", { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="h-full w-full flex flex-col space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Total Calories Burned" 
          value={`${currentMonthStats.calories} kcal`}
          secondaryValue={`${totalStats.calories} kcal`}
          secondaryLabel="all time"
          icon={<Flame className="text-orange-500" size={20} />}
        />
        <StatsCard 
          title="Workout Duration" 
          value={`${currentMonthStats.minutes} min`}
          secondaryValue={`${totalStats.minutes} min`}
          secondaryLabel="all time"
          icon={<Clock className="text-blue-500" size={20} />}
        />
        <StatsCard 
          title="Workouts Completed" 
          value={currentMonthStats.workouts}
          secondaryValue={totalStats.workouts}
          secondaryLabel="all time"
          icon={<CalendarIcon className="text-green-500" size={20} />}
        />
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <NavButton 
                onClick={goToPrevMonth} 
                icon={<ChevronLeft size={16} />} 
                disabled={isPrevMonthDisabled}
              />
              <div className="flex flex-col items-center">
                <h3 className="text-base font-medium">{monthYearDisplay}</h3>
                {!isCurrentMonth && (
                  <button 
                    onClick={goToCurrentMonth}
                    className="text-xs text-primary hover:underline"
                  >
                    Go to current month
                  </button>
                )}
              </div>
              <NavButton 
                onClick={goToNextMonth} 
                icon={<ChevronRight size={16} />} 
                disabled={isCurrentMonth}
              />
            </div>
            
            <Tabs defaultValue="daily" onValueChange={setView}>
              <TabsList className="w-auto">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {view === "daily" ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value, index) => (index % 7 === 0 || index === 0 ? value : "")} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    tick={{ fontSize: 12 }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fontSize: 12 }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2} 
                    dot={{ r: 2 }} 
                    activeDot={{ r: 4 }} 
                    name="Minutes" 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2} 
                    dot={{ r: 2 }} 
                    activeDot={{ r: 4 }} 
                    name="Calories" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 12 }} 
                    // angle={-15} 
                    textAnchor="end" 
                    height={60} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="minutes" 
                    fill="hsl(var(--chart-1))" 
                    name="Minutes" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="calories" 
                    fill="hsl(var(--chart-2))" 
                    name="Calories" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="workouts" 
                    fill="hsl(var(--chart-3))" 
                    name="Workouts" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]"></div>
              <span>Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]"></div>
              <span>Calories</span>
            </div>
            {view === "weekly" && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-3))]"></div>
                <span>Workouts</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}