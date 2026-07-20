const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js");

// desc   Add address to user addresses list
// route  POST/api/v1/addresses
// access Private/user

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        addresses: req.body,
      },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: `Address was added to user's addresses successfullly `,
    data: user.addresses,
  });
});
// desc   remove address from users addresses list
// route  DELETE/api/v1/addresses/addressId
// access Private/user

exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        addresses: { id: req.params.addressId },
      },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: `Address was removed from user's addresses successfullly `,
    data: user.addresses,
  });
});

// desc   get logged user's addresses
// route  GET/api/v1/addresses
// access Private/user
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res
    .status(200)
    .json({
      status: "success",
      results: user.addresses.length,
      data: user.addresses,
    });
});
