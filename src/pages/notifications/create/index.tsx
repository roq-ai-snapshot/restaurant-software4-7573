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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createNotifications } from 'apiSdk/notifications';
import { Error } from 'components/error';
import { NotificationsInterface } from 'interfaces/notifications';
import { notificationsValidationSchema } from 'validationSchema/notifications';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UsersInterface } from 'interfaces/users';

import { getUsers } from 'apiSdk/users';

function NotificationsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: NotificationsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createNotifications(values);
      resetForm();
      router.push('/notifications');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<NotificationsInterface>({
    initialValues: {
      message: '',
      read: false,
      created_at: new Date(new Date().toDateString()),
      user_id: '',
    },
    validationSchema: notificationsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Notifications
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default NotificationsCreatePage;
