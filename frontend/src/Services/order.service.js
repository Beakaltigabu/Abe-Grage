import api from '../utils/axios';

export const getOrders = async (params) => {
  try {
    const response = await api.get('/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrder = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return [response.data];
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};


export const updateOrder = async (id, orderData) => {
  try {
    const response = await api.put(`/orders/${id}`, {
      ...orderData,
      order_status: orderData.order_status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};


export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
