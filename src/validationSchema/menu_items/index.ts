import * as yup from 'yup';
import { order_itemsValidationSchema } from 'validationSchema/order_items';

export const menu_itemsValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().integer().required(),
  image_url: yup.string(),
  restaurant_id: yup.string(),
  order_items: yup.array().of(order_itemsValidationSchema),
});
