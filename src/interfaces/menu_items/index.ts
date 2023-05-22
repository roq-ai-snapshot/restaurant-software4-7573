import { Order_itemsInterface } from 'interfaces/order_items';

export interface Menu_itemsInterface {
  id?: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  restaurant_id?: string;
  order_items: Order_itemsInterface[];
}
