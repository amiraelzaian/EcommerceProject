const Product = require("../models/product.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
// @desc   Get list of  products
// @route  GET /api/vi/products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  //1-filteration
  const queryStringObj = { ...req.query };
  const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
  excludesFields.forEach((field) => delete queryStringObj[field]);
  //2-pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;
  const skip = (page - 1) * limit;

  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filter = JSON.parse(queryStr);

  // build query
  let mongooseQuery = Product.find(filter)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" });

  //3-sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("createdAt");
  }
  //4-limit fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }
  //5-search
  if (req.query.keyword) {
    mongooseQuery = mongooseQuery.and([
      {
        $or: [
          { title: { $regex: req.query.keyword, $options: "i" } },
          { description: { $regex: req.query.keyword, $options: "i" } },
        ],
      },
    ]);
  }

  // excute query
  const products = await mongooseQuery;

  res.status(200).json({ results: products.length, page, data: products });
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
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

// @desc   Update specific product
// @route  Patch/put /api/vi/products/id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc   Delete specific product
// @route  Delete /api/vi/products/id
// @access Private

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(204).send();
});
