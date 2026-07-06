const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/user.model");

// @desc   Signnup
// @route  GET /api/v1/auth/signup
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  //1-ceate user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //2- generate token JWT
  const token = jwt.sign({ userId: user_id }, process.env.JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE_TIME,
  });

  res.status(201).json({ data: user, token });
});
