const express = require("express");
const { validationResult } = require("express-validator");
const {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require("../controllers/brand.controller");
const {
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  getBrandValidator,
} = require("../utils/validators/brandValidator");
const router = express.Router();

router
  .route("/")
  .post(uploadBrandImage, resizeBrandImage, createBrandValidator, createBrand)
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .patch(uploadBrandImage, resizeBrandImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
