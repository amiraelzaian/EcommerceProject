const express = require("express");
const { validationResult } = require("express-validator");
const {
  createReview,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
  filterReviewsByProductId,
  setProductIdAndUserIdToBody,
} = require("../controllers/review.controller");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
} = require("../utils/validators/reviewValidator");

const { protect, allowedTo } = require("../controllers/auth.controller");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  )
  .get(filterReviewsByProductId, getReviews);
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .patch(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("admin", "manager", "user"),
    deleteReviewValidator,
    deleteReview,
  );

module.exports = router;
