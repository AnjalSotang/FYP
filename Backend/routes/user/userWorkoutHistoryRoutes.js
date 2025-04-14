const express = require("express");
const {findAll, getActiveWorkouts, findAllHistory} = require("../../controller/user/userWorkoutHistoryController")
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");
const router = express.Router()

router.get('/getUserWorkoutHistories', checkTokenAndRole("user"), findAll);
router.get('/findAllHistory', checkTokenAndRole("user"), findAllHistory);
router.get('/getActiveUserWorkouts', checkTokenAndRole("user"), getActiveWorkouts);




module.exports = router;


