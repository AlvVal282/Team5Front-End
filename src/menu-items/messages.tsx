// third-party
import { FormattedMessage } from 'react-intl';

// assets
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import LibraryBooksIcon from '@mui/icons-material/ImportContacts';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { MessageOutlined, EmailIcon, SendIcon, AddIcon, DeleteIcon, BookIcon, BookmarksIcon, LibraryBooksIcon};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages: NavItemType = {
  id: 'group-pages',
  title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'books',
      title: <FormattedMessage id="books" defaultMessage="Books" />,
      type: 'collapse',
      icon: icons.BookmarksIcon,
      children: [
        {
          id: 'retrieve-books',
          title: <FormattedMessage id="retrieve" defaultMessage="Search" />,
          type: 'item',
          url: '/books/retrieve',
          icon: icons.BookIcon
        },
        {
          id: 'create-book',
          title: <FormattedMessage id="create" defaultMessage="Create" />,
          type: 'item',
          url: '/books/create',
          icon: icons.AddIcon
        },
        {
          id: 'delete-books',
          title: <FormattedMessage id="delete" defaultMessage="Delete" />,
          type: 'item',
          url: '/books/delete',
          icon: icons.DeleteIcon
        }
      ]
    }
    
  ]
};

export default pages;
