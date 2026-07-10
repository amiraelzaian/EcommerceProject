const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");
const { createToken } = require("../utils/createToken");
const jwt = require("jsonwebtoken");
// @desc   Signnup
// @route  post /api/v1/auth/signup
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
// @desc   login
// @route  post /api/v1/auth/login
// @access Public
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

// @desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  //1- check if token exists, if yes hold it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("You are not logged in, please log in ", 401));
  }
  //2- verify token  ->no change happen, not expires
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //3- check if user exist
  const currentUser = await User.findById(decoded.payload);
  if (!currentUser) {
    return next(
      new ApiError("The user that belong to this token doesn't exist", 401),
    );
  }

  //4- check if user change his password after token generated
  if (currentUser?.passwordChanged) {
    const passChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    // pass changed after token created
    if (passChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "user has changed account credintial recently, login again",
          401,
        ),
      );
    }
  }
  req.user = currentUser;
  next();
});

//@desc user permessions (user autherization)
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1- access roles
    //2- access registered user
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("This job is out of your permissions", 403));
    }
    next();
  });

// @desc   forgot password
// @route  post /api/v1/auth/forgotPassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1- get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404),
    );
  }
  //2- if user exist, generate hashed reset randome 6 digits, save it n DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  //save hashed password reset code in DB
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  //3- send the reset code via email
  const message = `
  Hi ${user.name} \nWe received a request to reset the password on your E-shop Account.\n ${resetCode}\n Enter the code to compelete the reset\nthanks for helping us keep your account secure.\n The E-shop Team
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password resetcode (valid for 10 minutes)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError(`There is and error in sending email`, 500));
  }
  res
    .status(200)
    .json({ status: "sucess", message: "Reset code sent to eamil" });
});

// @desc   Verify reset code
// @route  post /api/v1/auth/verifyResetcode
// @access Public

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  //1- Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 404));
  }
  //2- valid reset code
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ staus: "sucess" });
});

// @desc   Reset password
// @route  post /api/v1/auth/resetPassword
// @access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1- get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with this email", 404));
  }
  // 2- check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Rest code is not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();
  //3- if everything is ok, generate token
  const token = createToken(user._id);

  res.status(200).json({ status: "success", token });
});
