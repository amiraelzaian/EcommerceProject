const express = require("express");
const { validationResult } = require("express-validator");
const {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand.controller");
const {
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  getBrandValidator,
} = require("../utils/validators/brandValidator");
const router = express.Router();

router.route("/").post(createBrandValidator, createBrand).get(getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .patch(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
