const userRepo = require("../repos/userRepo");
const categoryRepo = require("../repos/categoryRepo"); 
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");

exports.login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Email không tồn tại");
  
  const isMatch = await bcrypt.compare(password, user.PasswordHash);
  if (!isMatch) throw new Error("Sai mật khẩu");
  
  return { token: signToken(user), user: { id: user.UserID, name: user.Name, email: user.Email, currency: user.Currency } };
};

exports.register = async ({ name, email, password }) => {
  const existedUser = await userRepo.findByEmail(email);
  if (existedUser) throw new Error("Email đã tồn tại");

  const passwordHash = await bcrypt.hash(password, 10);
  
  const newUser = await userRepo.create({ name, email, passwordHash, currency: "VND" });

  const defaultCategories = [
    { name: "Ăn uống" },
    { name: "Di chuyển" },
    { name: "Mua sắm" },
    { name: "Giải trí" },
    { name: "Hóa đơn" },
    { name: "Khác" }
  ];

  for (const cat of defaultCategories) {
    try {
        await categoryRepo.create({
            name: cat.name,
            type: 'expense',
            icon: '', 
            userId: newUser.UserID
        });
    } catch (err) {
        console.error("Lỗi tạo danh mục:", err.message);
    }
  }

  return newUser;
};