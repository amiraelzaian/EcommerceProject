const express = require("express");
const { param, validationResult } = require("express-validator");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,

  resizeCategoryImage,
} = require("../controllers/category.controller");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const subCategoriesRoute = require("./subCategory.route");
const { protect, allowedTo } = require("../controllers/auth.controller");

const router = express.Router();
//nested route
router.use("/:categoryId/subcategories", subCategoriesRoute);
router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory,
  )
  .get(getCategories);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .patch(
    protect,
    allowedTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

module.exports = router;
