const express = require('express');
const router = express.Router();
const { createWorkout, addExerciseToWorkout, getAllWorkout, deleteWorkout, updateWorkout, searchWorkouts, getWorkout } = require('../controller.js/admin/workoutController');
const upload = require("../helpers/upload"); 


// API Endpoint: Create Workout with Exercises
router.post('/createWorkout', upload.single("image"), createWorkout);
router.post('/addExcerciseToWorkout', addExerciseToWorkout);
router.get('/getAllWorkout', getAllWorkout);
router.delete('/deleteWorkout/:id', deleteWorkout);
router.patch('/updateWorkout', upload.single("image"), updateWorkout);
router.get('/getAllWorkouts/search', searchWorkouts)
router.get('/getWorkout/:id', getWorkout)
module.exports = router;
