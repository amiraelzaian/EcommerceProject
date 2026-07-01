const Brand = require("../models/brand.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc   Get list of  brands
// @route  GET /api/vi/brands
// @access Public
exports.getBrands = asyncHandler(async (req, res) => {
  const docsCount = await Brand.countDocuments();
  let apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .paginate(docsCount)
    .filter()
    .search("Brand")
    .limitFields()
    .sort();

  const brands = await apiFeatures.mongooseQuery;
  res.status(200).json({
    results: brands.length,
    page: apiFeatures.paginationResult,
    data: brands,
  });
});
// @desc   Get specific brand by id
// @route  Get /api/vi/brands/:id
// @access Public

exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc   create brand
// @route  POST /api/vi/brands
// @access Private
exports.createBrand =
  // @desc   Update specific brand
  // @route  Patch/put /api/vi/brands/id
  // @access Private
  exports.updateBrand = factory.updateOne(Brand);
// @desc   Delete specific brand
// @route  Delete /api/vi/barands/id
// @access Private
exports.deleteBrand = factory.deleteOne(Brand);
