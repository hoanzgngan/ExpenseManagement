import axiosClient from './axiosClient';

const transactionApi = {
  getAll: () => axiosClient.get('/transactions'),
  create: (data) => axiosClient.post('/transactions', data),
  delete: (id) => axiosClient.delete(`/transactions/${id}`),
};

export default transactionApi;