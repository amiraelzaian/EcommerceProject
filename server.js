require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const categoryRoute = require("./routes/category.route");
const subCategoryRoute = require("./routes/subCategory.route");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
// connect to databaase
const dbConnection = require("./config/database");
dbConnection();
//express app
const app = express();
//middlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  morgan("dev");
}

//mount routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);

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
