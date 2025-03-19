import React from "react"

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

// In a real app, you would fetch this data from your API
const availableExercises = [
  { id: "1", name: "Bench Press" },
  { id: "2", name: "Squat" },
  { id: "3", name: "Deadlift" },
  { id: "4", name: "Pull-up" },
  { id: "5", name: "Push-up" },
  { id: "6", name: "Lunge" },
  { id: "7", name: "Shoulder Press" },
  { id: "8", name: "Bicep Curl" },
]

export function AddExerciseDialog({ dayId, open, onOpenChange, onAdd }) {
  const [exerciseId, setExerciseId] = useState("")
  const [sets, setSets] = useState("3")
  const [reps, setReps] = useState("10")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would call your API here
      // await fetch(`/api/workout-days/${dayId}/exercises`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ exerciseId, sets: parseInt(sets), reps: parseInt(reps) }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const selectedExercise = availableExercises.find((ex) => ex.id === exerciseId)
      if (selectedExercise) {
        onAdd(dayId, {
          id: selectedExercise.id,
          name: selectedExercise.name,
          sets: Number.parseInt(sets),
          reps: Number.parseInt(reps),
        })
      }
    } catch (error) {
      console.error("Error adding exercise to workout day:", error)
    } finally {
      setIsSubmitting(false)
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
              <Select value={exerciseId} onValueChange={setExerciseId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent>
                  {availableExercises.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !exerciseId}>
              {isSubmitting ? "Adding..." : "Add Exercise"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

