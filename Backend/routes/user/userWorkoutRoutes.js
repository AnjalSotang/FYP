const express = require("express");
const {createUserWorkout, deleteUserWorkout, getActiveWorkouts, getCompletedWorkouts, addWorkoutPlan, completeWorkoutDay, getUserWorkout, restartWorkout} = require("../../controller/user/userWorkoutController")
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");
const router = express.Router()


router.post('/addWorkoutToActive/:WorkoutId', checkTokenAndRole("user"), createUserWorkout);
router.post('/addWorkoutPlanToActive', checkTokenAndRole("user"), addWorkoutPlan);
router.get('/getUserWorkout/:id', checkTokenAndRole("user"), getUserWorkout);
router.get('/getActiveWorkouts', checkTokenAndRole("user"), getActiveWorkouts);
router.delete('/deleteUserWorkout/:id', checkTokenAndRole("user"), deleteUserWorkout);
router.get('/getCompletedWorkouts', checkTokenAndRole("user"), getCompletedWorkouts);
router.post('/completeWorkoutDay/:id', checkTokenAndRole("user"), completeWorkoutDay);
// router.get('/getCompletedWorkout/:id', checkTokenAndRole("user"), restartWorkout);
router.patch('/restartWorkout/:id', checkTokenAndRole("user"), restartWorkout);



module.exports = router;


