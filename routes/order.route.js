const express = require("express");
const { createCashOrder } = require("../controllers/order.controller");
const { protect, allowedTo } = require("../controllers/auth.controller.js");

const router = express.Router();

router.use(protect, allowedTo("user"));
router.route("/:cartId").post(createCashOrder);

module.exports = router;
