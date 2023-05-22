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
import { createRestaurants } from 'apiSdk/restaurants';
import { Error } from 'components/error';
import { RestaurantsInterface } from 'interfaces/restaurants';
import { restaurantsValidationSchema } from 'validationSchema/restaurants';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UsersInterface } from 'interfaces/users';
import { menu_itemsValidationSchema } from 'validationSchema/menu_items';
import { ordersValidationSchema } from 'validationSchema/orders';
import { reservationsValidationSchema } from 'validationSchema/reservations';
import { staffValidationSchema } from 'validationSchema/staff';
import { getUsers } from 'apiSdk/users';

function RestaurantsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RestaurantsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRestaurants(values);
      resetForm();
      router.push('/restaurants');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RestaurantsInterface>({
    initialValues: {
      name: '',
      location: '',
      contact_details: '',
      operating_hours: '',
      owner_id: '',
      menu_items: [],
      orders: [],
      reservations: [],
      staff: [],
    },
    validationSchema: restaurantsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Restaurants
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="location" mb="4" isInvalid={!!formik.errors.location}>
            <FormLabel>Location</FormLabel>
            <Input type="text" name="location" value={formik.values.location} onChange={formik.handleChange} />
            {formik.errors.location && <FormErrorMessage>{formik.errors.location}</FormErrorMessage>}
          </FormControl>
          <FormControl id="contact_details" mb="4" isInvalid={!!formik.errors.contact_details}>
            <FormLabel>Contact_details</FormLabel>
            <Input
              type="text"
              name="contact_details"
              value={formik.values.contact_details}
              onChange={formik.handleChange}
            />
            {formik.errors.contact_details && <FormErrorMessage>{formik.errors.contact_details}</FormErrorMessage>}
          </FormControl>
          <FormControl id="operating_hours" mb="4" isInvalid={!!formik.errors.operating_hours}>
            <FormLabel>Operating_hours</FormLabel>
            <Input
              type="text"
              name="operating_hours"
              value={formik.values.operating_hours}
              onChange={formik.handleChange}
            />
            {formik.errors.operating_hours && <FormErrorMessage>{formik.errors.operating_hours}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UsersInterface>
            formik={formik}
            name={'owner_id'}
            label={'Users'}
            placeholder={'Select Users'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.id}
              </option>
            )}
          />

          <ArrayFormField
            values={formik.values.menu_items}
            errors={formik.errors.menu_items}
            setFieldValue={formik.setFieldValue}
            properties={[
              { fieldName: 'name', label: 'Name' },
              { fieldName: 'description', label: 'Description' },
              { fieldName: 'price', label: 'Price' },
              { fieldName: 'image_url', label: 'Image_url' },
            ]}
            title={'Menu_items'}
            name="menu_items"
            schema={menu_itemsValidationSchema}
            renderRowField={({ value, onChange, name, error, label }) => (
              <>
                {name === 'name' && (
                  <FormControl id="name" mt="10" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={onChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {name === 'description' && (
                  <FormControl id="description" mt="10" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={onChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {name === 'price' && (
                  <FormControl id="price" mb="4" isInvalid={Boolean(error)}>
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
                {name === 'image_url' && (
                  <FormControl id="image_url" mt="10" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={onChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
              </>
            )}
          />

          <ArrayFormField
            values={formik.values.orders}
            errors={formik.errors.orders}
            setFieldValue={formik.setFieldValue}
            properties={[
              { fieldName: 'status', label: 'Status' },
              { fieldName: 'special_requests', label: 'Special_requests' },
              { fieldName: 'created_at', label: 'Created_at' },
              { fieldName: 'updated_at', label: 'Updated_at' },
            ]}
            title={'Orders'}
            name="orders"
            schema={ordersValidationSchema}
            renderRowField={({ value, onChange, name, error, label }) => (
              <>
                {name === 'status' && (
                  <FormControl id="status" mt="10" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={onChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {name === 'special_requests' && (
                  <FormControl id="special_requests" mt="10" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={onChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {name === 'created_at' && (
                  <FormControl id="created_at" mb="4" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <DatePicker
                      dateFormat={'dd/MM/yyyy'}
                      selected={value}
                      onChange={(value: Date) => formik.setFieldValue(name, value)}
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {name === 'updated_at' && (
                  <FormControl id="updated_at" mb="4" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <DatePicker
                      dateFormat={'dd/MM/yyyy'}
                      selected={value}
                      onChange={(value: Date) => formik.setFieldValue(name, value)}
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
              </>
            )}
          />

          <ArrayFormField
            values={formik.values.reservations}
            errors={formik.errors.reservations}
            setFieldValue={formik.setFieldValue}
            properties={[
              { fieldName: 'date', label: 'Date' },
              { fieldName: 'time', label: 'Time' },
              { fieldName: 'party_size', label: 'Party_size' },
            ]}
            title={'Reservations'}
            name="reservations"
            schema={reservationsValidationSchema}
            renderRowField={({ value, onChange, name, error, label }) => (
              <>
                {name === 'date' && (
                  <FormControl id="date" mb="4" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <DatePicker
                      dateFormat={'dd/MM/yyyy'}
                      selected={value}
                      onChange={(value: Date) => formik.setFieldValue(name, value)}
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {name === 'time' && (
                  <FormControl id="time" mb="4" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <DatePicker
                      dateFormat={'dd/MM/yyyy'}
                      selected={value}
                      onChange={(value: Date) => formik.setFieldValue(name, value)}
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {name === 'party_size' && (
                  <FormControl id="party_size" mb="4" isInvalid={Boolean(error)}>
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

          <ArrayFormField
            values={formik.values.staff}
            errors={formik.errors.staff}
            setFieldValue={formik.setFieldValue}
            properties={[{ fieldName: 'role', label: 'Role' }]}
            title={'Staff'}
            name="staff"
            schema={staffValidationSchema}
            renderRowField={({ value, onChange, name, error, label }) => (
              <>
                {name === 'role' && (
                  <FormControl id="role" mt="10" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={onChange} />
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
      </Box>
    </AppLayout>
  );
}

export default RestaurantsCreatePage;
