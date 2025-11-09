import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { removeExerciseFromWorkoutDay } from "../../../../../../store/workoutDaySlice"
import { fetchWorkout } from "../../../../../../store/workoutSlice"
import { toast } from "react-toastify";
import STATUSES from "../../../../../globals/status/statuses";

export function DeleteExerciseDialog({ dayId, exerciseId, workoutId, open, onOpenChange, onDelete }) {
  const dispatch = useDispatch()
  const { status } = useSelector((state) => state.workoutDaySlice);
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      dispatch(removeExerciseFromWorkoutDay({
        dayId: dayId,
        excerciseId: exerciseId, // Note: using excerciseId with the typo to match backend
        workoutId: workoutId
      }));
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      onDelete && onDelete(exerciseId)
      onOpenChange(false) // Close the dialog after successful deletion

    } catch (error) {
      console.error("Error deleting exercise:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.ERROR) {
      toast.error(status.message);
    }
  }, [status]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Exercise</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this exercise from the workout day? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}