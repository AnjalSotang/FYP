import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateRecordsDialog } from "@/pages/user/dashboard/components/resuableComponents/update-records-dialog"
import { Dumbbell } from "lucide-react"

export function PersonalRecordsCard({ records = [] }) {
  const hasRecords = records.length > 0

  return (
    <>
       <Card>
      <CardHeader>
        <CardTitle>Personal Records</CardTitle>
      </CardHeader>
      <CardContent>
        {hasRecords ? (
          <div className="space-y-4">
            {records.map((record) => (
             
              <div key={record.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{record.exercise}</div>
                    <div className="text-sm text-muted-foreground">{record.type}</div>
                  </div>
                </div>
                <div className="text-xl font-bold">
                  {record.value} {record.unit}
                </div>
              </div>
           
             
            ))}
                 <UpdateRecordsDialog type = "update"/>
          </div>
          
        ) : (
          <div className="text-center py-8">
            <Dumbbell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No personal records yet</p>
            <UpdateRecordsDialog type = "add"/>
          </div>
        )}
      </CardContent>
    </Card>
    </>
 
  )
}

