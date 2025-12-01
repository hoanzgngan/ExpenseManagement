const { verifyToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Thiếu token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token); 

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (err) {
    console.log("Lỗi verify token:", err.message);
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};
