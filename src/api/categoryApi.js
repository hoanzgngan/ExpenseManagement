import axiosClient from './axiosClient';

const categoryApi = {
  getAll: () => axiosClient.get('/categories'),
  create: (data) => axiosClient.post('/categories', data),
  delete: (id) => axiosClient.delete(`/categories/${id}`),
};

export default categoryApi;