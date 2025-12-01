const userRepo = require("../repos/userRepo");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");

//login
exports.login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error("Email không tồn tại");
  }
  const isMatch = await bcrypt.compare(password, user.PasswordHash);
  if (!isMatch) {
    throw new Error("Sai mật khẩu");
  }
  const token = signToken(user);
  return {
    token,
    user: {
      id: user.UserID,
      name: user.Name,
      email: user.Email,
      currency: user.Currency
    }
  };
};

//register
exports.register = async ({ name, email, password }) => {
  const existedUser = await userRepo.findByEmail(email);

  if (existedUser) {
    throw new Error("Email đã tồn tại");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await userRepo.create({
    name,
    email,
    passwordHash,
    currency: "VND"
  });
  return newUser;
};