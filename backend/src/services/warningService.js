const warningRepo = require("../repos/warningRepo");

exports.checkWarnings = async (userId, month, year) => {
  const totalSpent = await warningRepo.getTotalSpent(userId, month, year);
  const totalBudget = await warningRepo.getTotalBudget(userId, month, year);

  const spentByCategory = await warningRepo.getSpentByCategory(userId, month, year);
  const budgetByCategory = await warningRepo.getBudgetByCategory(userId, month, year);

  const statsMap = {};

  // Đưa tất cả danh mục CÓ NGÂN SÁCH vào danh sách trước
  budgetByCategory.forEach((b) => {
    statsMap[b.CategoryID] = {
      CategoryID: b.CategoryID,
      CategoryName: b.CategoryName,
      budget: Number(b.BudgetAmount),
      spent: 0 // Mặc định chưa chi
    };
  });

  //  Cập nhật thông tin ĐÃ CHI TIÊU vào danh sách
  spentByCategory.forEach((s) => {
    if (!statsMap[s.CategoryID]) {
      statsMap[s.CategoryID] = {
        CategoryID: s.CategoryID,
        CategoryName: s.CategoryName,
        budget: 0,
        spent: 0
      };
    }
    statsMap[s.CategoryID].spent = Number(s.spent);
  });

  // Chuyển Map thành Array và tính toán cảnh báo
  const categoryWarnings = Object.values(statsMap).map((item) => {
    return {
      ...item,
      isOver: item.budget > 0 && item.spent > item.budget
    };
  });

  const totalSpentNum = Number(totalSpent || 0);
  const totalBudgetNum = Number(totalBudget || 0);

  return {
    total: {
      totalSpent: totalSpentNum,
      totalBudget: totalBudgetNum,
      isOver: totalBudgetNum > 0 && totalSpentNum > totalBudgetNum
    },
    byCategory: categoryWarnings
  };
};