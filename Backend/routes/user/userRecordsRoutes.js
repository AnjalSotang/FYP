const express = require("express");
const {createUserRecords, updateUserRecords, findAllUserRecords, deleteUserRecord} = require("../../controller/user/userRecordsController.js");
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole.js");
const router = express.Router()

router.post('/PersonalRecords', checkTokenAndRole("user"), createUserRecords);
router.patch('/PersonalRecords', checkTokenAndRole("user"), updateUserRecords);
router.get('/PersonalRecords', checkTokenAndRole("user"), findAllUserRecords);
router.delete('/PersonalRecords/:recordId', checkTokenAndRole("user"), deleteUserRecord);




module.exports = router;


