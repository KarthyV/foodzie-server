const express = require("express");
const userRoutes = require("./userRoutes");
const cors = require("cors");
const app = express(); // Initiating express
const dotenv = require("dotenv");

dotenv.config(); // .env configuration

require("./db");

app.use(cors()); // Applying cors middleware for cross platform configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Changing the receiving data format from JSON to objects

app.use("/", userRoutes); //Route config

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
