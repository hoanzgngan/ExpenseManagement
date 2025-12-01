const db = require("../config/db");

// Lấy ngân sách theo tháng
exports.getByMonth = async (userId, month, year) => {
  const [rows] = await db.query(
    `SELECT b.*, c.Name AS CategoryName 
     FROM budgets b
     LEFT JOIN categories c ON b.CategoryID = c.CategoryID
     WHERE b.UserID = ? AND b.Month = ? AND b.Year = ?`,
    [userId, month, year]
  );
  return rows;
};

// Thêm / cập nhật ngân sách
exports.upsert = async ({ userId, categoryId, amount, month, year }) => {
  const [exist] = await db.query(
    `SELECT * FROM budgets 
     WHERE UserID = ? AND Month = ? AND Year = ? 
     AND ${categoryId ? "CategoryID = ?" : "CategoryID IS NULL"}`,
    categoryId
      ? [userId, month, year, categoryId]
      : [userId, month, year]
  );

  if (exist.length > 0) {
    await db.query(
      `UPDATE budgets SET BudgetAmount = ? WHERE BudgetID = ?`,
      [amount, exist[0].BudgetID]
    );
    return { ...exist[0], BudgetAmount: amount };
  }

  const [result] = await db.query(
    `INSERT INTO budgets (UserID, CategoryID, BudgetAmount, Month, Year)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, categoryId || null, amount, month, year]
  );

  return {
    BudgetID: result.insertId,
    UserID: userId,
    CategoryID: categoryId || null,
    BudgetAmount: amount,
    Month: month,
    Year: year
  };
};

// Xóa ngân sách
exports.delete = async (id) => {
  await db.query("DELETE FROM budgets WHERE BudgetID = ?", [id]);
};
