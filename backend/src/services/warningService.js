const warningRepo = require("../repos/warningRepo");

exports.checkWarnings = async (userId, month, year) => {
  const totalSpent = await warningRepo.getTotalSpent(userId, month, year);
  const totalBudget = await warningRepo.getTotalBudget(userId, month, year);

  const spentByCategory = await warningRepo.getSpentByCategory(
    userId,
    month,
    year
  );
  const budgetByCategory = await warningRepo.getBudgetByCategory(
    userId,
    month,
    year
  );

  const budgetMap = {};
  budgetByCategory.forEach((b) => {
    budgetMap[b.CategoryID] = b.BudgetAmount;
  });

  const categoryWarnings = spentByCategory.map((c) => {
  const spent = Number(c.spent || 0);
  const budget = Number(budgetMap[c.CategoryID] || 0);

  return {
    CategoryID: c.CategoryID,
    CategoryName: c.CategoryName,
    spent,
    budget,
    isOver: budget > 0 && spent > budget
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
}

};
