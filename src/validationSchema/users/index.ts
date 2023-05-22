import * as yup from 'yup';
import { notificationsValidationSchema } from 'validationSchema/notifications';
import { ordersValidationSchema } from 'validationSchema/orders';
import { reservationsValidationSchema } from 'validationSchema/reservations';
import { restaurantsValidationSchema } from 'validationSchema/restaurants';
import { staffValidationSchema } from 'validationSchema/staff';

export const usersValidationSchema = yup.object().shape({
  role: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
  notifications: yup.array().of(notificationsValidationSchema),
  orders: yup.array().of(ordersValidationSchema),
  reservations: yup.array().of(reservationsValidationSchema),
  restaurants: yup.array().of(restaurantsValidationSchema),
  staff: yup.array().of(staffValidationSchema),
});
