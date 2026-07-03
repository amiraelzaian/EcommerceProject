const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadimageMiddleware");
const Brand = require("../models/brand.model");
const { v4: uuidv4 } = require("uuid");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");

// middleware
exports.uploadBrandImage = uploadSingleImage("image");
// image processing
exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);
  //save image in  DB
  req.body.image = filename;

  next();
});

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
