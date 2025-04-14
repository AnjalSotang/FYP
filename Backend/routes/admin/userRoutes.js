const express = require("express");
const {getAllUsers, updateUser, deleteUser, getUserMetrics, getUserGrowthData, getUsersSevenDays} = require("../../controller/admin/userController")
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");
const router = express.Router()

router.get('/admin/Users', checkTokenAndRole('admin'), getAllUsers);
router.patch('/admin/Users/:id', checkTokenAndRole('admin'), updateUser);
router.delete('/admin/Users/:id', checkTokenAndRole('admin'), deleteUser);
router.get('/admin/users/metrics', checkTokenAndRole('admin'), getUserMetrics);
router.get('/admin/users/growth', checkTokenAndRole('admin'), getUserGrowthData);
router.get('/admin/users/sevenDays', checkTokenAndRole('admin'), getUsersSevenDays);
// router.patch('/profile/password',checkTokenAndRole("user"), changePassword);
// router.delete('/profile',checkTokenAndRole("user"), deleteAccount);

module.exports = router;


