import { useEffect, useState } from "react";

const WorkoutProgressChart = ({ history = [] }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  console.log(history)
  // Find the maximum duration for scaling
  const maxDuration = Math.max(...history.map((day) => day.duration || 0), 30);

  // Prepare data, limit to last 30 entries if there are more
  const chartData = history.length > 30 ? history.slice(-30) : history;
  
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
                day.completed && day.duration !== 0 ? "bg-primary/80" : "bg-muted"
              }`}
              style={{
                height: `${day.completed ? Math.max((day.duration / maxDuration) * 100, 10) : 5}%`,
                minHeight: day.completed ? "8px" : "4px",
                transition: "height 0.3s ease-in-out",
              }}
              title={`${day.date}: ${day.duration || 0} minutes`}
            ></div>
            <div className="text-xs text-muted-foreground mt-1 truncate max-w-full" style={{ fontSize: "0.65rem" }}>
              {day.date ? new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-4">
        <div>Workout Duration (minutes)</div>
        <div>{maxDuration} min max</div>
      </div>
    </div>
  );
};

export default WorkoutProgressChart;