import api from './api';

export const approveUser = async (userId: number) => {
  const response = await api.post(`/admin/approve/${userId}`);
  return response.data;
};

export const getPendingRegistrations = async () => {
  const response = await api.get('/admin/pending-registrations');
  return response.data;
};

export const addFood = async (foodData: {
  name: string;
  description: string;
  price: number;
  quantity: number;
  available_date: number;
  registration_closing?: number;
}) => {
  const response = await api.post('/admin/food', foodData);
  return response.data;
};

export const getAllFood = async () => {
  const response = await api.get('/admin/food');
  return response.data;
};

export const getAvailableFood = async () => {
  const response = await api.get('/admin/available-food');
  return response.data;
};
