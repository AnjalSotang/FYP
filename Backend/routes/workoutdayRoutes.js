const express = require("express")
const router = express.Router();
const { createWorkoutDay, getWorkoutDayById, updateWorkoutDay, deleteWorkoutDay, addExerciseToWorkoutDay, updateExerciseInWorkoutDay, removeExerciseFromWorkoutDay } = require("../controller.js/admin/workoutDayController");

// router.post('/addExercise', upload.array('equipment', 4), upload.single("image"), upload.single("video"), addExcercise);
router.post('/createWorkoutDay/:id', createWorkoutDay);
router.get('/getWorkoutDayById/:id', getWorkoutDayById)
router.patch('/updateWorkoutDay/:id', updateWorkoutDay)
router.delete('/deleteWorkoutDay/:id', deleteWorkoutDay)
router.post('/addExcerciseToWorkoutDay/:id', addExerciseToWorkoutDay)
router.delete('/removeExcerciseFromWorkoutDay/:id/:excerciseId', removeExerciseFromWorkoutDay)
router.patch('/updateExcerciseInWorkoutDay/:id/:excerciseId',updateExerciseInWorkoutDay)

module.exports= router;