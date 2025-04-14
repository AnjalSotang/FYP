const express = require('express');
const router = express.Router();
const { createWorkout, getAllWorkout, deleteWorkout, updateWorkout, searchWorkouts, getWorkout, getWorkoutMetrics, getPopularWorkoutPlans } = require('../../controller/admin/workoutController');
const upload = require("../../middleware/upload"); 
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");


// API Endpoint: Create Workout with Exercises
router.post('/admin/workout', checkTokenAndRole('admin'), upload.single("image"), createWorkout);
// router.post('/addExcerciseToWorkout', addExerciseToWorkout);
router.get('/getAllWorkout', getAllWorkout);

router.delete('/admin/workout/:id',checkTokenAndRole('admin'), deleteWorkout);
router.patch('/admin/workout',checkTokenAndRole('admin'), upload.single("image"), updateWorkout);
router.get('/getAllWorkouts/search', searchWorkouts)
router.get('/getWorkout/:id', getWorkout)
router.get('/admin/workout/metrics', checkTokenAndRole('admin'), getWorkoutMetrics);
router.get('/admin/workout/popular', checkTokenAndRole('admin'), getPopularWorkoutPlans);


module.exports = router;
