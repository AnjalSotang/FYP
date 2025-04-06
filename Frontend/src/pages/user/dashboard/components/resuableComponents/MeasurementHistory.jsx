import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format, subDays } from "date-fns"

// Mock data for measurements history
const generateMockMeasurements = () => {
  const measurements = []
  const today = new Date()

  for (let i = 30; i >= 0; i -= 5) {
    const date = subDays(today, i)
    measurements.push({
      date: format(date, "MMM dd"),
      weight: Math.round(180 - i * 0.2 + (Math.random() * 3 - 1.5)),
      chest: Math.round(42 - i * 0.05 + (Math.random() * 0.5 - 0.25)),
      waist: Math.round(34 - i * 0.1 + (Math.random() * 0.5 - 0.25)),
      arms: Math.round(15 + i * 0.03 + (Math.random() * 0.3 - 0.15)),
      thighs: Math.round(24 - i * 0.03 + (Math.random() * 0.4 - 0.2)),
    })
  }

  return measurements
}

export function MeasurementsHistory() {
  const [measurementsData] = useState(generateMockMeasurements())
  const [activeMetric, setActiveMetric] = useState("weight")

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

  const getMinMaxValues = (data, key) => {
    const values = data.map((item) => item[key])
    const min = Math.floor(Math.min(...values) - 1)
    const max = Math.ceil(Math.max(...values) + 1)
    return { min, max }
  }

  const { min, max } = getMinMaxValues(measurementsData, activeMetric)

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
              <LineChart data={measurementsData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Tabs>

        <div className="mt-4 text-sm text-muted-foreground text-center">
          Tracking your {activeMetric} progress over the last 30 days
        </div>
      </CardContent>
    </Card>
  )
}

