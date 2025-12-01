const budgetService = require("../services/budgetService");

// Lấy ngân sách theo tháng
exports.getByMonth = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const data = await budgetService.getByMonth(userId, month, year);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Thêm hoặc cập nhật ngân sách
exports.upsert = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await budgetService.upsert({
      ...req.body,
      userId
    });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//xoa budgets
exports.delete = async (req, res) => {
  try {
    await budgetService.delete(req.params.id);
    res.json({ message: "Xóa budget thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
