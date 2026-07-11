const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadimageMiddleware");
const User = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { createToken } = require("../utils/createToken");

// middleware
exports.uploadUserImage = uploadSingleImage("profileImage");
// image processing
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);
    //save image in  DB
    req.body.profileImage = filename;
  }

  next();
});

// @desc   Get list of  users
// @route  GET /api/v1/users
// @access private
exports.getUsers = factory.getAll(User);
// @desc   Get specific user by id
// @route  Get /api/v1/users/:id
// @access private

exports.getUser = factory.getOne(User);
// @desc   create user
// @route  POST /api/v1/users
// @access Private
exports.createUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    },
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
// @desc   Update specific user
// @route  Patch/put /api/v1/users/id
// @access Private
exports.updateUser = factory.updateOne(User);
// @desc   Delete specific user
// @route  Delete /api/v1/users/id
// @access Private
exports.deleteUser = factory.deleteOne(User);

// @desc   Get logged user data
// @route  GET /api/v1/users/getMe
// @access Private/Protected

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc   Update logged user password
// @route  Patch /api/v1/users/changeMyPassword
// @access Private/Protected
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // update user password based on user payload
  const document = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  // generate token
  const token = createToken(req.user._id);
  res.status(200).json({ data: req.user, token });
});

// @desc   Update Logged user data except( role, password )
// @route  Patch /api/v1/users/updateMe
// @access Private/Protected
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true },
  );
  if (!updatedUser) {
    return next(new ApiError("Error: could not find user to update", 404));
  }
  res.status(200).json({ status: "success", data: updatedUser });
});

// @desc   Deactivate logged user
// @route  Patch /api/v1/users/deleteMe
// @access Private/Protected

exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "success" });
});
