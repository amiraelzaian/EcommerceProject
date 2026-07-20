const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model.js");

// desc   Add product to wishlist
// route  POST/api/v1/wishlist
// access Private/user

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        wishlist: req.body.productId,
      },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: `product was added to wishlist successfullly `,
    data: user.wishlist,
  });
});
// desc   remove product to wishlist
// route  DELETE/api/v1/wishlist/productId
// access Private/user

exports.removeProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        wishlist: req.params.productId,
      },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: `product was removed to wishlist successfullly `,
    data: user.wishlist,
  });
});

// desc   get logged user wishlist
// route  GET/api/v1/wishlist
// access Private/user
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({ status: "success", data: user.wishlist });
});
