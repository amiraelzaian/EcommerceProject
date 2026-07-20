const express = require("express");
const {
  addProductToWishlist,
  removeProductToWishlist,
  getLoggedUserWishlist,
} = require("../controllers/wishlist.controller");
const { protect, allowedTo } = require("../controllers/auth.controller");
const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete("/:productId", removeProductToWishlist);

module.exports = router;
