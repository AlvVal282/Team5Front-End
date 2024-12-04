'use client';

import React, { useState, useEffect} from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Card, CardContent, Rating, Box, CardMedia} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

import axios from 'utils/axios';

interface IDeleteBooksProps {
  priority: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}
interface IDeletedBook {
  isbn: string;
  title: string;
  authors: string;
  averageRating: string;
  ratingCount: number;
  coverImage: string;
  publication: number;
}


export default function DeleteBooks({
  priority,
  onSuccess,
  onError
}: IDeleteBooksProps) {
  const [deletedBooks, setDeletedBooks] = useState<IDeletedBook[]>([]);
  const [showDeletedBooks, setShowDeletedBooks] = useState<boolean>(false); 

  useEffect(() => {
    setShowDeletedBooks(false); // Hide deleted books when priority changes
  }, [priority]);


  const placeholderText = ["Enter ISBN Number", "Enter Author's Name", "Enter Book Title"];
  const labelText = ["ISBN Number", "Author's Name", "Book Title"];
  return (
    <>
      <Formik
        initialValues={{
          value: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          value: Yup.string().max(255).required(() => `${labelText[priority - 1]} value is required`),
        })}
        onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
          let apiEndpoint = '';
          if (priority === 1) {
            apiEndpoint = `/books/isbns/${values.value}`;
          } else if (priority === 2) {
            apiEndpoint = `/books/author/${values.value}`;
          } else if (priority === 3) {
            apiEndpoint = `/books/title/${values.value}`;
          }

          axios
            .delete(apiEndpoint)
            .then((response) => {
              setSubmitting(false);
              resetForm({
                values: {
                  value: '',
                  submit: null
                }
              });
              if(priority == 1 && response.data.result) {
                const result = response.data.result;
                const deletedBookDetails = {
                  isbn: result.isbn13 || 'N/A',
                  title: result.title || 'Unknown Title',
                  authors: result.authors || 'Unknown Author(s)',
                  averageRating: result.ratings?.average || 'No Rating',
                  ratingCount: result.ratings?.count || 0,
                  coverImage: result.icons?.large,
                  publication: result.publication || 'Unknown Year'
                };
                setShowDeletedBooks(true);
                setDeletedBooks([deletedBookDetails]);

              } else if (priority > 1 && response.data.results) {
                const result = response.data.results;
                const deletedBookDetails = result.map((book : any) => ({
                  isbn: book.isbn13 || 'N/A',
                  title: book.title || 'Unknown Title',
                  authors: book.authors || 'Unknown Author(s)',
                  averageRating: book.ratings?.average || 'No Rating',
                  ratingCount: book.ratings?.count || 0,
                  coverImage: book.icons?.large || '',
                  publication: book.publication || 'Unknown Year'
                }));
                setShowDeletedBooks(true);
                setDeletedBooks(deletedBookDetails);

              } else {
                setShowDeletedBooks(false);
                setDeletedBooks([]);
                onError('No books were deleted or result is not an array.');

              }
              onSuccess();
            })
            .catch((error) => {
              console.error(error);
              const errorMessage = error.response ? error.response.data : error.message;
              setErrors({ value: errorMessage });
              setSubmitting(false);
              onError(errorMessage);
              setShowDeletedBooks(false);
            });
        }}
        >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name">Delete by {labelText[priority - 1]}</InputLabel>
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
                  />
                </Stack>
                {touched.value && errors.value && (
                  <FormHelperText error id="standard-weight-helper-text-name-message-send">
                    {errors.value}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    DELETE
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      {showDeletedBooks && deletedBooks.length > 0 && (
        <Grid item xs={15} sm={8}>
          <Typography variant="h4" gutterBottom>
            Book(s) Deleted:
          </Typography>
          <Box 
            sx={{
              maxHeight: 500,  
              overflowY: 'auto',  
              paddingRight: 2,  
            }}
          >
            {deletedBooks.map((book, index) => (
              <Card 
                key={index} 
                sx={{ display: 'flex', flexDirection: 'row', mb: 2 }} 
              >
                <CardMedia
                  component="img"
                  sx={{ width: 'max-content', height: 'max-content', objectFit: 'fill' }}
                  image={book.coverImage || 'default-image.jpg'}
                  alt={book.title}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Author(s): {book.authors}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Publication Year: {book.publication}
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
                      {book.ratingCount} ratings
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      )}
    </>
  );
}
