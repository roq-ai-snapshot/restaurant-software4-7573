import * as yup from 'yup';
import { order_itemsValidationSchema } from 'validationSchema/order_items';

export const ordersValidationSchema = yup.object().shape({
  status: yup.string().required(),
  special_requests: yup.string(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  customer_id: yup.string(),
  restaurant_id: yup.string(),
  order_items: yup.array().of(order_itemsValidationSchema),
});
