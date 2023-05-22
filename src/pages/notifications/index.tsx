import AppLayout from 'layout/app-layout';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getNotifications } from 'apiSdk/notifications';
import { NotificationsInterface } from 'interfaces/notifications';
import { Error } from 'components/error';

function NotificationsListPage() {
  const { data, error, isLoading } = useSWR<NotificationsInterface[]>(() => true, getNotifications);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Notifications
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>User_id</Th>
                  <Th>Message</Th>
                  <Th>Read</Th>
                  <Th>Created_at</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    <Td>{record.user_id}</Td>
                    <Td>{record.message}</Td>
                    <Td>{record.read}</Td>
                    <Td>{record.created_at.toDateString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default NotificationsListPage;
