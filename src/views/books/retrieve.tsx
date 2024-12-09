'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  CssBaseline,
  Typography,
  Avatar,
  Alert,
  Grid,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import { grey } from '@mui/material/colors';

// Project imports
import PrioritySelector from 'components/PrioritySelectors';
import RetrieveBooksPage from 'sections/books/book-forms/bookForm';

interface IAlert {
  showAlert: boolean;
  alertMessage: string;
  alertSeverity: 'success' | 'error' | 'info' | 'warning';
}

const EMPTY_ALERT: IAlert = {
  showAlert: false,
  alertMessage: '',
  alertSeverity: 'info',
};

export default function RetrieveBooks() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [alert, setAlert] = useState(EMPTY_ALERT);

  // Handle the priority change
  const handlePriorityChange = (event: any) => {
    const newPriority = Number(event.target.value);
    setSelectedOption(newPriority);
    setAlert(EMPTY_ALERT); // Clear alerts when priority changes
  };

  const onSuccess = () => {
    setAlert({
      showAlert: true,
      alertMessage: 'Books retrieved successfully!',
      alertSeverity: 'success',
    });
  };

  const onError = (message: string) => {
    setAlert({
      showAlert: true,
      alertMessage: `Error retrieving books: ${message}`,
      alertSeverity: 'error',
    });
  };

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: grey[500] }}>
          <BookIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Retrieve Books By...
        </Typography>

        {alert.showAlert && (
          <Alert
            sx={{ width: '100%', marginTop: 2 }}
            severity={alert.alertSeverity}
            onClose={() => setAlert(EMPTY_ALERT)}
          >
            {alert.alertMessage}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ marginTop: 2, width: '100%' }}>
          <Grid item xs={12} sm={4}>
            <PrioritySelector
              initialValue={selectedOption}
              onChange={handlePriorityChange}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            {selectedOption !== 0 && (
              <RetrieveBooksPage
                priority={selectedOption}
                onSuccess={onSuccess}
                onError={onError}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

 