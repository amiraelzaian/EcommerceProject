require("dotenv").config();
const morgan = require("morgan");

const express = require("express");

const app = express();
if (process.env.NODE_ENV === "development") {
  morgan("dev");
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.get("/", (req, res) => {
  res.send("TEST");
});

console.log(process.env);
app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`);
});
