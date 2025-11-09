import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";

import { fetchExcercises } from "../../../../../../store/excerciseSlice"
import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addExcerciseToWorkoutDay, updateExcerciseInWorkoutDay } from "../../../../../../store/workoutDaySlice";

export function ExerciseDialog({ 
  dayId, 
  exerciseToEdit = null,  // Pass existing exercise when editing
  open, 
  onOpenChange, 
  onAdd,
  onUpdate 
}) {
  const { data: availableExcercises, status } = useSelector((state) => state.excercise);
  const dispatch = useDispatch();

  // Set initial state based on whether we're editing or adding
  const [excerciseId, setExcerciseId] = useState(exerciseToEdit?.id || "")
  const [sets, setSets] = useState(exerciseToEdit?.WorkoutDayExercise?.sets?.toString() || "3")
  const [reps, setReps] = useState(exerciseToEdit?.WorkoutDayExercise?.reps?.toString() || "10")
  const [rest_time, setRest_time] = useState(exerciseToEdit?.WorkoutDayExercise?.rest_time?.toString() || "10")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isEditMode = !!exerciseToEdit;

  // Reset form when dialog opens/closes or when exerciseToEdit changes
  useEffect(() => {
    if (exerciseToEdit) {
      setExcerciseId(exerciseToEdit.id || "")
      setSets(exerciseToEdit.WorkoutDayExercise?.sets?.toString() || "3")
      setReps(exerciseToEdit.WorkoutDayExercise?.reps?.toString() || "10")
      setRest_time(exerciseToEdit.WorkoutDayExercise?.rest_time?.toString() || "10")
    } else {
      setExcerciseId("")
      setSets("3")
      setReps("10")
      setRest_time("10")
    }
  }, [exerciseToEdit, open])

  // Fetch exercises on mount
  useEffect(() => {
    dispatch(fetchExcercises());
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // If we're editing, use the update action
      if (isEditMode) {
        // Prepare data for updating
        const updateData = {
          dayId,
          excerciseId: exerciseToEdit.id, // Using the ID from the exercise being edited
          sets: parseInt(sets),
          reps: parseInt(reps),
          rest_time: parseInt(rest_time)
        }
        
        // Dispatch update action
        await dispatch(updateExcerciseInWorkoutDay(updateData))
        
        // Call the onUpdate callback to update UI immediately if provided
        if (onUpdate) {
          onUpdate(dayId, {
            id: exerciseToEdit.id,
            name: exerciseToEdit.name,
            WorkoutDayExercise: {
              sets: parseInt(sets),
              reps: parseInt(reps),
              rest_time: parseInt(rest_time),
            }
          })
        }
      } else {
        // Prepare data for adding
        const addData = {
          dayId,
          excerciseId,
          sets: parseInt(sets),
          reps: parseInt(reps),
          rest_time: parseInt(rest_time)
        }
        
        // Dispatch add action
        await dispatch(addExcerciseToWorkoutDay(addData))
        
        // Get the selected exercise for the local state update
        const selectedExercise = availableExcercises.find((ex) => ex.id === excerciseId)
        
        if (selectedExercise && onAdd) {
          // Call the onAdd callback to update UI immediately
          onAdd(dayId, {
            id: selectedExercise.id,
            name: selectedExercise.name,
            WorkoutDayExercise: {
              sets: parseInt(sets),
              reps: parseInt(reps),
              rest_time: parseInt(rest_time),
            }
          })
        }
      }
      
      // Close the dialog
      onOpenChange(false)
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} exercise:`, error)
    } finally {
      setIsSubmitting(false)
      window.location.reload(); // Note: Consider using a more targeted approach than full page reload
    }
  }

    // // 🔥 Handle Status Updates
    // useEffect(() => {
    //   if (status?.status === STATUSES.SUCCESS) {
    //     // navigate("/admin/Workout");
    //     toast.success(status.message);
    //     dispatch(setStatus(null));
    //   //   setIsSubmitting(false);
    //   } else if (status?.status === STATUSES.ERROR) {
    //     toast.error(status.message);
    //     dispatch(setStatus(null));
    //   //   setIsSubmitting(false);
    //   }
    // }, [status, dispatch, navigate]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Exercise' : 'Add Exercise'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update the exercise details.' : 'Add an exercise to this workout day.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="exercise">Exercise</Label>
              <Select 
                value={excerciseId} 
                onValueChange={setExcerciseId} 
                required
                disabled={isEditMode} // Disable changing the exercise when editing
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent>
                  {availableExcercises && availableExcercises.length > 0 ? (
                    availableExcercises.map((excercise) => (
                      <SelectItem key={excercise.id} value={excercise.id}>
                        {excercise.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No exercises available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  min="1"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rest_time">Rest Time (sec)</Label>
                <Input
                  id="rest_time"
                  type="number"
                  min="0"
                  value={rest_time}
                  onChange={(e) => setRest_time(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !excerciseId}>
              {isSubmitting ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Exercise" : "Add Exercise")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}