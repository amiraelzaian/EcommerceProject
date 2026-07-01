const Product = require("../models/product.model");

const factory = require("./handlersFactory");

// @desc   Get list of  products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(Product);
// @desc   Get specific product by id
// @route  Get /api/v1/products/:id
// @access Public

exports.getProduct = factory.getOne(Product);

// @desc   create product
// @route  POST /api/v1/products
// @access Private
exports.createProduct = factory.createOne(Product);

// @desc   Update specific product
// @route  Patch/put /api/v1/products/id
// @access Private
exports.updateProduct = factory.updateOne(Product);

// @desc   Delete specific product
// @route  Delete /api/v1/products/id
// @access Private

exports.deleteProduct = factory.deleteOne(Product);
