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
import { cloneDeep } from "lodash";
import { addExcerciseToWorkoutDay } from "../../../../../../store/workoutDaySlice";


export function AddExerciseDialog({ dayId, open, onOpenChange, onAdd }) {
  const { data: availableExcercises, status } = useSelector((state) => state.excercise);
  const dispatch = useDispatch();

  const [excerciseId, setExcerciseId] = useState("")
  const [sets, setSets] = useState("3")
  const [reps, setReps] = useState("10")
  const [rest_time, setRest_time] = useState("10")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch exercises on mount
  useEffect(() => {
    dispatch(fetchExcercises());
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare the data to send to the API
      const exerciseData = {
        dayId,
        excerciseId,
        sets: parseInt(sets),
        reps: parseInt(reps),
        rest_time: parseInt(rest_time)
      }
      
      // Dispatch the Redux action
      await dispatch(addExcerciseToWorkoutDay(exerciseData))

      // Get the selected exercise for the local state update
      const selectedExercise = availableExcercises.find((ex) => ex.id === excerciseId)
      
      if (selectedExercise) {
        // Call the onAdd callback to update UI immediately
        onAdd(dayId, {
          id: selectedExercise.id,
          name: selectedExercise.name,
          sets: parseInt(sets),
          reps: parseInt(reps),
          rest_time: parseInt(rest_time),
        })
      }
      
      // Close the dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding exercise to workout day:", error)
    } finally {
      setIsSubmitting(false)
      window.location.reload();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Exercise</DialogTitle>
            <DialogDescription>Add an exercise to this workout day.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="exercise">Exercise</Label>
              <Select value={excerciseId} onValueChange={setExcerciseId} required>
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
                <Label htmlFor="rest_time">Rest Time</Label>
                <Input
                  id="rest_time"
                  type="number"
                  min="1"
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
              {isSubmitting ? "Adding..." : "Add Exercise"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}