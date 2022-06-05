const mongoose = require("mongoose");

const url = process.env.MONGO_URL;
mongoose
  .connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));
