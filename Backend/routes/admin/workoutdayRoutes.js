const express = require("express")
const router = express.Router();
const { createWorkoutDay, getWorkoutDayById, updateWorkoutDay, deleteWorkoutDay, addExerciseToWorkoutDay, updateExerciseInWorkoutDay, removeExerciseFromWorkoutDay } = require("../../controller/admin/workoutdayController");
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");

router.post('/createWorkoutDay/:id', checkTokenAndRole('admin'), createWorkoutDay);
router.get('/getWorkoutDayById/:id', getWorkoutDayById)
router.patch('/updateWorkoutDay/:id', checkTokenAndRole('admin'), updateWorkoutDay)
router.delete('/deleteWorkoutDay/:dayId', checkTokenAndRole('admin'), deleteWorkoutDay)
router.post('/addExcerciseToWorkoutDay/:dayId', addExerciseToWorkoutDay)
router.delete('/workoutday/:id/exercise/:excerciseId', removeExerciseFromWorkoutDay);
router.patch('/workoutday/:id/exercise/:excerciseId',updateExerciseInWorkoutDay)

module.exports= router;