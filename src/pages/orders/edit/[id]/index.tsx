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
import { getOrdersById, updateOrdersById } from 'apiSdk/orders';
import { Error } from 'components/error';
import { ordersValidationSchema } from 'validationSchema/orders';
import { OrdersInterface } from 'interfaces/orders';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UsersInterface } from 'interfaces/users';
import { RestaurantsInterface } from 'interfaces/restaurants';
import { getUsers } from 'apiSdk/users';
import { getRestaurants } from 'apiSdk/restaurants';
import { order_itemsValidationSchema } from 'validationSchema/order_items';

function OrdersEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OrdersInterface>(id, getOrdersById);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: OrdersInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateOrdersById(id, values);
      mutate(updated);
      resetForm();
      router.push('/orders');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<OrdersInterface>({
    initialValues: data,
    validationSchema: ordersValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Orders
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="status" mb="4" isInvalid={!!formik.errors.status}>
              <FormLabel>Status</FormLabel>
              <Input type="text" name="status" value={formik.values.status} onChange={formik.handleChange} />
              {formik.errors.status && <FormErrorMessage>{formik.errors.status}</FormErrorMessage>}
            </FormControl>
            <FormControl id="special_requests" mb="4" isInvalid={!!formik.errors.special_requests}>
              <FormLabel>Special_requests</FormLabel>
              <Input
                type="text"
                name="special_requests"
                value={formik.values.special_requests}
                onChange={formik.handleChange}
              />
              {formik.errors.special_requests && <FormErrorMessage>{formik.errors.special_requests}</FormErrorMessage>}
            </FormControl>
            <FormControl id="created_at" mb="4">
              <FormLabel>created_at</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values.created_at}
                onChange={(value: Date) => formik.setFieldValue('created_at', value)}
              />
            </FormControl>
            <FormControl id="updated_at" mb="4">
              <FormLabel>updated_at</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values.updated_at}
                onChange={(value: Date) => formik.setFieldValue('updated_at', value)}
              />
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

            <ArrayFormField
              values={formik.values.order_items}
              errors={formik.errors.order_items}
              setFieldValue={formik.setFieldValue}
              properties={[{ fieldName: 'quantity', label: 'Quantity' }]}
              title={'Order_items'}
              name="order_items"
              schema={order_itemsValidationSchema}
              renderRowField={({ value, onChange, name, error, label }) => (
                <>
                  {name === 'quantity' && (
                    <FormControl id="quantity" mb="4" isInvalid={Boolean(error)}>
                      <FormLabel>{label}</FormLabel>
                      <NumberInput
                        name={name}
                        value={value}
                        onChange={(valueString, valueNumber) =>
                          formik.setFieldValue(name, Number.isNaN(valueNumber) ? 0 : valueNumber)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    </FormControl>
                  )}
                </>
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

export default OrdersEditPage;
