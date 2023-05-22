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
import { createMenu_items } from 'apiSdk/menu_items';
import { Error } from 'components/error';
import { Menu_itemsInterface } from 'interfaces/menu_items';
import { menu_itemsValidationSchema } from 'validationSchema/menu_items';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { RestaurantsInterface } from 'interfaces/restaurants';
import { order_itemsValidationSchema } from 'validationSchema/order_items';
import { getRestaurants } from 'apiSdk/restaurants';

function Menu_itemsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: Menu_itemsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMenu_items(values);
      resetForm();
      router.push('/menu-items');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<Menu_itemsInterface>({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      image_url: '',
      restaurant_id: '',
      order_items: [],
    },
    validationSchema: menu_itemsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Menu_items
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors.description}</FormErrorMessage>}
          </FormControl>
          <FormControl id="price" mb="4" isInvalid={!!formik.errors.price}>
            <FormLabel>price</FormLabel>
            <NumberInput
              name="price"
              value={formik.values.price}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('price', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.price && <FormErrorMessage>{formik.errors.price}</FormErrorMessage>}
          </FormControl>
          <FormControl id="image_url" mb="4" isInvalid={!!formik.errors.image_url}>
            <FormLabel>Image_url</FormLabel>
            <Input type="text" name="image_url" value={formik.values.image_url} onChange={formik.handleChange} />
            {formik.errors.image_url && <FormErrorMessage>{formik.errors.image_url}</FormErrorMessage>}
          </FormControl>
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
      </Box>
    </AppLayout>
  );
}

export default Menu_itemsCreatePage;
