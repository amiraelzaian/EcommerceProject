const express = require("express");
const { validationResult } = require("express-validator");
const {
  getCoupon,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
  createCoupon,
} = require("../controllers/coupon.controller");

const { protect, allowedTo } = require("../controllers/auth.controller");
const router = express.Router();

router.use(protect, allowedTo("admin", "manager"));

router.route("/").post(createCoupon).get(getAllCoupons);
router.route("/:id").get(getCoupon).patch(updateCoupon).delete(deleteCoupon);

module.exports = router;
