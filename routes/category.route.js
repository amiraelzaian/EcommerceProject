const express = require("express");
const { param, validationResult } = require("express-validator");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const subCategoriesRoute = require("./subCategory.route");
const router = express.Router();

router.use("/:categoryId/subcategories", subCategoriesRoute);
router
  .route("/")
  .post(createCategoryValidator, createCategory)
  .get(getCategories);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .patch(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
