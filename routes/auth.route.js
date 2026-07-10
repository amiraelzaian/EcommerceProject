const express = require("express");
const {
  signup,
  login,
  protect,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/auth.controller");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");
const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyResetcode").post(verifyResetCode);
router.route("/resetPassword").patch(resetPassword);

module.exports = router;
