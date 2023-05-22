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
import { getUsersById, updateUsersById } from 'apiSdk/users';
import { Error } from 'components/error';
import { usersValidationSchema } from 'validationSchema/users';
import { UsersInterface } from 'interfaces/users';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';

import { notificationsValidationSchema } from 'validationSchema/notifications';
import { ordersValidationSchema } from 'validationSchema/orders';
import { reservationsValidationSchema } from 'validationSchema/reservations';
import { restaurantsValidationSchema } from 'validationSchema/restaurants';
import { staffValidationSchema } from 'validationSchema/staff';

function UsersEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<UsersInterface>(id, getUsersById);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: UsersInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateUsersById(id, values);
      mutate(updated);
      resetForm();
      router.push('/users');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<UsersInterface>({
    initialValues: data,
    validationSchema: usersValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Users
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="role" mb="4" isInvalid={!!formik.errors.role}>
              <FormLabel>Role</FormLabel>
              <Input type="text" name="role" value={formik.values.role} onChange={formik.handleChange} />
              {formik.errors.role && <FormErrorMessage>{formik.errors.role}</FormErrorMessage>}
            </FormControl>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="email" mb="4" isInvalid={!!formik.errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} />
              {formik.errors.email && <FormErrorMessage>{formik.errors.email}</FormErrorMessage>}
            </FormControl>
            <FormControl id="password" mb="4" isInvalid={!!formik.errors.password}>
              <FormLabel>Password</FormLabel>
              <Input type="text" name="password" value={formik.values.password} onChange={formik.handleChange} />
              {formik.errors.password && <FormErrorMessage>{formik.errors.password}</FormErrorMessage>}
            </FormControl>

            <ArrayFormField
              values={formik.values.notifications}
              errors={formik.errors.notifications}
              setFieldValue={formik.setFieldValue}
              properties={[
                { fieldName: 'message', label: 'Message' },
                { fieldName: 'read', label: 'Read' },
                { fieldName: 'created_at', label: 'Created_at' },
              ]}
              title={'Notifications'}
              name="notifications"
              schema={notificationsValidationSchema}
              renderRowField={({ value, onChange, name, error, label }) => (
                <>
                  {name === 'message' && (
                    <FormControl id="message" mt="10" isInvalid={Boolean(error)}>
                      <FormLabel>{label}</FormLabel>
                      <Input type="text" name={name} value={value} onChange={onChange} />
                      {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    </FormControl>
                  )}
                  {name === 'read' && (
                    <FormControl id="read" mb="4" display="flex" alignItems="center" isInvalid={Boolean(error)}>
                      <FormLabel htmlFor="switch-read">{label}</FormLabel>
                      <Switch id="switch-read" name={name} onChange={onChange} value={value ? 1 : 0} />
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
              values={formik.values.restaurants}
              errors={formik.errors.restaurants}
              setFieldValue={formik.setFieldValue}
              properties={[
                { fieldName: 'name', label: 'Name' },
                { fieldName: 'location', label: 'Location' },
                { fieldName: 'contact_details', label: 'Contact_details' },
                { fieldName: 'operating_hours', label: 'Operating_hours' },
              ]}
              title={'Restaurants'}
              name="restaurants"
              schema={restaurantsValidationSchema}
              renderRowField={({ value, onChange, name, error, label }) => (
                <>
                  {name === 'name' && (
                    <FormControl id="name" mt="10" isInvalid={Boolean(error)}>
                      <FormLabel>{label}</FormLabel>
                      <Input type="text" name={name} value={value} onChange={onChange} />
                      {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    </FormControl>
                  )}
                  {name === 'location' && (
                    <FormControl id="location" mt="10" isInvalid={Boolean(error)}>
                      <FormLabel>{label}</FormLabel>
                      <Input type="text" name={name} value={value} onChange={onChange} />
                      {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    </FormControl>
                  )}
                  {name === 'contact_details' && (
                    <FormControl id="contact_details" mt="10" isInvalid={Boolean(error)}>
                      <FormLabel>{label}</FormLabel>
                      <Input type="text" name={name} value={value} onChange={onChange} />
                      {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    </FormControl>
                  )}
                  {name === 'operating_hours' && (
                    <FormControl id="operating_hours" mt="10" isInvalid={Boolean(error)}>
                      <FormLabel>{label}</FormLabel>
                      <Input type="text" name={name} value={value} onChange={onChange} />
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
        )}
      </Box>
    </AppLayout>
  );
}

export default UsersEditPage;
