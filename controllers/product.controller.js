const Product = require("../models/product.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc   Get list of  products
// @route  GET /api/vi/products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  const docsCount = await Product.countDocuments();
  let apiFeatures = new ApiFeatures(Product.find(), req.query)
    .paginate(docsCount)
    .filter()
    .search("Product")
    .limitFields()
    .sort();

  const products = await apiFeatures.mongooseQuery;

  // apiFeatures = apiFeatures.paginate(products.length);
  res.status(200).json({
    results: products.length,
    page: apiFeatures.paginationResult,
    data: products,
  });
});
// @desc   Get specific product by id
// @route  Get /api/vi/products/:id
// @access Public

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc   create product
// @route  POST /api/vi/products
// @access Private
exports.createProduct = factory.createOne(Product);

// @desc   Update specific product
// @route  Patch/put /api/vi/products/id
// @access Private
exports.updateProduct = factory.updateOne(Product);

// @desc   Delete specific product
// @route  Delete /api/vi/products/id
// @access Private

exports.deleteProduct = factory.deleteOne(Product);
