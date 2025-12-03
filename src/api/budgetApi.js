import axiosClient from './axiosClient';

const budgetApi = {
  // GET /budgets?month=M&year=Y
  getByMonth: (month, year) => 
    axiosClient.get(`/budgets?month=${month}&year=${year}`),

  // POST /budgets (sử dụng upsert)
  upsert: (data) => axiosClient.post('/budgets', data),
  
  // DELETE /budgets/:id
  delete: (id) => axiosClient.delete(`/budgets/${id}`),
};

export default budgetApi;