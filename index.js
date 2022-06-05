const express = require("express");
const userRoutes = require("./userRoutes");
const cors = require("cors");
const app = express();

require("./db");
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(userRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
