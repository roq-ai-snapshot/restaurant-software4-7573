import { FiMail, FiUsers, FiMenu, FiUser, FiMessageCircle, FiFile } from 'react-icons/fi';
import { IconType } from 'react-icons';

interface LinkItemProps {
  name: string;
  icon?: IconType;
  path: string;
}

export const dashboardNavigationItems: Array<LinkItemProps> = [
  { name: 'Users', icon: FiUsers, path: '/' },
  { name: 'Profile', icon: FiUser, path: '/profile' },
  { name: 'Invites', icon: FiMail, path: '/invites' },
  { name: 'Chat', icon: FiMessageCircle, path: '/chat' },
  { name: 'Files', icon: FiFile, path: '/files' },
  { name: 'Restaurants', path: 'restaurants' },
  { name: 'Menu Items', path: 'menu-items' },
  { name: 'Orders', path: 'orders' },
  { name: 'Reservations', path: 'reservations' },
  { name: 'Staff', path: 'staff' },
  { name: 'Notifications', path: 'notifications' },
  { name: 'Profile', path: 'users' },

  /** Add navigation item here **/
];
