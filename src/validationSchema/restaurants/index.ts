import * as yup from 'yup';
import { menu_itemsValidationSchema } from 'validationSchema/menu_items';
import { ordersValidationSchema } from 'validationSchema/orders';
import { reservationsValidationSchema } from 'validationSchema/reservations';
import { staffValidationSchema } from 'validationSchema/staff';

export const restaurantsValidationSchema = yup.object().shape({
  name: yup.string().required(),
  location: yup.string().required(),
  contact_details: yup.string().required(),
  operating_hours: yup.string().required(),
  owner_id: yup.string(),
  menu_items: yup.array().of(menu_itemsValidationSchema),
  orders: yup.array().of(ordersValidationSchema),
  reservations: yup.array().of(reservationsValidationSchema),
  staff: yup.array().of(staffValidationSchema),
});
