import { useEffect, useState } from "react";

const WorkoutProgressChart = ({ history = [] }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Convert seconds to minutes for each entry
  const processedHistory = history.map(day => ({
    ...day,
    durationMinutes: day.duration ? Math.round(day.duration / 60) : 0
  }));

  // Find the maximum duration in minutes for scaling
  const maxDurationMinutes = Math.max(...processedHistory.map((day) => day.durationMinutes || 0), 30);

  // Prepare data, limit to last 30 entries if there are more
  const chartData = processedHistory.length > 30 ? processedHistory.slice(-30) : processedHistory;
  
  // If no history data is available
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No workout data available yet
      </div>
    );
  }

  if (!isMounted) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading chart...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-14 xl:grid-cols-30 gap-1 items-end">
        {chartData.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-full rounded-t-sm ${
                day.completed && day.durationMinutes !== 0 ? "bg-primary/80" : "bg-muted"
              }`}
              style={{
                height: `${day.completed ? Math.max((day.durationMinutes / maxDurationMinutes) * 100, 10) : 5}%`,
                minHeight: day.completed ? "8px" : "4px",
                transition: "height 0.3s ease-in-out",
              }}
              title={`${day.date}: ${day.durationMinutes || 0} minutes`}
            ></div>
            <div className="text-xs text-muted-foreground mt-1 truncate max-w-full" style={{ fontSize: "0.65rem" }}>
              {day.date ? new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-4">
        <div>Workout Duration (minutes)</div>
        <div>{maxDurationMinutes} min max</div>
      </div>
    </div>
  );
};

export default WorkoutProgressChart;