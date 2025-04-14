const express = require("express");
const router = express.Router();
const {getSimplifiedActivities}= require("../../controller/admin/adminActitvityController");
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");

// Get all notifications for a user
router.get("/admin/activities",checkTokenAndRole('admin'), getSimplifiedActivities);


module.exports = router;