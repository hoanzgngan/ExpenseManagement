const budgetRepo = require("../repos/budgetRepo");

exports.getByMonth = async (userId, month, year) => {
  return await budgetRepo.getByMonth(userId, month, year);
};

exports.upsert = async ({ userId, categoryId, amount, month, year }) => {
  if (!amount || !month || !year) {
    throw new Error("Thiếu dữ liệu budget");
  }

  return await budgetRepo.upsert({
    userId,
    categoryId,
    amount,
    month,
    year
  });
};

exports.delete = async (id) => {
  return await budgetRepo.delete(id);
};
