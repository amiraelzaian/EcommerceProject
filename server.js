require("dotenv").config();
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
// routes
const categoryRoute = require("./routes/category.route");
const subCategoryRoute = require("./routes/subCategory.route");
const brandRoute = require("./routes/brand.route");
const productRoute = require("./routes/product.route");
const userRoute = require("./routes/user.route");
// connect to databaase
const dbConnection = require("./config/database");
dbConnection();
//express app
const app = express();

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.set("query parser", "extended");
if (process.env.NODE_ENV === "development") {
  morgan("dev");
}

//mount routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);

app.get("/", (req, res) => {
  res.send("TEST");
});

app.all("*splat/", (req, res, next) => {
  next(new ApiError(`can't find this route : ${req.originalUrl}`, 400));
});
// global error handling middleware
app.use(globalError);
const server = app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`);
});

//handle rejection outside express
// "unhandledRejection" => is event
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down");
    process.exit(1);
  });
});
