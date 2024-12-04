// project import
//import samplePage from './sample-page';
import other from './other';
import pages from './messages';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [pages, other]
};

export default menuItems;
