const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  username: {
    type: String,
  },
  token: {
    type: String,
  },
  favorites: [
    {
      recipeId: String,
      recipeName: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
