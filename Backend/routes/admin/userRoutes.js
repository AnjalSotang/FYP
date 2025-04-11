const express = require("express");
const {getAllUsers, updateUser, deleteUser, getUserMetrics, getUserGrowthData, getUsersSevenDays} = require("../../controller.js/admin/userController")
// const { checkTokenAndRole } = require("../middleware/checkTokenAndRole");
const router = express.Router()

router.get('/admin/Users', getAllUsers);
router.patch('/admin/Users/:id', updateUser);
router.delete('/admin/Users/:id', deleteUser);
router.get('/admin/users/metrics', getUserMetrics);
router.get('/admin/users/growth', getUserGrowthData);
router.get('/admin/users/sevenDays', getUsersSevenDays);
// router.patch('/profile/password',checkTokenAndRole("user"), changePassword);
// router.delete('/profile',checkTokenAndRole("user"), deleteAccount);

module.exports = router;


