// components/dashboard/StatsTab.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"
import { format } from "date-fns"
import { AddMeasurementsDialog } from "../resuableComponents/add-measurements-dialog"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"


export function StatsTab({ measurements = [] }) {
  const hasMeasurements = measurements.length > 0

  // Get the most recent measurement
  const latestMeasurement = hasMeasurements ? measurements[measurements.length - 1] : null

  // Get the previous measurement for comparison (if available)
  const previousMeasurement = measurements.length > 1 ? measurements[measurements.length - 2] : null

  // Calculate changes if both measurements exist
  const getChange = (current, previous, key) => {
    if (!current || !previous) return null

    const currentValue = Number.parseFloat(current[key])
    const previousValue = Number.parseFloat(previous[key])

    if (isNaN(currentValue) || isNaN(previousValue)) return null

    const change = currentValue - previousValue
    return {
      value: Math.abs(change).toFixed(1),
      direction: change < 0 ? "down" : change > 0 ? "up" : "same",
    }
  }
  return (
    <Card>
    <CardHeader>
      <CardTitle>Body Measurements</CardTitle>
    </CardHeader>
    <CardContent>
      {!hasMeasurements ? (
        <div className="text-center py-8">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No measurements recorded yet</p>
          <AddMeasurementsDialog type="add"/>
        </div>
      ) : (

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-2">
            Latest measurements from {format(new Date(latestMeasurement.date), "MMMM d, yyyy")}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Measurement</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestMeasurement.weight && (
                <TableRow>
                  <TableCell className="font-medium">Weight</TableCell>
                  <TableCell>{latestMeasurement.weight} lbs</TableCell>
                  <TableCell>
                    {previousMeasurement && getChange(latestMeasurement, previousMeasurement, "weight") && (
                      <span
                        className={
                          getChange(latestMeasurement, previousMeasurement, "weight").direction === "down"
                            ? "text-green-600"
                            : getChange(latestMeasurement, previousMeasurement, "weight").direction === "up"
                              ? "text-red-600"
                              : ""
                        }
                      >
                        {getChange(latestMeasurement, previousMeasurement, "weight").direction === "down" ? "↓" : "↑"}
                        {getChange(latestMeasurement, previousMeasurement, "weight").value} lbs
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )}

              {latestMeasurement.bodyFat && (
                <TableRow>
                  <TableCell className="font-medium">Body Fat</TableCell>
                  <TableCell>{latestMeasurement.bodyFat}%</TableCell>
                  <TableCell>
                    {previousMeasurement && getChange(latestMeasurement, previousMeasurement, "bodyFat") && (
                      <span
                        className={
                          getChange(latestMeasurement, previousMeasurement, "bodyFat").direction === "down"
                            ? "text-green-600"
                            : getChange(latestMeasurement, previousMeasurement, "bodyFat").direction === "up"
                              ? "text-red-600"
                              : ""
                        }
                      >
                        {getChange(latestMeasurement, previousMeasurement, "bodyFat").direction === "down"
                          ? "↓"
                          : "↑"}
                        {getChange(latestMeasurement, previousMeasurement, "bodyFat").value}%
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )}

              {latestMeasurement.chest && (
                <TableRow>
                  <TableCell className="font-medium">Chest</TableCell>
                  <TableCell>{latestMeasurement.chest} in</TableCell>
                  <TableCell>
                    {previousMeasurement && getChange(latestMeasurement, previousMeasurement, "chest") && (
                      <span
                        className={
                          getChange(latestMeasurement, previousMeasurement, "chest").direction === "up"
                            ? "text-green-600"
                            : getChange(latestMeasurement, previousMeasurement, "chest").direction === "down"
                              ? "text-red-600"
                              : ""
                        }
                      >
                        {getChange(latestMeasurement, previousMeasurement, "chest").direction === "up" ? "↑" : "↓"}
                        {getChange(latestMeasurement, previousMeasurement, "chest").value} in
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )}

              {latestMeasurement.waist && (
                <TableRow>
                  <TableCell className="font-medium">Waist</TableCell>
                  <TableCell>{latestMeasurement.waist} in</TableCell>
                  <TableCell>
                    {previousMeasurement && getChange(latestMeasurement, previousMeasurement, "waist") && (
                      <span
                        className={
                          getChange(latestMeasurement, previousMeasurement, "waist").direction === "down"
                            ? "text-green-600"
                            : getChange(latestMeasurement, previousMeasurement, "waist").direction === "up"
                              ? "text-red-600"
                              : ""
                        }
                      >
                        {getChange(latestMeasurement, previousMeasurement, "waist").direction === "down" ? "↓" : "↑"}
                        {getChange(latestMeasurement, previousMeasurement, "waist").value} in
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )}

              {latestMeasurement.arms && (
                <TableRow>
                  <TableCell className="font-medium">Arms</TableCell>
                  <TableCell>{latestMeasurement.arms} in</TableCell>
                  <TableCell>
                    {previousMeasurement && getChange(latestMeasurement, previousMeasurement, "arms") && (
                      <span
                        className={
                          getChange(latestMeasurement, previousMeasurement, "arms").direction === "up"
                            ? "text-green-600"
                            : getChange(latestMeasurement, previousMeasurement, "arms").direction === "down"
                              ? "text-red-600"
                              : ""
                        }
                      >
                        {getChange(latestMeasurement, previousMeasurement, "arms").direction === "up" ? "↑" : "↓"}
                        {getChange(latestMeasurement, previousMeasurement, "arms").value} in
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <AddMeasurementsDialog type="update" />
        </div>
      )}
    </CardContent>
  </Card>
 
  )
}
