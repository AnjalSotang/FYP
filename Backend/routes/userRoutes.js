const express = require("express");
const {register, login, user_forgotPassword, resetPassword, userName, userHealth, experience} = require("../controller.js/authController")
const router = express.Router()

router.post('/register', register )
router.post('/login', login )
router.post('/forget', user_forgotPassword)
router.post('/reset', resetPassword )
router.post('/userName', userName)
router.post('/health', userHealth)
router.post('/level', experience)


module.exports = router;


