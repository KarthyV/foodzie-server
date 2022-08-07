const dotenv = require("dotenv");
dotenv.config(); // .env configuration

const express = require("express");
const userRoutes = require("./userRoutes");
const cors = require("cors");
const app = express(); // Initiating express
const mongoose = require("mongoose");

const url = process.env.MONGO_URL;
mongoose
  .connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,OPTIONS,PATCH,DELETE,POST,PUT"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(cors()); // Applying cors middleware for cross platform configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Changing the receiving data format from JSON to objects

app.use("/", userRoutes); //Route config

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
