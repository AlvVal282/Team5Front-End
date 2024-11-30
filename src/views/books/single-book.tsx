'use client';

import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Card, CardContent, Grid, Rating, Button, TextField } from '@mui/material';
import { BookCover } from 'book-cover-3d';
import axios from 'utils/axios';

const defaultTheme = createTheme();

export default function SingleBookPage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);

  const isbn = "9780439554930"; // Hardcoded ISBN for demonstration

  useEffect(() => {
    // Fetch book details
    axios
      .get(`/books/isbns/${isbn}`)
      .then((response) => {
        setBook(response.data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching book details:', error);
        setLoading(false);
      });
  }, [isbn]);

  const handleUpdateRating = () => {
    if (newRating < 1 || newRating > 5) {
      alert('Please input a rating between 1 and 5.');
      return;
    }

    const updatedRatings = { ...book.ratings };
    updatedRatings.count += 1; // Increase total count
    updatedRatings[`rating_${newRating}`] += 1; // Increment the specific star count

    // Recalculate average
    const totalStars =
      updatedRatings.rating_1 * 1 +
      updatedRatings.rating_2 * 2 +
      updatedRatings.rating_3 * 3 +
      updatedRatings.rating_4 * 4 +
      updatedRatings.rating_5 * 5;

    updatedRatings.average = totalStars / updatedRatings.count;

    // Add token handling
    const token = localStorage.getItem('jwtToken'); // Ensure the token is available
    if (!token) {
      alert('Authorization token is missing. Please log in.');
      return;
    }

    axios
      .put(
        `/books/rating/${isbn}`,
        { ratings: updatedRatings },
        { headers: { Authorization: `Bearer ${token}` } } // Add JWT token to request headers
      )
      .then((response) => {
        console.log('Response from server:', response.data);
        setBook({ ...book, ratings: updatedRatings });
        alert('Rating updated successfully!');
      })
      .catch((error) => {
        if (error.response) {
          console.error('Server responded with error:', error.response.data);
          alert(error.response.data.message || 'Failed to update the rating.');
        } else if (error.request) {
          console.error('Request made but no response received:', error.request);
          alert('No response received from the server.');
        } else {
          console.error('Error during setup:', error.message);
          alert('An error occurred while updating the rating.');
        }
      });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!book) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        No details available for the book with ISBN: {isbn}
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LibraryBooksIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Book Details
          </Typography>
          <Box sx={{ mt: 4, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <BookCover
                  rotate={30}
                  rotateHover={10}
                  perspective={600}
                  transitionDuration={300}
                  radius={5}
                  thickness={20}
                  bgColor="#1e3a8a"
                  width={200}
                  height={300}
                  pagesOffset={3}
                >
                  <img
                    src={book.icons.large || '/assets/default-book-cover.png'}
                    alt={book.title || 'Book Cover'}
                  />
                </BookCover>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Card sx={{ boxShadow: 3, padding: 2 }}>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>
                      {book.title}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Original Title: {book.original_title}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Authors: {book.authors}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Publication Year: {book.publication}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {book.ratings.average.toFixed(1)}
                      </Typography>
                      <Rating
                        value={book.ratings.average}
                        precision={0.1}
                        readOnly
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({book.ratings.count} ratings)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Add Your Rating
              </Typography>
              <TextField
                label="Your Rating"
                type="number"
                value={newRating}
                onChange={(e) => setNewRating(parseInt(e.target.value, 10))}
                inputProps={{ step: '1', min: '1', max: '5' }}
                sx={{ mr: 2, width: 150 }}
              />
              <Button variant="contained" color="primary" onClick={handleUpdateRating}>
                Submit Rating
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}











