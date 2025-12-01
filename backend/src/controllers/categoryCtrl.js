const categoryService = require("../services/categoryService");

exports.getAll = async (req, res) => {
  try {
    console.log("req.user trong categoryCtrl.getAll:", req.user);

    const userId = req.user.id;
    const data = await categoryService.getAll(userId);
    res.json(data);
  } catch (err) {
    console.error("Lỗi trong categoryCtrl.getAll:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    console.log("req.user trong categoryCtrl.create:", req.user);

    const userId = req.user.id;
    const data = await categoryService.create({
      ...req.body,
      userId
    });
    res.json(data);
  } catch (err) {
    console.error("Lỗi trong categoryCtrl.create:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const userId = req.user.id; // nếu cần check owner
    await categoryService.delete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("Lỗi trong categoryCtrl.delete:", err);
    res.status(400).json({ message: err.message });
  }
};


//DONE