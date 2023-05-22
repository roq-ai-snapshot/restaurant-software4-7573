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
import { getReservationsById, updateReservationsById } from 'apiSdk/reservations';
import { Error } from 'components/error';
import { reservationsValidationSchema } from 'validationSchema/reservations';
import { ReservationsInterface } from 'interfaces/reservations';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UsersInterface } from 'interfaces/users';
import { RestaurantsInterface } from 'interfaces/restaurants';
import { getUsers } from 'apiSdk/users';
import { getRestaurants } from 'apiSdk/restaurants';

function ReservationsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ReservationsInterface>(id, getReservationsById);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ReservationsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateReservationsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/reservations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ReservationsInterface>({
    initialValues: data,
    validationSchema: reservationsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Reservations
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default ReservationsEditPage;
