const express = require("express");
const userRoutes = require("./userRoutes");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

require("./db");
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(userRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
