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

//@desc user permessions

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1- access roles
    //2- access registered user
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("This job is out of your permissions", 403));
    }
    next();
  });
