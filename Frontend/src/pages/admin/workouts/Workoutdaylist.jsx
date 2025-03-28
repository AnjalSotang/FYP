import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkout, setStatus } from "../../../../store/workoutSlice";
import STATUSES from "../../../globals/status/statuses";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { AddExerciseDialog } from "./components/form/add-exercise-dialog"
import { EditWorkoutDayDialog } from "./components/form/edit-workout-day-dialog"
import { DeleteWorkoutDayDialog } from "./components/form/delete-workout-day-dialog"

export function WorkoutDayList({ workoutPlanId }) {
  const [editingDay, setEditingDay] = useState(null);
  const [deletingDayId, setDeletingDayId] = useState(null);
  const [addingExerciseToDayId, setAddingExerciseToDayId] = useState(null);

  const { status } = useSelector((state) => state.workout);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Only fetch if workoutData is not provided from parent
  useEffect(() => {
    if (workoutPlanId) {
      dispatch(fetchWorkout(workoutPlanId));
    }
  }, [workoutPlanId, dispatch]);

  // Get workoutDays from either passed workoutData or from Redux state
  const { data1: reduxWorkoutDays } = useSelector((state) => state.workout);
  const workoutDays = reduxWorkoutDays;
console.log("WorkoutDays:", workoutDays);

  console.log("WorkoutPlanId:", workoutPlanId);
  console.log("Using workout days:", workoutDays);

  // Handle different states based on status
  if (status === STATUSES.LOADING && !workoutDays) {
    return <div>Loading workout data...</div>;
  }

  if (status === STATUSES.ERROR) {
    return <div>Error loading workout data. Please try again.</div>;
  }

  if (!workoutDays) {
    return <div>No workout data available.</div>;
  }

  // Get the days array from the workoutDays object
  const days = workoutDays.days;
  console.log("Days:", days);

  // Check if days is empty or not
  const hasDays = Array.isArray(days) && days.length > 0;
  console.log(hasDays)
  
  return (
    <>
      <div className="grid gap-4  bg-card border rounded-md p-4">
        {!hasDays ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">No workout days found. Add a day to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" defaultValue={["1"]}>
            {days.map((day) => (
              <AccordionItem key={day.id} value={day.id.toString()}>
                <AccordionTrigger className="px-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg">{day.dayName}</span>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingDay({ id: day.id, dayName: day.dayName })}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingDayId(day.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4">
                    <div className="flex justify-end mb-4">
                      <Button size="sm" onClick={() => setAddingExerciseToDayId(day.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Exercise
                      </Button>
                    </div>
                    <div className="rounded-md border">

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Exercise</TableHead>
                            <TableHead>Sets</TableHead>
                            <TableHead>Reps</TableHead>
                            <TableHead>Rest Time</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!day.excercises || day.excercises.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="h-24 text-center">
                                No exercises found.
                              </TableCell>
                            </TableRow>
                          ) : (
                            day.excercises.map((exercise) => (
                              <TableRow key={exercise.id}>
                                <TableCell>{exercise.name}</TableCell>
                                <TableCell>{exercise.WorkoutDayExercise?.sets || "N/A"}</TableCell>
                                <TableCell>{exercise.WorkoutDayExercise?.reps || "N/A"}</TableCell>
                                <TableCell>{exercise.WorkoutDayExercise?.rest_time || "N/A"}</TableCell>

                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        // Edit exercise functionality would go here
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        // Delete exercise functionality would go here
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {editingDay && (
        <EditWorkoutDayDialog
          day={editingDay}
          open={!!editingDay}
          onOpenChange={(open) => {
            if (!open) setEditingDay(null)
          }}
          onSave={(updatedDay) => {
            // Use dispatch to update the workout day in the Redux store
            // Example: dispatch(updateWorkoutDay(updatedDay));
            setEditingDay(null)
          }}
        />
      )}

      {deletingDayId && (
        <DeleteWorkoutDayDialog
          dayId={deletingDayId}
          open={!!deletingDayId}
          onOpenChange={(open) => {
            if (!open) setDeletingDayId(null)
          }}
          onDelete={(id) => {
            // Use dispatch to delete the workout day in the Redux store
            // Example: dispatch(deleteWorkoutDay(id));
            setDeletingDayId(null)
          }}
        />
      )}

      {addingExerciseToDayId && (
        <AddExerciseDialog
          dayId={addingExerciseToDayId}
          open={!!addingExerciseToDayId}
          onOpenChange={(open) => {
            if (!open) setAddingExerciseToDayId(null)
          }}
          onAdd={(dayId, exercise) => {
            // Use dispatch to add the exercise to the workout day in the Redux store
            // Example: dispatch(addExerciseToWorkoutDay(dayId, exercise));
            setAddingExerciseToDayId(null)
          }}
        />
      )}
    </>
  )
}