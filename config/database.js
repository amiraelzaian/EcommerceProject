const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(
        `Database connected successfully on: ${conn.connection.host}`,
      );
    })
    .catch((err) => {
      console.error(`Database error: ${err}`);
      process.exit();
    });
};
module.exports = dbConnection;
