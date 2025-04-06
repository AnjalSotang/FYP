const express = require("express");
const {findAll, getActiveWorkouts} = require("../../controller.js/user/userWorkoutHistoryController")
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");
const router = express.Router()

router.get('/getUserWorkoutHistories', checkTokenAndRole("user"), findAll);
router.get('/getActiveUserWorkouts', checkTokenAndRole("user"), getActiveWorkouts);




module.exports = router;


