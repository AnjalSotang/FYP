const express = require('express');
const router = express.Router();
const { createWorkout, addExerciseToWorkout } = require('../controller.js/admin/workoutController');
const upload = require("../helpers/upload"); 


// API Endpoint: Create Workout with Exercises
router.post('/createWorkout', upload.fields([
    { name: "image", maxCount: 1 }
]), createWorkout);
router.post('/addExcerciseToWorkout/:workoutId', addExerciseToWorkout);

module.exports = router;
