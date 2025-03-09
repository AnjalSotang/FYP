const express = require('express');
const router = express.Router();
const { createWorkout } = require('../controllers/workoutController');

// API Endpoint: Create Workout with Exercises
router.post('/create', createWorkout);

module.exports = router;
