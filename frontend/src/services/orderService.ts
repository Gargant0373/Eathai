import api from './api';

export const placeOrder = async (foodId: number, quantity: number) => {
  const response = await api.post('/orders/order', { food_id: foodId, quantity });
  return response.data;
};

export const cancelOrder = async (orderId: number) => {
  const response = await api.delete(`/orders/order/${orderId}`);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get('/orders/user');
  return response.data;
};

export const getAllOrders = async (page: number = 1, perPage: number = 5) => {
  const response = await api.get('/orders/all', {
    params: {
      page,
      per_page: perPage,
    },
  });
  return response.data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await api.patch(`/orders/order/${orderId}`, { status });
  return response.data;
};
