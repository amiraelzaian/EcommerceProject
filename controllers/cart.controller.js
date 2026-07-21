const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

//calc total price
const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  return totalPrice;
};
// @desc   Add product to cart
// @route  Post /api/vi/cart
// @access private/user

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  //1- get cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    //create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exists in cart-> update quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color,
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // product is not exists in cart-> push product to cart item
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  //calculate total cart price
  const totalPrice = calcTotalPrice(cart);
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res.status(201).json({
    status: "success",
    message: "Product was addes successfully",
    data: cart,
  });
});
