const express = require("express");
const { param, validationResult } = require("express-validator");
const { createSubCategory } = require("../controllers/subCategory.controller");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const {
  createSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const router = express.Router();

router.route("/").post(createSubCategoryValidator, createSubCategory);

module.exports = router;
