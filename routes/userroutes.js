const usercontroller = require("../controllers/usercontroller")

const express = require('express');

const router = express.Router();

router.post("/signup", usercontroller.signup)
// router.delete("/delete/:id",usercontroller.deleteuser)

router.post("/login", usercontroller.login)

module.exports = router;