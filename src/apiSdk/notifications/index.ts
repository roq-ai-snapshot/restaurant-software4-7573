import axios from 'axios';
import { NotificationsInterface } from 'interfaces/notifications';

export const getNotifications = async () => {
  const response = await axios.get(`/api/notifications`);
  return response.data;
};

export const createNotifications = async (notifications: NotificationsInterface) => {
  const response = await axios.post('/api/notifications', notifications);
  return response.data;
};

export const updateNotificationsById = async (id: string, notifications: NotificationsInterface) => {
  const response = await axios.put(`/api/notifications/${id}`, notifications);
  return response.data;
};

export const getNotificationsById = async (id: string) => {
  const response = await axios.get(`/api/notifications/${id}`);
  return response.data;
};
