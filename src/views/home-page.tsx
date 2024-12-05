// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| HOME PAGE ||============================== //

export default function HomePage() {
  return (
    <MainCard title="Welcome to the Library App">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Explore, Manage, and Organize Your Books
        </Typography>
        <Typography variant="body1">
          This library application is designed to help you efficiently manage your book collection. Whether you're an avid reader, a
          researcher, or simply someone who loves books, this app provides an easy and intuitive way to organize your library.
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Features:
        </Typography>
        <Typography variant="body2" component="ul">
          <li>
            <strong>Create:</strong> Add new books to your library collection with details like title, author(s), category, and more.
          </li>
          <li>
            <strong>Search:</strong> Quickly find books by title, author, or category using the search functionality.
          </li>
          <li>
            <strong>Delete:</strong> Remove books from your collection that are no longer needed or relevant.
          </li>
        </Typography>
      </Box>
    </MainCard>
  );
}

