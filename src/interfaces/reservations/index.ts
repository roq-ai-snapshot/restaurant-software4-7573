export interface ReservationsInterface {
  id?: string;
  date: Date;
  time: Date;
  party_size: number;
  customer_id?: string;
  restaurant_id?: string;
}
