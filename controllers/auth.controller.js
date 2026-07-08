const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");

const createToken = (payload) => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  return token;
};

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
  if (!user) {
    return next(new ApiError("could not signup", 401));
  }
  //2- generate token JWT
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  //1- check if password and email in the body (validation)
  //2- check if user exists and check if password is correct

  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  //3- generate token
  const token = createToken(user._id);
  //4- send response to cleint side
  res.status(200).json({ data: user, token });
});
