const express = require('express');
const router = express.Router();
const { createWorkout, getAllWorkout, deleteWorkout, updateWorkout, searchWorkouts, getWorkout, getWorkoutMetrics, getPopularWorkoutPlans } = require('../controller.js/admin/workoutController');
const upload = require("../helpers/upload"); 


// API Endpoint: Create Workout with Exercises
router.post('/createWorkout', upload.single("image"), createWorkout);
// router.post('/addExcerciseToWorkout', addExerciseToWorkout);
router.get('/getAllWorkout', getAllWorkout);
router.delete('/deleteWorkout/:id', deleteWorkout);
router.patch('/updateWorkout', upload.single("image"), updateWorkout);
router.get('/getAllWorkouts/search', searchWorkouts)
router.get('/getWorkout/:id', getWorkout)
router.get('/admin/workout/metrics', getWorkoutMetrics);
router.get('/admin/workout/popular', getPopularWorkoutPlans);


module.exports = router;
