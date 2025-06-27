const express = require("express");
const router = express.Router();
const authcontrollers  = require('../controllers/auth-controllers')

router.route("/").get(authcontrollers.home)

router.route("/register").post(authcontrollers.register)

router.route("/login").post(authcontrollers.login)


module.exports = router;


