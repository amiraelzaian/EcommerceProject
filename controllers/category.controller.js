const CategoryModel = require("../models/category.model");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

// @desc   Get list of  categories
// @route  GET /api/vi/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, data: categories });
});
// @desc   Get specific category by id
// @route  Get /api/vi/categories/:id
// @access Public

exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return res.status(404).json({ msg: `No category for this id ${id}` });
  }
  res.status(200).json({ data: category });
});

// @desc   create category
// @route  POST /api/vi/categories
// @access Private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
