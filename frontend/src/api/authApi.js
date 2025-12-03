import axiosClient from './axiosClient'

// LOGIN
export const loginApi = (data) => {
  return axiosClient.post('/auth/login', data)
}

// REGISTER
export const registerApi = (data) => {
  return axiosClient.post('/auth/register', data)
}
