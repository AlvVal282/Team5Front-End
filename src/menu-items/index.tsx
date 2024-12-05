// project import
import homePage from './home-page';
import other from './other';
import pages from './messages';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [homePage, pages, other]
};

export default menuItems;
