import * as yup from 'yup';

export const notificationsValidationSchema = yup.object().shape({
  message: yup.string().required(),
  read: yup.boolean().required(),
  created_at: yup.date().required(),
  user_id: yup.string(),
});
