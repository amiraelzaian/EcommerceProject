const SubCategory = require("../models/subCategory.model");

const factory = require("./handlersFactory");

// middleware to set category Id to body
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// apply nested route
// middlewarte to filter
exports.filtersubCategoriesByCategoryId = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc   Get list of  subcategories
// @route  GET /api/v1/subcategories
// @access Public
exports.getSubCategories = factory.getAll(SubCategory);
// @desc   Get specific subcategory by id
// @route  Get /api/v1/subcategories/:id
// @access Public

exports.getSubCategory = factory.getOne(SubCategory);
// @desc   create subcategory
// @route  POST /api/v1/subcategories
// @access Private
exports.createSubCategory = factory.createOne(SubCategory);
// @desc   Update specific subcategory
// @route  Patch/put /api/v1/subcategories/id
// @access Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc   Delete specific subcategory
// @route  Delete /api/v1/subcategories/id
// @access Private

exports.deleteSubCategory = factory.deleteOne(SubCategory);
