const jwt = require("jsonwebtoken");

const User = require("./userModal");

const authUser = async (req, res, next) => {
  try {
    // Checking the token if its available from the header
    const userToken = req.header("Authorization").replace("Bearer ", "");
    // Verifying whether the token is valid
    const decodedToken = jwt.verify(userToken, "mealsSecret");

    // Finding the user from database based on the valid token
    const user = await User.findOne({ _id: decodedToken._id });

    // If not valid
    if (!user) return res.status(404).json("Please authenticate");
    else {
      // Sending the user back to the client
      req.user = user;
      // Passing onto the next function
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

module.exports = authUser;
