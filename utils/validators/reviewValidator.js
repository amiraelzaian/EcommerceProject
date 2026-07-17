const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/review.model");

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings value  is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1.0 - 5.0"),
  check("user").isMongoId().withMessage("Invalid Review id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      //check if logged user create review before
      return Review.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          return Promise.reject(new Error("You already have reviewed"));
        }
      });
    }),

  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review id format"),
  validatorMiddleware,
];
exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")

    .custom((val, { req }) =>
      //check review owner
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("There is no review avaliable"));
        }
        if (review.user.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action"),
          );
        }
      }),
    ),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      //check review owner
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("There is no review avaliable"));
          }
          if (review.user.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to perform this action"),
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
