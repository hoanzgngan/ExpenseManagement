exports.getAll = async (req, res) => {
  try {
    res.json({ message: "Transaction route is working!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
