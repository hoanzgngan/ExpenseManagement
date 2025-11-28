const jwt = require("jsonwebtoken");

exports.signToken = (user) => {
  return jwt.sign(
    {
      id: user.UserID,
      email: user.Email
    },
    process.env.JWT_SECRET || "secret_key",
    { expiresIn: "7d" }
  );
};
