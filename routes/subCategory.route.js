const express = require("express");
const { param, validationResult } = require("express-validator");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  filtersubCategoriesByCategoryId,
} = require("../controllers/subCategory.controller");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const { protect } = require("../controllers/auth.controller");

//mergeParams: allows us to access prameters on other routers
// ex  we need to acess category id from subcategory router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(filtersubCategoriesByCategoryId, getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .patch(protect, updateSubCategoryValidator, updateSubCategory)
  .delete(protect, deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
