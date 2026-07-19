const express = require("express");
const {
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
  createProductValidator,
} = require("../utils/validators/productValidator");
const {
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  createProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../controllers/product.controller");
const { protect, allowedTo } = require("../controllers/auth.controller");
const reviewsRoute = require("./review.route");

const router = express.Router();

// nested
//POST    /products/tjqioto4626272/reviews
//GET     /products/tjqioto4626272/reviews
//GET     /products/tjqioto4626272/reviews/6727697hjkjgjhb
router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct,
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .patch(
    protect,
    allowedTo("admin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);
module.exports = router;
