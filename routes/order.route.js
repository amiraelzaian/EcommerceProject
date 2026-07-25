const express = require("express");
const {
  createCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderStatusToPaid,
  updateOrderStatusToDelivered,
  checkoutSessioin,
} = require("../controllers/order.controller");
const { protect, allowedTo } = require("../controllers/auth.controller.js");

const router = express.Router();

router.use(protect);

router.get(
  "/checkout-session/:cartId",
  protect,
  allowedTo("user"),
  checkoutSessioin,
);

router.route("/:cartId").post(allowedTo("user"), createCashOrder);
router
  .route("/")
  .get(
    allowedTo("user", "admin", "manager"),
    filterOrderForLoggedUser,
    findAllOrders,
  );
router.route("/:id").get(allowedTo("user"), findSpecificOrder);
router
  .route("/:id/pay")
  .patch(allowedTo("manager", "admin"), updateOrderStatusToPaid);
router
  .route("/:id/deliver")
  .patch(allowedTo("manager", "admin"), updateOrderStatusToDelivered);

module.exports = router;
