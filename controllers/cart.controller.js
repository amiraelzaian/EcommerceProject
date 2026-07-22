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

// @desc   Get zlogges userscart
// @route  GET /api/vi/cart
// @access private/user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("There is no cart ", 404));
  }
  res
    .status(200)
    .json({ status: "success", result: cart.cartItems.length, data: cart });
});

// @desc   Remove cart item
// @route  DEL /api/vi/cart/itemId
// @access private/user

exports.deleteCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        cartItems: { _id: req.params.itemId },
      },
    },
    { new: true },
  );
  console.log(cart);
  //calculate total cart price
  const totalPrice = calcTotalPrice(cart);
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res.status(201).json({
    status: "success",
    message: "Product was addes successfully",
    result: cart.cartItems.length,
    data: cart,
  });
});

// @desc   Clear cart
// @route  DEL /api/vi/cart/
// @access private/user

exports.clearCart = asyncHandler(async (req, res, next) => {
  const result = await Cart.findOneAndDelete({ user: req.user._id });
  if (!result) {
    return next(new ApiError("cart is not found", 404));
  }
  res.status(204).send();
});
