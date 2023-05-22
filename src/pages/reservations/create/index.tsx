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
import { createReservations } from 'apiSdk/reservations';
import { Error } from 'components/error';
import { ReservationsInterface } from 'interfaces/reservations';
import { reservationsValidationSchema } from 'validationSchema/reservations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UsersInterface } from 'interfaces/users';
import { RestaurantsInterface } from 'interfaces/restaurants';

import { getUsers } from 'apiSdk/users';
import { getRestaurants } from 'apiSdk/restaurants';

function ReservationsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ReservationsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createReservations(values);
      resetForm();
      router.push('/reservations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ReservationsInterface>({
    initialValues: {
      date: new Date(new Date().toDateString()),
      time: new Date(new Date().toDateString()),
      party_size: 0,
      customer_id: '',
      restaurant_id: '',
    },
    validationSchema: reservationsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Reservations
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="date" mb="4">
            <FormLabel>date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values.date}
              onChange={(value: Date) => formik.setFieldValue('date', value)}
            />
          </FormControl>
          <FormControl id="time" mb="4">
            <FormLabel>time</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values.time}
              onChange={(value: Date) => formik.setFieldValue('time', value)}
            />
          </FormControl>
          <FormControl id="party_size" mb="4" isInvalid={!!formik.errors.party_size}>
            <FormLabel>party_size</FormLabel>
            <NumberInput
              name="party_size"
              value={formik.values.party_size}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('party_size', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.party_size && <FormErrorMessage>{formik.errors.party_size}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UsersInterface>
            formik={formik}
            name={'customer_id'}
            label={'Users'}
            placeholder={'Select Users'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.id}
              </option>
            )}
          />
          <AsyncSelect<RestaurantsInterface>
            formik={formik}
            name={'restaurant_id'}
            label={'Restaurants'}
            placeholder={'Select Restaurants'}
            fetcher={getRestaurants}
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

export default ReservationsCreatePage;
