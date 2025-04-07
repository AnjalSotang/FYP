import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format, parseISO } from "date-fns"
import { fetchMeasurements } from "../../../../../../store/measurementSlice" // Adjust the import path
import { Loader2 } from "lucide-react" // For loading spinner

export function MeasurementsHistory() {
  const dispatch = useDispatch()
  const { data: measurements, status } = useSelector((state) => state.measurement || {});
  const [activeMetric, setActiveMetric] = useState("weight")

  // Fetch measurements only on initial mount
  useEffect(() => {
    dispatch(fetchMeasurements())
  }, [dispatch])

  const metricColors = {
    weight: "#2563eb",
    chest: "#16a34a",
    waist: "#dc2626",
    arms: "#9333ea",
    thighs: "#ea580c",
  }

  const metricUnits = {
    weight: "lbs",
    chest: "in",
    waist: "in",
    arms: "in",
    thighs: "in",
  }

  // Format measurements data for the chart with better type handling
  const formatMeasurementsData = () => {
    if (!measurements || measurements.length === 0) return []
    
    return measurements.map(measurement => {
      // Safely parse the date
      let formattedDate
      try {
        const dateObj = typeof measurement.date === 'string' 
          ? parseISO(measurement.date) 
          : new Date(measurement.date)
        formattedDate = format(dateObj, "MMM dd")
      } catch (e) {
        formattedDate = "Invalid Date"
      }

      // Ensure numeric values are properly handled
      return {
        date: formattedDate,
        rawDate: measurement.date, // Keep raw date for sorting
        weight: parseFloat(measurement.weight) || null,
        chest: parseFloat(measurement.chest) || null,
        waist: parseFloat(measurement.waist) || null,
        arms: parseFloat(measurement.arms) || null,
        thighs: parseFloat(measurement.thighs) || null,
      }
    }).sort((a, b) => {
      // Sort by date - handle different date formats
      const dateA = new Date(a.rawDate)
      const dateB = new Date(b.rawDate)
      return dateA - dateB
    })
  }

  const chartData = formatMeasurementsData()

  const getMinMaxValues = (data, key) => {
    if (data.length === 0) return { min: 0, max: 100 }
    
    const values = data.map((item) => item[key]).filter(val => val !== undefined && val !== null && !isNaN(val))
    if (values.length === 0) return { min: 0, max: 100 }
    
    const min = Math.floor(Math.min(...values) - 1)
    const max = Math.ceil(Math.max(...values) + 1)
    return { min, max }
  }

  const { min, max } = getMinMaxValues(chartData, activeMetric)

  // Loading state
  if (status === "loading" || status?.status === "loading") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Measurements History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[350px]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading measurements...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No data state
  if (!chartData || chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Measurements History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[350px]">
          <div className="text-center">
            <p className="mb-2">No measurement data available</p>
            <p className="text-sm text-muted-foreground">Add measurements to see your progress</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Measurements History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weight" onValueChange={setActiveMetric} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="chest">Chest</TabsTrigger>
            <TabsTrigger value="waist">Waist</TabsTrigger>
            <TabsTrigger value="arms">Arms</TabsTrigger>
            <TabsTrigger value="thighs">Thighs</TabsTrigger>
          </TabsList>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis
                  domain={[min, max]}
                  tickCount={5}
                  tickFormatter={(value) => `${value}${metricUnits[activeMetric]}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value} ${metricUnits[activeMetric]}`,
                    activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1),
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={metricColors[activeMetric]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Tabs>

        <div className="mt-4 text-sm text-muted-foreground text-center">
          Tracking your {activeMetric} progress over time
        </div>
      </CardContent>
    </Card>
  )
}