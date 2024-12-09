'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Rating from '@mui/material/Rating';
import axios from 'utils/axios';

// ==============================|| HOME PAGE ||============================== //

export default function HomePage() {
  const theme = useTheme();
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recommended books from the backend
  const fetchRecommendedBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/books/pagination/offset', {
        limit: 10,
        offset: 0, 
      });

      const { results } = response.data;
      if (results && results.length > 0) {
        const shuffledBooks = results.sort(() => 0.5 - Math.random());
        setRecommendedBooks(shuffledBooks.slice(0, 3)); 
      }
    } catch (error) {
      console.error('Error fetching recommended books:', error);
      setError('Failed to load recommended books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedBooks();
  }, []);

  const menuItems = [
    { title: 'Search', url: '/books/retrieve', color: 'primary' },
    { title: 'Create', url: '/books/create', color: 'primary' },
    { title: 'Delete', url: '/books/delete', color: 'error' },
  ];

  return (
    <MainCard
      title="Welcome to the Library App"
      sx={{
        boxShadow: 3,
        padding: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: theme.typography.h3.fontWeight,
            fontFamily: theme.typography.fontFamily,
            mb: 2,
            color: theme.palette.primary.main,
          }}
        >
          Explore, Manage, and Organize Your Books!
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              pr: { md: 4 },
              mb: { xs: 2, md: 0 },
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: theme.palette.text.secondary,
              }}
            >
              This library application is designed to help you efficiently manage your book collection. Whether you're an avid reader, a
              researcher, or simply someone who loves books, this app provides an easy and intuitive way to organize your library.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <img
              src="/assets/images/home.jpg"
              alt="Book Image"
              style={{
                maxWidth: '400px',
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: theme.shadows[4],
              }}
            />
          </Box>
        </Box>
        <Stack spacing={2} direction="row" justifyContent="center" sx={{ mb: 4 }}>
          {menuItems.map((item) => (
            <Link key={item.title} href={item.url} passHref legacyBehavior>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette[item.color].main,
                  color: theme.palette[item.color].contrastText,
                  fontSize: '1rem',
                  padding: '8px 24px',
                  borderRadius: '24px',
                  textTransform: 'capitalize',
                  '&:hover': {
                    backgroundColor: theme.palette[item.color].dark,
                  },
                }}
              >
                {item.title}
              </Button>
            </Link>
          ))}
        </Stack>
      </Box>
      <Box sx={{ mt: 6 }}>
  <Typography
    variant="h4"
    sx={{
      mb: 3,
      textAlign: 'center',
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    }}
  >
    Recommended Books
  </Typography>
  {loading && (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 4,
      }}
    >
      <CircularProgress />
    </Box>
  )}
  {error && (
    <Alert severity="error" sx={{ mt: 4, textAlign: 'center' }}>
      {error}
    </Alert>
  )}
  {!loading && !error && (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={4}
      justifyContent="center"
      alignItems="center"
      sx={{
        px: { xs: 2, md: 6 },
      }}
    >
      {recommendedBooks.map((book) => (
        <Link href={`/books/${book.isbn13}`} key={book.isbn13} passHref legacyBehavior>
          <a style={{ textDecoration: 'none' }}>
            <MainCard
              sx={{
                width: '240px',
                height: '400px',
                textAlign: 'center',
                boxShadow: theme.shadows[4],
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: theme.palette.background.default,
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.shadows[6],
                  transform: 'scale(1.02)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <Box
                sx={{
                  width: '150px',
                  height: '200px',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  margin: '0 auto', 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                  boxShadow: theme.shadows[2],
                }}
              >
                <img
                  src={book.icons.large}
                  alt={book.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '8px',
                  color: theme.palette.text.primary,
                }}
              >
                {book.title}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  marginBottom: '8px',
                }}
              >
                {book.authors}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 'auto',
                }}
              >
                <Rating
                  value={book.ratings.average}
                  precision={0.1}
                  readOnly
                  sx={{ marginRight: '8px' }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary }}
                >
                  ({book.ratings.count} ratings)
                </Typography>
              </Box>
            </MainCard>
          </a>
        </Link>
      ))}
    </Stack>
  )}
</Box>



    </MainCard>
  );
}
