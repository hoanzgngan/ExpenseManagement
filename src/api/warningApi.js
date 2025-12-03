import axiosClient from './axiosClient';

const warningApi = {
  // GET /warnings?month=M&year=Y
  check: (month, year) => 
    axiosClient.get(`/warnings?month=${month}&year=${year}`),
};

export default warningApi;