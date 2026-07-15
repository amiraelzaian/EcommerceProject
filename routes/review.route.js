const express = require("express");
const { validationResult } = require("express-validator");
const {
  createReview,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const { protect, allowedTo } = require("../controllers/auth.controller");
const router = express.Router();

router.route("/").post(protect, allowedTo("user"), createReview).get(getBrands);
router
  .route("/:id")
  .get(getBrand)
  .patch(protect, allowedTo("user"), updateReview)
  .delete(protect, allowedTo("admin", "manager", "user"), deleteReview);

module.exports = router;
