const express = require("express");
const {createUserWorkout, getUserWorkouts, deleteUserWorkout} = require("../../controller.js/user/userWorkoutController")
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");
const router = express.Router()


router.post('/addWorkoutToActive/:WorkoutId', checkTokenAndRole("user"), createUserWorkout);
router.get('/getUserWorkouts', checkTokenAndRole("user"), getUserWorkouts);
router.delete('/deleteUserWorkout/:WorkoutId', checkTokenAndRole("user"), deleteUserWorkout);


module.exports = router;


