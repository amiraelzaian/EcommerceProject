const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadimageMiddleware");
const User = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

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
