const sharp = require("sharp");
const Review = require("../models/review.model");
const { v4: uuidv4 } = require("uuid");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");

// @desc   Get list of  Reviews
// @route  GET /api/v1/reviews
// @access Public
exports.getReviews = factory.getAll(Review);
// @desc   Get specific review by id
// @route  Get /api/v1/reviews/:id
// @access Public
exports.getReview = factory.getOne(Review);
// @desc   create review
// @route  POST /api/v1/reviews
// @access Private/protect/user
exports.createReview = factory.createOne(Review);
// @desc   Update specific review
// @route  Patch/put /api/v1/reviews/id
// @access Private/user/protect
exports.updateReview = factory.updateOne(Review);
// @desc   Delete specific review
// @route  Delete /api/v1/reviews/id
// @access Private/protect/user,admin,manager
exports.deleteReview = factory.deleteOne(Review);
