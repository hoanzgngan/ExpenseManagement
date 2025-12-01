const warningService = require("../services/warningService");

exports.check = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const data = await warningService.checkWarnings(userId, month, year);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
