const express = require("express");
const {register, login, user_forgotPassword, resetPassword, changePassword, updateUserProfile, getUserProfile, deleteAccount} = require("../controller.js/authController")
const { checkTokenAndRole } = require("../middleware/checkTokenAndRole");
const upload = require("../helpers/upload"); // Import the upload middleware
const router = express.Router()

router.post('/register', register )
router.post('/login', login )
router.post('/forget', user_forgotPassword)
router.post('/reset', resetPassword )

router.patch('/profile', upload.single("image"), checkTokenAndRole("user"), updateUserProfile);
router.get('/profile',checkTokenAndRole("user"), getUserProfile);
router.patch('/profile/password',checkTokenAndRole("user"), changePassword);
router.delete('/profile',checkTokenAndRole("user"), deleteAccount);

module.exports = router;


