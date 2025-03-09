const express = require("express");
const {addContact} = require("../controller.js/Contact")
const router = express.Router()

router.post('/addContact', addContact )


module.exports = router;


