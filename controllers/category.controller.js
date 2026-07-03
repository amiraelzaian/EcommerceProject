const Category = require("../models/category.model");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const factory = require("./handlersFactory");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadimageMiddleware");
// 1) disk storage engine
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/categories");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

// 2) memory storage engine ( in middleware uploadimagemiddleware)

// middleware
exports.uploadCategoryImage = uploadSingleImage("image");
// image processing
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);
  //save image in  DB
  req.body.image = filename;

  next();
});

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
