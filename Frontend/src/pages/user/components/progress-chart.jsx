import { useEffect, useState } from "react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for the chart
const generateChartData = () => {
  const data = []
  const now = new Date()

  for (let i = 27; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate some random workout data
    const hasWorkout = Math.random() > 0.3 // 70% chance of having a workout

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      minutes: hasWorkout ? Math.floor(Math.random() * 40) + 20 : 0, // 20-60 minutes
      calories: hasWorkout ? Math.floor(Math.random() * 300) + 150 : 0, // 150-450 calories
    })
  }

  return data
}

// Group data by week for weekly view
const getWeeklyData = (data) => {
  const weeklyData = []
  for (let i = 0; i < 4; i++) {
    const weekStart = i * 7
    const weekEnd = weekStart + 6
    const weekData = data.slice(weekStart, weekEnd + 1)

    const totalMinutes = weekData.reduce((sum, day) => sum + day.minutes, 0)
    const totalCalories = weekData.reduce((sum, day) => sum + day.calories, 0)
    const workoutDays = weekData.filter((day) => day.minutes > 0).length

    weeklyData.push({
      week: `Week ${4 - i}`,
      minutes: totalMinutes,
      calories: totalCalories,
      workouts: workoutDays,
    })
  }
  return weeklyData.reverse()
}

export function ProgressChart() {
  const [data, setData] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [isMounted, setIsMounted] = useState(false)
  const [view, setView] = useState("daily")

  useEffect(() => {
    const chartData = generateChartData()
    setData(chartData)
    setWeeklyData(getWeeklyData(chartData))
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="flex items-center justify-center h-full">Loading chart...</div>
  }

  return (
    <div className="h-full w-full flex flex-col">
      <Tabs defaultValue="daily" className="w-full" onValueChange={setView}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Workout Activity</h3>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="h-[300px]">
          <ChartContainer
            config={{
              minutes: {
                label: "Minutes",
                color: "hsl(var(--chart-1))",
              },
              calories: {
                label: "Calories",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value, index) => (index % 7 === 0 ? value : "")}
                />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="minutes"
                  stroke="var(--color-minutes)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  name="Minutes"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="calories"
                  stroke="var(--color-calories)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="weekly" className="h-[300px]">
          <ChartContainer
            config={{
              minutes: {
                label: "Minutes",
                color: "hsl(var(--chart-1))",
              },
              calories: {
                label: "Calories",
                color: "hsl(var(--chart-2))",
              },
              workouts: {
                label: "Workouts",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="minutes"
                  fill="var(--color-minutes)"
                  name="Minutes"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="calories"
                  fill="var(--color-calories)"
                  name="Calories"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="workouts"
                  fill="var(--color-workouts)"
                  name="Workouts"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
      </Tabs>

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
    </div>
  )
}

