const Category = require("../models/category.model");

const factory = require("./handlersFactory");
// @desc   Get list of  categories
// @route  GET /api/vi/categoriesO
// @access Public
exports.getCategories = factory.getAll(Category);
// @desc   Get specific category by id
// @route  Get /api/v1/categories/:id
// @access Public

exports.getCategory = factory.getOne(Category);

// @desc   create category
// @route  POST /api/v1/categories
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
