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

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { MessageOutlined, EmailIcon, SendIcon, AddIcon, DeleteIcon, BookIcon, BookmarksIcon };

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages: NavItemType = {
  id: 'group-pages',
  title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'messages',
      title: <FormattedMessage id="messages" />,
      type: 'collapse',
      icon: icons.MessageOutlined,
      children: [
        {
          id: 'send-message',
          title: <FormattedMessage id="send-message" />,
          type: 'item',
          url: '/messages/send',
          icon: icons.SendIcon
        },
        {
          id: 'view-messages',
          title: <FormattedMessage id="view-messages" />,
          type: 'item',
          url: '/messages/list',
          icon: icons.EmailIcon
        }
      ]
    },
    {
      id: 'books',
      title: <FormattedMessage id="books" defaultMessage="Books" style={{ textTransform: 'capitalize' }} />,
      type: 'collapse',
      icon: icons.BookmarksIcon,
      children: [
        {
          id: 'retrieve-books',
          title: <FormattedMessage id="retrieve" defaultMessage="Search" style={{ textTransform: 'capitalize' }} />,
          type: 'item',
          url: '/books/retrieve',
          icon: icons.BookIcon
        },
        {
          id: 'create-book',
          title: <FormattedMessage id="create" defaultMessage="Create" style={{ textTransform: 'capitalize' }} />,
          type: 'item',
          url: '/books/create',
          icon: icons.AddIcon
        },
        {
          id: 'delete-books',
          title: <FormattedMessage id="delete" defaultMessage="Delete" style={{ textTransform: 'capitalize' }} />,
          type: 'item',
          url: '/books/delete',
          icon: icons.DeleteIcon
        }
      ]
    }
    
  ]
};

export default pages;
