require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const categoryRoute = require("./routes/category.route");

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
app.use("/api/vi/categories", categoryRoute);

app.get("/", (req, res) => {
  res.send("TEST");
});

app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`);
});
