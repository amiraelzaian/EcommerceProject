const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  deleteCartItem,
  clearCart,
} = require("../controllers/cart.controller");

const { protect, allowedTo } = require("../controllers/auth.controller");
const router = express.Router();

router.use(protect, allowedTo("user"));
router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);
router.route("/:itemId").delete(deleteCartItem);

module.exports = router;
