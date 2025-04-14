const express = require("express");
const {createUserMeasuremetRecords, updateUserMeasurementRecord, getAllUserMeasurementRecords, deleteUserMeasurementRecord} = require("../../controller/user/userMeasurementsController.js");
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole.js");
const router = express.Router()

router.post('/Measurements', checkTokenAndRole("user"), createUserMeasuremetRecords);
router.patch('/Measurements/:id', checkTokenAndRole("user"), updateUserMeasurementRecord);
router.get('/Measurements', checkTokenAndRole("user"), getAllUserMeasurementRecords);
router.delete('/Measurements/:id', checkTokenAndRole("user"), deleteUserMeasurementRecord);

module.exports = router;


