const router = require("express").Router();
const User = require("./userModal");
const authUser = require("./authUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send(" Backend is running");
});

router.post("/users", (req, res) => {
  try {
    // Storing the user data in variable
    const userData = {
      email: req.body.email,
      username: req.body.name,
    };

    // Checking whether user is in database

    User.findOne({ email: userData.email }, (err, foundUser) => {
      // if found sending the details along with token
      if (foundUser) {
        const token = jwt.sign({ _id: foundUser._id }, "mealsSecret", {
          expiresIn: "24h",
        });
        foundUser.token = token;
        foundUser.save();
        return res.send(foundUser);
      } else {
        // If not in database , Creating a new user
        const user = new User(userData);
        const token = jwt.sign({ _id: user._id }, "mealsSecret", {
          expiresIn: "24h",
        });
        user.token = token;
        user.save();
        res.send(user);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// With the help of valid token getting the user auto logged In with custom middleware
router.post("/auto-login", authUser, async (req, res) => {
  res.send(req.user);
});

// Adding favorites

router.post("/add-favorites", authUser, async (req, res) => {
  try {
    // Getting the Recipe ID and Name from the frontend
    const { recipeId, recipeName } = req.body;

    // Assigning the current user to user variable
    const user = req.user;

    // If Favorites is empty adding the first recipe to list
    if (!user.favorites || user.favorites.length < 1) {
      user.favorites.push({ recipeId, recipeName });
      await user.save();
      return res.status(200).send(user);
    } else {
      // If Favorites is not empty, adding favorites by checking if the recipe has already been added
      const favCheck = user.favorites.some(
        (recipe) => recipe.recipeId === recipeId
      );
      if (!favCheck) {
        user.favorites.push({ recipeId, recipeName });
      }
      // Saving the user again to the database along with favorites
      await user.save();
      res.status(200).send(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Removing favorites from the database
router.post("/delete-favorites", authUser, async (req, res) => {
  try {
    // Getting the recipe ID for checking if it exists in favorites
    const { recipeId } = req.body;
    const user = req.user;
    // console.log(recipeId);
    user.favorites = user.favorites.filter(
      (recipe) => recipe.recipeId !== recipeId
    );
    // After filtering saving again the user and sending back the updated user to client
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

// Using bcrypt

// router.post("/users", (req, res) => {
//   // Creating a new USer

//   try {
//     // Encrypting the password using bcrypt
//     bcrypt.hash(req.body.password, 10, function (err, hash) {
//       // Storing the user data in variable
//       const userData = {
//         email: req.body.email,
//         password: hash,
//       };
//       const user = new User(userData); // Creating a user with the stored variable
//       // Creating a new token based on the user id
//       const token = jwt.sign({ _id: user._id }, "mealsSecret", {
//         expiresIn: "24h",
//       });
//       // Storing the token along with the user data
//       user.token = token;
//       // Saving it to the database
//       user.save();
//       // console.log(user);
//       // Sending the user data back to the client
//       res.send(user);
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send();
//   }
// });

// Logging In existing user

// router.post("/login", (req, res) => {
//   try {
//     const { email, password } = req.body; // Getting the user data

//     // Finding the user based from database
//     User.findOne({ email: email }, (err, foundUser) => {
//       if (err) throw new Error("Invalid Credentials");
//       else {
//         if (!foundUser) res.json({ message: "User not valid" });
//         // If User found comparing the password using bcrypt
//         if (foundUser) {
//           bcrypt.compare(password, foundUser.password, (err, result) => {
//             if (result === true) {
//               // Once the user data matches database, creating a new token for the user
//               const token = jwt.sign({ _id: foundUser._id }, "mealsSecret", {
//                 expiresIn: "10h",
//               });
//               // Saving the token to the database
//               delete foundUser.password;
//               foundUser.token = token;
//               // sending the user data to the client
//               res.send(foundUser);
//             }
//           });
//         }
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Invalid Credentials" });
//   }
// });
