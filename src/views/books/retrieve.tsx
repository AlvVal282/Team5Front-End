
import React from 'react';
import { FormattedMessage } from "react-intl";

import SearchIcon from '@mui/icons-material/Search';

const icons =  {SearchIcon};
const pages = {
    id: 'search',
    title: <FormattedMessage id = "search"  defaultMessage = "Search" />,
    type: 'collapse',
    icon: icons.SearchIcon,
    children: [
        {
            id: 'isbn',
            title: <FormattedMessage id = "isbn" defaultMessage = "ISBN" />,
            type: 'item',
            url: '/books/isbns/:random'
        },
        {
            id: 'title',
            title: <FormattedMessage id = "title" defaultMessage = "Title" />,
            type: 'item',
            url: '/books/title/:title'
        },
        {
            id: 'author',
            title: <FormattedMessage id= "author"  defaultMessage= "Author"/>,
            type: 'item',
            url: '/books/author/:author'
        },
        {
            id: 'ratings',
            title: <FormattedMessage id= "ratings"  defaultMessage= "Rating"/> ,
            type: 'item',
            url: '/books/rating'

        },
        {
            id: 'all - books',
            title: <FormattedMessage id = "all books" defaultMessage = "All books"/>,
            type: 'item',
            url: '/books/pagination/offset'
        }
    ]
};
export { pages };
 