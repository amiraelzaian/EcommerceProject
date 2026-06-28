const express = require("express");
const { param, validationResult } = require("express-validator");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategory.controller");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

//mergeParmas: allows us to access prameters on other routers
// ex  we need to acess category id from category router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(createSubCategoryValidator, createSubCategory)
  .get(getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .patch(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
