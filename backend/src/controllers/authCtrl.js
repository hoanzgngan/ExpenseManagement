const authService = require("../services/authService");

//login
exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//register
exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.json({
      message: "Đăng ký thành công",
      user
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
