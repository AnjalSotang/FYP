// components/dashboard/AddWorkoutCard.jsx
import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function AddWorkoutCard() {
  return (
    <Card className="flex flex-col items-center justify-center p-6 border-dashed h-full">
      <div className="text-center mb-4">
        <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <h3 className="font-medium">Add a New Workout Plan</h3>
        <p className="text-sm text-muted-foreground">Generate a custom plan or choose from our library</p>
      </div>
      <div className="flex gap-3">
        <Link to="/generate">
          <Button variant="outline" size="sm">
            Generate Plan
          </Button>
        </Link>
        <Link to="/plans">
          <Button size="sm">Browse Plans</Button>
        </Link>
      </div>
    </Card>
  )
}
