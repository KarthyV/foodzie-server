const router = require("express").Router();
const User = require("./userModal");
const authUser = require("./authUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/users", (req, res) => {
  try {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      const userData = {
        email: req.body.email,
        password: hash,
      };
      const user = new User(userData);
      const token = jwt.sign({ _id: user._id }, "mealsSecret", {
        expiresIn: "24h",
      });
      user.token = token;
      user.save();
      console.log(user);
      res.send(user);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, foundUser) => {
      if (err) throw new Error("Invalid Credentials");
      else {
        if (!foundUser) res.json({ message: "User not valid" });
        if (foundUser) {
          bcrypt.compare(password, foundUser.password, (err, result) => {
            if (result === true) {
              const token = jwt.sign({ _id: foundUser._id }, "mealsSecret", {
                expiresIn: "10h",
              });
              foundUser.token = token;
              res.send(foundUser);
            }
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Invalid Credentials" });
  }
});

router.post("/auto-login", authUser, async (req, res) => {
  res.send(req.user);
});

router.post("/add-favorites", authUser, async (req, res) => {
  const { recipeId, recipeName } = req.body;
  const user = req.user;
  if (!user.favorites.length) user.favorites.push({ recipeId, recipeName });
  for (i = 0; i < user.favorites.length; i++) {
    if (user.favorites[i].recipeId === recipeId) {
      break;
    } else {
      user.favorites.push({ recipeId, recipeName });
      console.log(user.favorites);
    }
  }
  await user.save();
  res.status(200).send(user);
});

router.post("/delete-favorites", authUser, async (req, res) => {
  const { recipeId } = req.body;
  const user = req.user;
  console.log(recipeId);
  user.favorites = user.favorites.filter(
    (recipe) => recipe.recipeId !== recipeId
  );
  await user.save();
  res.status(200).send(user);
});

module.exports = router;
