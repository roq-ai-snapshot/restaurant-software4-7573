import { ChangeEventHandler, useState } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

interface ArrayFormField {
  properties: { fieldName: string; label: string }[];
  errors: any;
  name: string;
  title: string;
  values: any;
  schema: any;
  setFieldValue: Function;
  renderRowField(arg: {
    onChange: ChangeEventHandler<HTMLInputElement>;
    value: any;
    name: string;
    fieldName: string;
    label: string;
    error?: string;
  }): JSX.Element;
}

export function ArrayFormField({
  values,
  setFieldValue,
  properties,
  title,
  name,
  renderRowField = () => null,
  schema,
  errors,
}: ArrayFormField) {
  const [newCategory, setNewCategory] = useState<any>({});
  const [addError, setAddError] = useState<any>({});
  const handleAdd = () => {
    try {
      schema.validateSync(newCategory, {
        abortEarly: false,
      });
      setFieldValue(name, [...values, newCategory]);
      setNewCategory({});
      setAddError({});
    } catch (err: any) {
      let errObj: Record<string, string> = {};
      err.inner.forEach((error: any) => {
        errObj[error.path] = error.message;
      });
      setAddError(errObj);
    }
  };

  const handleRemove = (index: number) => {
    const newCategories = [...values];
    newCategories.splice(index, 1);
    setFieldValue(name, newCategories);
  };

  return (
    <Box mb={4} p={4} border="1px" borderColor="gray.200">
      <Text mb={4}>{title}</Text>
      {values.map((_: any, index: number) => (
        <Flex minHeight="113px" alignItems="start" gap={4} key={index} mb={4}>
          {properties.map((property) =>
            renderRowField({
              ...property,
              name: `${name}.${index}.${property.fieldName}`,
              value: values[index][property.fieldName],
              error: errors?.[index][property.fieldName],
              onChange: (e: any) => setFieldValue(`${name}.${index}.${property.fieldName}`, e.target.value),
            }),
          )}
          <Button ml={10} mt={8} p={4} onClick={() => handleRemove(index)}>
            Remove
          </Button>
        </Flex>
      ))}
      <Flex minHeight="113px" mb={4} alignItems="start" gap={4}>
        {properties.map((property) =>
          renderRowField({
            ...property,
            name: property.fieldName,
            value: newCategory[property.fieldName] || '',
            error: addError[property.fieldName],
            onChange: (e: any) =>
              setNewCategory({
                ...newCategory,
                [property.fieldName]: e.target.value,
              }),
          }),
        )}
        <Button mt={8} ml={10} onClick={handleAdd}>
          Add
        </Button>
      </Flex>
    </Box>
  );
}
