import * as yup from 'yup';

export const staffValidationSchema = yup.object().shape({
  role: yup.string().required(),
  user_id: yup.string(),
  restaurant_id: yup.string(),
});
