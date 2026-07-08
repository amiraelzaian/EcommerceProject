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
const { protect } = require("../controllers/auth.controller");
const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
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
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(protect, deleteProductValidator, deleteProduct);
module.exports = router;
