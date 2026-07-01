const Brand = require("../models/brand.model");

const factory = require("./handlersFactory");

// @desc   Get list of  brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(Brand);
// @desc   Get specific brand by id
// @route  Get /api/v1/brands/:id
// @access Public

exports.getBrand = factory.getOne(Brand);
// @desc   create brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand = factory.createOne(Brand);
// @desc   Update specific brand
// @route  Patch/put /api/v1/brands/id
// @access Private
exports.updateBrand = factory.updateOne(Brand);
// @desc   Delete specific brand
// @route  Delete /api/v1/barands/id
// @access Private
exports.deleteBrand = factory.deleteOne(Brand);
