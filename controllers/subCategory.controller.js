const SubCategory = require("../models/subCategory.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// middleware to set category Id to body
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// middlewarte to filter
exports.filtersubCategoriesByCategoryId = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc   Get list of  subcategories
// @route  GET /api/vi/subcategories
// @access Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const docsCount = await SubCategory.countDocuments();
  let apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .paginate(docsCount)
    .filter()
    .search("SubCategory")
    .limitFields()
    .sort();

  const subCategories = await apiFeatures.mongooseQuery;

  //  .populate({ path: "category", select: "name" });
  res.status(200).json({
    results: subCategories.length,
    page: apiFeatures.paginationResult,
    data: subCategories,
  });
});
// @desc   Get specific subcategory by id
// @route  Get /api/vi/subcategories/:id
// @access Public

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});
// @desc   create subcategory
// @route  POST /api/vi/subcategories
// @access Private
exports.createSubCategory = factory.createOne(SubCategory);
// @desc   Update specific subcategory
// @route  Patch/put /api/vi/subcategories/id
// @access Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc   Delete specific subcategory
// @route  Delete /api/vi/subcategories/id
// @access Private

exports.deleteSubCategory = factory.deleteOne(SubCategory);
