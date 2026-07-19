const mongoose = require("mongoose");
const Product = require("./product.model");
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min rating value is 1.0"],
      max: [5, "Max rating value is 5.0"],
      required: [true, "Review ratings required"],
    },
    // parent reference ( one to one )
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    // parent reference ( one to many )
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true },
);

reviewSchema.pre(/^find/, function () {
  this.populate({ path: "user", select: "name" });
});

reviewSchema.statics.calcAvgRatingsAndQuantity = async function (productId) {
  const statistics = await this.aggregate([
    //stage 1: get all reviews based on spesific product
    { $match: { product: productId } },
    // stage 2: grouping reviews based on product Id
    //           and calc avgRatings, ratingsQuantitiy
    {
      $group: {
        _id: "$product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (statistics.length > 0) {
    await Product.findByIdAndUpdate(
      productId,
      {
        ratingsAverage: statistics[0].avgRatings,
        ratingsQuantity: statistics[0].ratingsQuantity,
      },
      { new: true },
    );
  } else {
    await Product.findByIdAndUpdate(
      productId,
      {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      },
      { new: true },
    );
  }
};
reviewSchema.post("save", async function () {
  await this.constructor.calcAvgRatingsAndQuantity(this.product);
});
reviewSchema.post("remove", async function () {
  await this.constructor.calcAvgRatingsAndQuantity(this.product);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
