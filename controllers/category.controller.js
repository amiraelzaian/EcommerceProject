const Category = require("../models/category.model");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

// disk storage engine
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/categories");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images are allowed", 400));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
// middleware
exports.uploadCategoryImage = upload.single("image");

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
