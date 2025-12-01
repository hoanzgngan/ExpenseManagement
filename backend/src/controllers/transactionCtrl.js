const transactionService = require("../services/transactionService");

exports.getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await transactionService.getAll(userId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//tao
exports.create = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await transactionService.create({
      ...req.body,
      userId
    });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//xoa
exports.delete = async (req, res) => {
  try {
    await transactionService.delete(req.params.id);
    res.json({ message: "Xóa transaction thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


//done