const db = require("../config/db");

// Lấy tất cả category theo user
exports.getAllByUser = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM categories WHERE UserID = ?",
    [userId]
  );
  return rows;
};

// tạo category 
exports.create = async ({ name, type, icon, userId }) => {
  const [result] = await db.query(
    "INSERT INTO categories (Name, Type, Icon, UserID, IsDefault) VALUES (?, ?, ?, ?, 0)",
    [name, type, icon, userId]
  );

  return {
    CategoryID: result.insertId,
    Name: name,
    Type: type,
    Icon: icon,
    UserID: userId
  };
};

// Xóa category (Kèm xóa giao dịch và ngân sách liên quan)
exports.delete = async (id) => {
  // Xóa giao dịch con trước
  await db.query("DELETE FROM transactions WHERE CategoryID = ?", [id]);
  // Xóa ngân sách con
  await db.query("DELETE FROM budgets WHERE CategoryID = ?", [id]);
  // Xóa danh mục cha
  await db.query("DELETE FROM categories WHERE CategoryID = ?", [id]);
};

// Tổng chi theo tháng 
exports.getTotalSpent = async (userId, month, year) => {
  const [rows] = await db.query(
    `SELECT SUM(Amount) AS total 
     FROM transactions 
     WHERE UserID = ? 
     AND MONTH(TransactionDate) = ? 
     AND YEAR(TransactionDate) = ?`,
    [userId, month, year]
  );
  return rows[0].total || 0;
};

// Tổng ngân sách
exports.getTotalBudget = async (userId, month, year) => {
  const [rows] = await db.query(
    `SELECT SUM(BudgetAmount) AS totalz
     FROM budgets 
     WHERE UserID = ? 
     AND CategoryID IS NOT NULL 
     AND Month = ? 
     AND Year = ?`,
    [userId, month, year]
  );
  return rows[0]?.total || 0;
};

// Tổng chi theo từng category 
exports.getSpentByCategory = async (userId, month, year) => {
  const [rows] = await db.query(
    `SELECT 
        c.CategoryID,
        c.Name AS CategoryName,
        SUM(t.Amount) AS spent
     FROM transactions t
     JOIN categories c ON t.CategoryID = c.CategoryID
     WHERE t.UserID = ?
     AND MONTH(t.TransactionDate) = ?
     AND YEAR(t.TransactionDate) = ?
     GROUP BY c.CategoryID, c.Name`,
    [userId, month, year]
  );
  return rows;
};

exports.getBudgetByCategory = async (userId, month, year) => {
  const [rows] = await db.query(
    `SELECT 
        b.CategoryID,
        b.BudgetAmount,
        c.Name AS CategoryName 
     FROM budgets b
     JOIN categories c ON b.CategoryID = c.CategoryID
     WHERE b.UserID = ?
     AND b.Month = ?
     AND b.Year = ?
     AND b.CategoryID IS NOT NULL`,
    [userId, month, year]
  );
  return rows;
};