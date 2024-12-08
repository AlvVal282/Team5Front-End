'use client';

import React, { useState, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
//import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Rating, Box } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

import axios from 'utils/axios';
import router from 'next/router';
import { width } from '@mui/system';

interface IRetrieveBooksProps {
  priority: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

interface IRetrievedBook {
  isbn: string;
  title: string;
  authors: string;
  averageRating: string;
  ratingCount: number;
  coverImage: string;
  publication: number;
}
 
export default function RetrieveBooksPage({
  priority,
  onSuccess,
  onError
}: IRetrieveBooksProps) {
  const [retrievedBooks, setRetrievedBooks] = useState<IRetrievedBook[]>([]);
  const [showRetrievedBooks, setShowRetrievedBooks] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(16); // Default limit
  const [offset, setOffset] = useState<number>(0); // Default offset
  const [totalRecords, setTotalRecords] = useState<number>(9415);

  useEffect(() => {
    setShowRetrievedBooks(false);
    setRetrievedBooks([]);
  }, [priority, offset]);

  const placeholderText = [
    "Enter ISBN Number", 
    "Enter Author's Name", 
    "Enter Book Title", 
    "Enter Rating", 
    "Retrieve All Books"
  ];
  const labelText = [
    "ISBN Number", 
    "Author's Name", 
    "Book Title", 
    "Rating", 
    "All Books"
  ];

  const validationString = Yup.object().shape({
    value: Yup.string().max(255).required(() => `${labelText[priority - 1]} value is required`),
  });
  
  const validationNumber = Yup.object().shape({
    value: Yup.string().max(255).matches(/^\d+$/, "ISBN value must be a number").required(() => `${labelText[priority - 1]} value is required`),
  });
  //const totalPages = Math.ceil(totalRecords / limit);
  return (
    <>
      <Formik
        initialValues={{
          value: '',
          submit: null
        }}
        validationSchema={priority === 1 ? validationNumber : validationString}
        onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
          let apiEndpoint = '';
          let params: any = {};
          switch (priority) {
            case 1:
              apiEndpoint = `/books/isbns/${values.value}`;
              break;
            case 2:
              apiEndpoint = `/books/author/${values.value}`;
              break;
            case 3:
              apiEndpoint = `/books/title/${values.value}`;
              break;
            case 4:
              apiEndpoint = `/books/rating/${values.value}`;
              break;
            case 5:
              apiEndpoint = '/books/pagination/offset';
              params = {limit, offset };
              break;
            default:
              onError('Invalid search type');
              setSubmitting(false);
              return;
          }
          const request = priority === 5 
          ? axios.get(apiEndpoint, { params: { limit, offset } }) 
          : axios.get(apiEndpoint);
            
          request
            //get(apiEndpoint)
            .then((response) => {
              setSubmitting(false);
              resetForm({
                values: {
                  value: '',
                  submit: null
                }
              });

              let results = [];
              if (priority === 5) {
                results = response.data.results || [];
                const pagination = response.data.pagination || {};
                setTotalRecords(pagination.totalRecords || 0);
              } else {
                results = response.data.result ? [response.data.result] : response.data.results || [];
              }

              const retrievedBookDetails = results.map((book: any) => ({
                isbn: book.isbn13 || 'N/A',
                title: book.title || 'Unknown Title',
                authors: book.authors || 'Unknown Author(s)',
                averageRating: book.ratings?.average || 'No Rating',
                ratingCount: book.ratings?.count || 0,
                coverImage: book.icons?.small || '',
                publication: book.publication || 'Unknown Year'
              }));

              if (retrievedBookDetails.length > 0) {
                setShowRetrievedBooks(true);
                setRetrievedBooks(retrievedBookDetails);
                onSuccess();
              } else {
                setShowRetrievedBooks(false);
                setRetrievedBooks([]);
                onError('No books were found.');
              }
            })
            .catch((error) => {
              console.error(error);
              const errorMessage = error.response ? error.response.data : error.message;
              setErrors({ value: errorMessage });
              setSubmitting(false);
              onError(errorMessage);
              setShowRetrievedBooks(false);
            });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', gap: '18px' }}>
          {priority !== 5 && (
            <Stack spacing={1} sx={{ flex: 1 }}>
              <OutlinedInput
                id="book-name"
                type="text"
                value={values.value}
                name="value"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder={placeholderText[priority - 1]}
                fullWidth
                error={Boolean(touched.value && errors.value)}
                sx= {{ height: '42px'}}
              />
              {touched.value && errors.value && (
                <FormHelperText error id="standard-weight-helper-text-name-message-send">
                  {errors.value}
                </FormHelperText>
              )}
            </Stack>
          )}
          <AnimateButton>
            <Button 
              disableElevation 
              size="large" 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={priority !== 5 && !values.value.trim()}
              sx={{ height: '42px' }} // Match the height of the input field
            >
              {priority === 5 ? 'RETRIEVE ALL BOOKS' : 'RETRIEVE'}
            </Button>
          </AnimateButton>
        </form>
      )}
    </Formik>
      {showRetrievedBooks && retrievedBooks.length > 0 && (
        <Grid item xs={15} sm='auto'>
          <Typography variant="h4" gutterBottom>
            Book(s) Retrieved:
          </Typography>
          <Box
            sx={{
              maxWidth: 900,
              maxHeight: 500,
              overflowY: 'auto',
              paddingRight: 2,
              width: '100%'
            }}
          >
            {retrievedBooks.map((book, index) => (
              <Grid sm='auto' container spacing={1} key={index} sx={{
                marginTop: 1,
                marginBottom: 4,
                
              }}>
                
                <Grid item xs={8} sm='auto'>
                  <Card sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h4" gutterBottom>
                        {book.title || 'Untitled'}
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom>
                        Author(s): {book.authors || 'Unknown'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        ISBN: {book.isbn}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Publication Year: {book.publication || 'N/A'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {parseFloat(book.averageRating).toFixed(1)}
                        </Typography>
                        <Rating
                          value={parseFloat(book.averageRating)}
                          precision={0.1}
                          readOnly
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {book.ratingCount || 0} ratings
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => router.push(`/books/single-page/${book.isbn}`)}
                        >
                        More Detail
                      </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Grid>
        
      )}
          
    </>
  );
}