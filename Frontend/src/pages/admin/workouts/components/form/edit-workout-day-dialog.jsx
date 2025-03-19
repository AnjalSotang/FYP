
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDispatch, useSelector } from "react-redux"
import { updateWorkoutDay } from "../../../../../../store/workoutSlice"


export function EditWorkoutDayDialog({ day, open, onOpenChange, onSave }) {
  const dispatch = useDispatch();
  const [dayName, setDayName] = useState(day.dayName)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setDayName(day.dayName)
    }
  }, [day, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would call your API here
      // await fetch(`/api/workout-days/${day.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ dayName }),
      // })

      dispatch(updateWorkoutDay({ id: day.id, dayName}))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      onSave({ id: day.id, dayName })
    } catch (error) {
      console.error("Error updating workout day:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Workout Day</DialogTitle>
            <DialogDescription>Update the workout day details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-dayName">Day Name</Label>
              <Input
                id="edit-dayName"
                value={dayName}
                onChange={(e) => setDayName(e.target.value)}
                placeholder="e.g., Monday - Chest Day"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

