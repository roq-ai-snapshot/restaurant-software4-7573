import * as yup from 'yup';

export const order_itemsValidationSchema = yup.object().shape({
  quantity: yup.number().integer().required(),
  order_id: yup.string(),
  menu_item_id: yup.string(),
});
