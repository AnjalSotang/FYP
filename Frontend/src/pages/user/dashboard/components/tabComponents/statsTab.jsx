// components/dashboard/StatsTab.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"
import { RecordItem } from "../resuableComponents/RecordItem"
import { AddMeasurementsDialog } from "../../../components/add-measurements-dialog"
import { UpdateRecordsDialog } from "../../../components/update-records-dialog"
import { personalRecords } from "../../data/mockData"

export function StatsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Body Measurements</CardTitle>
          <CardDescription>Track your physical progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No measurements recorded yet</p>
          </div>
          <AddMeasurementsDialog />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Records</CardTitle>
          <CardDescription>Your best performances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personalRecords.map((record, index) => (
              <RecordItem key={index} record={record} />
            ))}
          </div>
          <UpdateRecordsDialog />
        </CardContent>
      </Card>
    </div>
  )
}