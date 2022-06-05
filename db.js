const mongoose = require("mongoose");

const url =
  "mongodb+srv://admin-karthi:wZycfwFWr6GHyi0U@cluster0.zvnlg.mongodb.net/foodzie?retryWrites=true&w=majority";

mongoose
  .connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));
