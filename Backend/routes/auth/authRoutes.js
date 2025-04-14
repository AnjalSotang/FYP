const express = require("express");
const {register, login, user_forgotPassword, resetPassword, changePassword, updateUserProfile, getUserProfile, deleteAccount, getAdminProfile} = require("../../controller/auth/authController")
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");
const upload = require("../../middleware/upload"); // Import the upload middleware
const settingController = require("../../controller/admin/generalSettingController");
const router = express.Router()

router.post('/register', settingController.checkRegistrationAllowed, register )
router.post('/login', login )
router.post('/forget', user_forgotPassword)
router.post('/reset', resetPassword )

router.patch('/profile', upload.single("image"), checkTokenAndRole('user'), updateUserProfile);
router.get('/profile',checkTokenAndRole("user"), getUserProfile);

router.get('/admin/profile', checkTokenAndRole("admin"), getAdminProfile);

router.patch('/profile/password', changePassword);
router.delete('/profile',checkTokenAndRole("user"), deleteAccount);

module.exports = router;


