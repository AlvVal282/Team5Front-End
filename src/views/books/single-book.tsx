'use client';

import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Card, CardContent, Grid, Rating, Button, TextField, Alert } from '@mui/material';
import { BookCover } from 'book-cover-3d';
import { DefaultBookImage } from 'components/DefaultBookImage';
import LibraryBooksIcon from '@mui/icons-material/ImportContacts';
import axios from 'utils/axios';

const defaultTheme = createTheme();

interface IAlert {
  showAlert: boolean;
  alertMessage: string;
  alertSeverity: string;
}

const EMPTY_ALERT: IAlert = {
  showAlert: false,
  alertMessage: '',
  alertSeverity: '',
};

export default function SingleBookPage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [alert, setAlert] = useState<IAlert>(EMPTY_ALERT);
  const [trigger, setTrigger] = useState(0); 

  const isbn = '9780349113910'; 

  useEffect(() => {
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
  }, [isbn, trigger]); // Trigger refetch on `trigger` change

  const handleUpdateRating = () => {
    if (newRating < 1 || newRating > 5) {
      setAlert({
        showAlert: true,
        alertMessage: 'Please input a rating between 1 and 5.',
        alertSeverity: 'error',
      });
      return;
    }

    const updatedRatings = {
      count: book.ratings.count,
      average: book.ratings.average,
      rating1: book.ratings.rating_1,
      rating2: book.ratings.rating_2,
      rating3: book.ratings.rating_3,
      rating4: book.ratings.rating_4,
      rating5: book.ratings.rating_5,
    };

    updatedRatings.count += 1; 
    updatedRatings[`rating${newRating}`] += 1; 

    const totalStars =
      updatedRatings.rating1 * 1 +
      updatedRatings.rating2 * 2 +
      updatedRatings.rating3 * 3 +
      updatedRatings.rating4 * 4 +
      updatedRatings.rating5 * 5;

    updatedRatings.average = Number(totalStars) / Number(updatedRatings.count);

    axios
      .put(`/books/rating/${isbn}`, { ratings: updatedRatings })
      .then(() => {
        setAlert({
          showAlert: true,
          alertMessage: 'Rating updated successfully!',
          alertSeverity: 'success',
        });
        setTrigger((prevTrigger) => prevTrigger + 1);
      })
      .catch((error) => {
        if (error.response) {
          setAlert({
            showAlert: true,
            alertMessage: error.response.data.message || 'Failed to update the rating.',
            alertSeverity: 'error',
          });
        } else if (error.request) {
          setAlert({
            showAlert: true,
            alertMessage: 'No response received from the server.',
            alertSeverity: 'error',
          });
        } else {
          setAlert({
            showAlert: true,
            alertMessage: 'An error occurred while updating the rating.',
            alertSeverity: 'error',
          });
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
            <Grid container spacing={4}>
              {/* Book Cover */}
              <Grid item xs={12} sm={4}>
                <BookCover
                  rotate={30}
                  rotateHover={10}
                  perspective={700}
                  transitionDuration={1000}
                  radius={5}
                  thickness={55}
                  bgColor="#1e3a8a"
                  width={200}
                  height={300}
                  pagesOffset={5}
                >
                  {book.icons.large ? (
                    // If an image is available, display the image
                    <img
                      src={book.icons.large}
                      alt={book.title || 'Book Cover'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    // If no image, display the fallback with title or placeholder text
                    <Box
                    sx={{
                      width: 200,
                      height: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#e0e0e0',
                      color: '#9e9e9e',
                      borderRadius: 2,
                    }}
                  >
                    <LibraryBooksIcon sx={{ fontSize: 80 }} />
                  </Box>
                  )}
                </BookCover>
              </Grid>

              {/* Book Details and Rating Update */}
              <Grid item xs={12} sm={8}>
                <Card sx={{ boxShadow: 3, padding: 2 }}>
                  <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {book.title}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Authors:</strong> {book.authors}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Publication Year:</strong> {book.publication}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Typography variant="body1" sx={{ mr: 1 }}>
                        <strong>{book.ratings.average.toFixed(1)}</strong>
                      </Typography>
                      <Rating value={book.ratings.average} precision={0.1} readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({book.ratings.count} ratings)
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        Add Your Rating
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                          label="Your Rating"
                          type="number"
                          value={newRating}
                          onChange={(e) => setNewRating(parseInt(e.target.value, 10))}
                          inputProps={{ step: '1', min: '1', max: '5' }}
                          sx={{ width: 150 }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleUpdateRating}
                        >
                          Submit Rating
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            {/* Display Alert if there's an active alert */}
            {alert.showAlert && (
              <Alert severity={alert.alertSeverity} onClose={() => setAlert(EMPTY_ALERT)}>
                {alert.alertMessage}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}