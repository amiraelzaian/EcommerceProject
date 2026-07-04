const Product = require("../models/product.model");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const ApiError = require("../utils/apiError");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const multerStorage = multer.memoryStorage();
const { uploadMixOfImages } = require("../middlewares/uploadimageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);
// middleware to resisze
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //image processing gor image cover
  if (req.files && req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    //save image in  DB
    req.body.imageCover = imageCoverFileName;
  }
  //image processing gor images
  if (req.files && req.files.images) {
    req.body.images = [];
    Promise.all(
      req.files.images.map((img, i) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${i + 1}.jpeg`;
        sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        //save image in  DB
        req.body.images.push(imageName);
      }),
    );
  }
  next();
});
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
