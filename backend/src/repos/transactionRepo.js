const db = require("../config/db");

// Lấy toàn bộ transaction theo user
exports.getAllByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT t.*, c.Name AS CategoryName 
     FROM transactions t
     JOIN categories c ON t.CategoryID = c.CategoryID
     WHERE t.UserID = ?
     ORDER BY t.TransactionDate DESC`,
    [userId]
  );
  return rows;
};

// Thêm transaction
exports.create = async ({ userId, categoryId, amount, date, note }) => {
  const [result] = await db.query(
    `INSERT INTO transactions
    (UserID, CategoryID, Amount, TransactionDate, Note, IsActive)
    VALUES (?, ?, ?, ?, ?, 1)`,
    [userId, categoryId, amount, date, note]
  );

  return {
    TransactionID: result.insertId,
    UserID: userId,
    CategoryID: categoryId,
    Amount: amount,
    TransactionDate: date,
    Note: note
  };
};

// Xóa transaction
exports.delete = async (id) => {
  await db.query("DELETE FROM transactions WHERE TransactionID = ?", [id]);
};
