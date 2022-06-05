const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  token: {
    type: String,
  },
  favorites: {
    type: [{ recipeId: { type: String, unique: true }, recipeName: String }],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
