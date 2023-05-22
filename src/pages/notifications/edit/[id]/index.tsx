import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getNotificationsById, updateNotificationsById } from 'apiSdk/notifications';
import { Error } from 'components/error';
import { notificationsValidationSchema } from 'validationSchema/notifications';
import { NotificationsInterface } from 'interfaces/notifications';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UsersInterface } from 'interfaces/users';
import { getUsers } from 'apiSdk/users';

function NotificationsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<NotificationsInterface>(id, getNotificationsById);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: NotificationsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateNotificationsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/notifications');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<NotificationsInterface>({
    initialValues: data,
    validationSchema: notificationsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Notifications
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="message" mb="4" isInvalid={!!formik.errors.message}>
              <FormLabel>Message</FormLabel>
              <Input type="text" name="message" value={formik.values.message} onChange={formik.handleChange} />
              {formik.errors.message && <FormErrorMessage>{formik.errors.message}</FormErrorMessage>}
            </FormControl>
            <FormControl id="read" display="flex" alignItems="center" mb="4" isInvalid={!!formik.errors.read}>
              <FormLabel htmlFor="switch-read">read</FormLabel>
              <Switch id="switch-read" name="read" onChange={formik.handleChange} value={formik.values.read ? 1 : 0} />
              {formik.errors.read && <FormErrorMessage>{formik.errors.read}</FormErrorMessage>}
            </FormControl>
            <FormControl id="created_at" mb="4">
              <FormLabel>created_at</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values.created_at}
                onChange={(value: Date) => formik.setFieldValue('created_at', value)}
              />
            </FormControl>
            <AsyncSelect<UsersInterface>
              formik={formik}
              name={'user_id'}
              label={'Users'}
              placeholder={'Select Users'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.id}
                </option>
              )}
            />

            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default NotificationsEditPage;
