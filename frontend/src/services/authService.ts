import api from './api';

export const registerUser = async (email: string, password: string) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getUnverifiedUsers = async () => {
  const response = await api.get('/auth/users/unverified');
  return response.data.unverified_users;
};

export const verifyUser = async (userId: number) => {
  const response = await api.patch(`/auth/users/${userId}/verify`);
  return response.data;
};

export const makeUserAdmin = async (userId: number) => {
  const response = await api.patch(`/auth/users/${userId}/make-admin`);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/auth/users/${userId}`);
  return response.data;
};

export const getAllUsers = async (page: number = 1) => {
  const response = await api.get(`/auth/users`, { params: { page } });
  return response.data;
};

export const getUser = async (userId: number) => {
  const response = await api.get(`/auth/user/${userId}`);
  return response.data;
}