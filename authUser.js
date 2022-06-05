const jwt = require("jsonwebtoken");

const User = require("./userModal");

const authUser = async (req, res, next) => {
  try {
    const userToken = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(userToken, "mealsSecret");
    console.log(decodedToken);
    const user = await User.findOne({ _id: decodedToken._id });
    if (!user) return res.status(404).json("Please authenticate");
    else {
      req.user = user;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

module.exports = authUser;
