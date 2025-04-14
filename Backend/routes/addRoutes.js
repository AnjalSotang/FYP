const express = require("express");
const {addContact} = require("../controller/Contact")
const router = express.Router()

router.post('/addContact', addContact )


module.exports = router;


