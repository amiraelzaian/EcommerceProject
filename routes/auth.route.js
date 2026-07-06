const express = require("express");
const { signup } = require("../controllers/auth.controller");
const { signupValidator } = require("../utils/validators/authValidator");
const router = express.Router();

router.route("/signup").post(signupValidator, signup);

module.exports = router;
