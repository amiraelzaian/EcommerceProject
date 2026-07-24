const Order = require("../models/order.model");
const Cart = require("../models/cart.mode l");
const Product = require("../models/product.model");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

//@desc     Create cash order
//@route    Post /api/v1/orders/cartId
//@acces    Private/protected/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //app setting
  let taxPrice = 0;
  let shippingPrice = 0;
  //1- get cart based on cart id
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("There is not cart with this i :(", 404));
  }
  //2- get order price based on cart price ,check if coupon applyed
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPice = cartPrice + taxPrice + shippingPrice;

  //3- create order with default payment method (cash)
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  //4- after create order, - prduct quantity, + product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    // make use access many operations or send many requests in one time and one block it is faster than send each one alone
    await Product.bulkWrite(bulkOption, {});
    //5- clear cart based on cartId
    await Cart.findByIdAndDelete(cart._id);
  }
  res.status(201).json({ status: "success", data: order });
});
