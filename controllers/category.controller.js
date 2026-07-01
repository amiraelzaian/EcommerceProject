const Category = require("../models/category.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
// @desc   Get list of  categories
// @route  GET /api/vi/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
  const docsCount = await Category.countDocuments();
  let apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(docsCount)
    .filter()
    .search("Category")
    .limitFields()
    .sort();

  const categories = await apiFeatures.mongooseQuery;

  res.status(200).json({
    results: categories.length,
    page: apiFeatures.pageinationResult,
    data: categories,
  });
});
// @desc   Get specific category by id
// @route  Get /api/vi/categories/:id
// @access Public

exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc   create category
// @route  POST /api/vi/categories
// @access Private
exports.createCategory = factory.createOne(Category);

// @desc   Update specific category
// @route  Patch/put /api/vi/categories/id
// @access Private
exports.updateCategory = factory.updateOne(Category);

// @desc   Delete specific category
// @route  Delete /api/vi/categories/id
// @access Private
exports.deleteCategory = factory.deleteOne(Category);
