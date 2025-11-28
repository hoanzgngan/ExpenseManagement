const db = require("../config/db");

//login
exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE Email = ?",
    [email]
  );
  return rows[0];
};

//register
exports.create = async (user) => {
  const { name, email, passwordHash, currency } = user;

  const [result] = await db.query(
    "INSERT INTO users (Name, Email, PasswordHash, Currency) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, currency || "VND"]
  );

  return {
    UserID: result.insertId,
    Name: name,
    Email: email,
    Currency: currency || "VND"
  };
};
