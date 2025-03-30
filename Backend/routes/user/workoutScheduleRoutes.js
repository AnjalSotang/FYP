const express = require("express");
const {getScheduledWorkouts, getWorkoutsForDate, getUpcomingWorkouts, getAllWorkoutPlans, scheduleWorkout, deleteScheduledWorkout} = require("../../controller.js/user/workoutScheduleController");
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");
const router = express.Router()

router.get('/workout-schedules/getAllWorkoutPlans', getAllWorkoutPlans);
router.get('/workout-schedules/getScheduleWorkouts', checkTokenAndRole("user"), getScheduledWorkouts);
router.get('/workout-schedules/date/:formattedDate', checkTokenAndRole("user"), getWorkoutsForDate);
router.get('/workout-schedules/upcoming', checkTokenAndRole("user"), getUpcomingWorkouts);
router.post('/workout-schedules', checkTokenAndRole("user"), scheduleWorkout);
router.delete('/workout-schedules/:id', checkTokenAndRole("user"), deleteScheduledWorkout);



module.exports = router;


