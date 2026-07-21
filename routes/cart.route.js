const express = require("express");
const { addProductToCart } = require("../controllers/cart.controller");

const { protect, allowedTo } = require("../controllers/auth.controller");
const router = express.Router();

router.route("/").post(protect, allowedTo("user"), addProductToCart);

module.exports = router;
