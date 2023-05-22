import { NotificationsInterface } from 'interfaces/notifications';
import { OrdersInterface } from 'interfaces/orders';
import { ReservationsInterface } from 'interfaces/reservations';
import { RestaurantsInterface } from 'interfaces/restaurants';
import { StaffInterface } from 'interfaces/staff';

export interface UsersInterface {
  id?: string;
  role: string;
  name: string;
  email: string;
  password: string;
  notifications: NotificationsInterface[];
  orders: OrdersInterface[];
  reservations: ReservationsInterface[];
  restaurants: RestaurantsInterface[];
  staff: StaffInterface[];
}
