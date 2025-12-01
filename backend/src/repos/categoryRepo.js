//data cate
const db = require("../config/db");

// Lấy tất cả category theo user
exports.getAllByUser = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM categories WHERE UserID = ?",
    [userId]
  );
  return rows;
};

// Tạo category
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

// Xóa category
exports.delete = async (id) => {
  await db.query("DELETE FROM categories WHERE CategoryID = ?", [id]);
};


//DONE