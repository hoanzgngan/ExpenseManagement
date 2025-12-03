import axiosClient from './axiosClient';

export const api = {
  // Auth
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/auth/register', data),

  // Categories
  getCategories: () => axiosClient.get('/categories'),
  createCategory: (data) => axiosClient.post('/categories', data),
  deleteCategory: (id) => axiosClient.delete(`/categories/${id}`),

  // Transactions
  getTransactions: () => axiosClient.get('/transactions'),
  createTransaction: (data) => axiosClient.post('/transactions', data),
  deleteTransaction: (id) => axiosClient.delete(`/transactions/${id}`),
  update: (id, data) => axiosClient.put(`/transactions/${id}`, data),

  // Budgets
  getBudgets: (month, year) => axiosClient.get('/budgets', { params: { month, year } }),
  upsertBudget: (data) => axiosClient.post('/budgets', data),
  deleteBudget: (id) => axiosClient.delete(`/budgets/${id}`),

  // Warnings / Dashboard stats
  getWarnings: (month, year) => axiosClient.get('/warnings', { params: { month, year } }),
};