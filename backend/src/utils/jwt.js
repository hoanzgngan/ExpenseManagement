const jwt = require("jsonwebtoken");

const JWT_SECRET = "MY_SUPER_SECRET"; 

exports.signToken = (user) => {
  return jwt.sign(
    {
      id: user.UserID,
      email: user.Email
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
