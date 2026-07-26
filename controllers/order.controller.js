const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

//@desc     Create cash order
//@route    POST /api/v1/orders/cartId
//@acces    Private/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //app setting
  let taxPrice = 0;
  let shippingPrice = 0;
  //1- get cart based on cart id
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("There is no cart with this id :(", 404));
  }
  //2- get order price based on cart price ,check if coupon applyed
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

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
    await Product.bulkWrite(bulkOption);
    //5- clear cart based on cartId
    await Cart.findByIdAndDelete(cart._id);
  }
  res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
//@desc     Get all orders
//@route    GET /api/v1/user-admin-ocartId
//@acces    Private/admin/manager
exports.findAllOrders = factory.getAll(Order);
//@desc     Get all orders
//@route    GET /api/v1/orders/orderId
//@acces    Private/user-admin-ocartId
exports.findSpecificOrder = factory.getOne(Order);

//@desc     Update order status
//@route    PATCH /api/v1/orders/orderId
//@acces    Private/admin/manager
exports.updateOrderStatusToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order is not found", 404));
  }
  //update order
  order.isPaid = true;
  order.paidAt = Date.now();

  const updateOrder = await order.save();

  res.status(200).json({ status: "success", data: updateOrder });
});
//@desc     Update order delivery
//@route    PATCH /api/v1/orders/orderId
//@acces    Private/admin/manager
exports.updateOrderStatusToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order is not found", 404));
  }
  //update order
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updateOrder = await order.save();

  res.status(200).json({ status: "success", data: updateOrder });
});

//@desc     get checkout session from stripe and send it as response
//@route    GET /api/v1/orders/checkout-session/cartId
//@acces    Private/user
exports.checkoutSessioin = asyncHandler(async (req, res, next) => {
  // get cart to get total price
  //app setting
  let taxPrice = 0;
  let shippingPrice = 0;
  //1- get cart based on cart id
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("There is no cart with this id :(", 404));
  }
  //2- get order price based on cart price ,check if coupon applyed
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  //3- create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: `Order for ${req.user.name}`,
          },
          unit_amount: Math.round(totalOrderPrice * 100), // Stripe expects the smallest currency unit
        },
        quantity: 1,
      },
    ],
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: {
      shippingAddress: JSON.stringify(req.body.shippingAddress),
    },
  });
  //4-send session to response
  res.status(200).json({ status: "success", session });
});

// checkout payment(online)

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);

  const user = await User.findOne({ email: session.customer_email });

  // create order with default payment method (card)
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethod: "card",
  });

  //after create order, - prduct quantity, + product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    // make use access many operations or send many requests in one time and one block it is faster than send each one alone
    await Product.bulkWrite(bulkOption);
    //5- clear cart based on cartId
    await Cart.findByIdAndDelete(cart._id);
  }
  res.status(201).json({ status: "success", data: order });
};

exports.webhookCheckout = asyncHandler(async (req, res, net) => {
  let event;
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(` Webhook signature verification failed.`, err.message);
      return res
        .status(400)
        .send(` Webhook signature verification failed.`, err.message);
    }
  }
  if (event.type === "checkout.session.completed") {
    // create order
    createCardOrder(event.data.object);
  }
  res.status(200).json({ recieved: true });
});
