require("dotenv").config();
const cors = require("cors");
const compression = require("compression");

const path = require("path");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
// routes
const mountRoutes = require("./routes"); // just to this as name of file is index

// connect to databaase
const dbConnection = require("./config/database");
const { webhookCheckout } = require("./controllers/order.controller");
dbConnection();
//express app
const app = express();
// Enable other domains to access your application
app.use(cors());
app.options("*all", cors());
//compress all reponses
app.use(compression());

//checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.set("query parser", "extended");
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mount routes

mountRoutes(app);

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
