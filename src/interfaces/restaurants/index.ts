import { Menu_itemsInterface } from 'interfaces/menu_items';
import { OrdersInterface } from 'interfaces/orders';
import { ReservationsInterface } from 'interfaces/reservations';
import { StaffInterface } from 'interfaces/staff';

export interface RestaurantsInterface {
  id?: string;
  name: string;
  location: string;
  contact_details: string;
  operating_hours: string;
  owner_id?: string;
  menu_items: Menu_itemsInterface[];
  orders: OrdersInterface[];
  reservations: ReservationsInterface[];
  staff: StaffInterface[];
}
