const Review = require("../models/review.model");
const factory = require("./handlersFactory");

// apply nested route
// middlewarte to filter
exports.filterReviewsByProductId = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

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

// for nested route create
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  next();
};
exports.createReview = factory.createOne(Review);
// @desc   Update specific review
// @route  Patch/put /api/v1/reviews/id
// @access Private/user/protect
exports.updateReview = factory.updateOne(Review);
// @desc   Delete specific review
// @route  Delete /api/v1/reviews/id
// @access Private/protect/user,admin,manager
exports.deleteReview = factory.deleteOne(Review);
