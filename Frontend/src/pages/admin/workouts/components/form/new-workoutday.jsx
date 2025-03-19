import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createWorkoutDay } from "../../../../../../store/workoutDaySlice";
// import STATUSES from "../../../../../globals/status/statuses"; 

export function NewWorkoutDayDialog({ id }) {
    // const { status } = useSelector((state) => state.workoutDaySlice)
   const dispatch = useDispatch()
   

  const [open, setOpen] = useState(false);
  const [dayName, setDayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("ID:", id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(createWorkoutDay(id, dayName));
      setDayName("");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating workout day:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="mr-2 h-4 w-4" />
          New Day
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Workout Day</DialogTitle>
            <DialogDescription>Create a new workout day for your plan.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dayName">Day Name</Label>
              <Input
                id="dayName"
                value={dayName}
                onChange={(e) => setDayName(e.target.value)}
                placeholder="e.g., Monday - Chest Day"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
