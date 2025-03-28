import { useState } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteWorkoutDay } from "../../../../../../store/workoutDaySlice"
import { fetchWorkout } from "../../../../../../store/workoutSlice"
import { toast } from "react-toastify";
import STATUSES from "../../../../../globals/status/statuses";  // Adjust path if necessary

export function DeleteWorkoutDayDialog({ dayId, open, onOpenChange, onDelete }) {
  const dispatch = useDispatch()
  const { status } = useSelector((state) => state.workoutDaySlice);
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      dispatch(deleteWorkoutDay(dayId))
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      dispatch(fetchWorkout(dayId)); // Refetch workout data
 
      onDelete(dayId)
      onOpenChange(false) // Close the dialog after successful deletion

    } catch (error) {
      console.error("Error deleting workout day:", error)
    } finally {
      setIsDeleting(false)
      window.location.reload();
    }

  }

   // 🔥 Handle Status Updates
   useEffect(() => {
    if (status?.status === STATUSES.ERROR) {
        toast.error(status.message);
      }
    }, [status]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Workout Day</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this workout day? This action cannot be undone.
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