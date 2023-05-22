export interface NotificationsInterface {
  id?: string;
  user_id?: string;
  message: string;
  read: boolean;
  created_at: Date;
}
