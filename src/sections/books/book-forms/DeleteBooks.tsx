'use client';

import React, { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
}


export default function DeleteBooks({
  priority,
  onSuccess,
  onError
}: IDeleteBooksProps) {
  const [deletedBooks, setDeletedBooks] = useState<IDeletedBook[]>([]);

  
  const placeholderText = {
    1: "Enter ISBN Number",
    2: "Enter Author's Name",
    3: "Enter Book Title"
  };
  const labelText = {
    1: "ISBN Number",
    2: "Author's Name",
    3: "Book Title"
  };
  return (
    <>
      <Formik
        initialValues={{
          value: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          value: Yup.string().max(255).required(() => `${labelText[priority] || ''} value is required`),
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
                  title: result.title || 'Unkown Title',
                  authors: result.author || 'Unkown Author(s)',
                  averageRating: result.ratings?.average || 'No Rating',
                  ratingCount: result.ratings?.count || 0,
                  coverImage: result.icons?.large || '',
                };
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
                }));
                setDeletedBooks(deletedBookDetails);

              } else {
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
            });
        }}
        >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name">Delete by {labelText[priority]}</InputLabel>
                  <OutlinedInput
                    id="book-name"
                    type="text"
                    value={values.value}
                    name="value"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={placeholderText[priority] || "Enter value"}
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
                    SEND!
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      {deletedBooks.length > 0 && (
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <Typography variant="h6">Deleted Books:</Typography>
            <Grid container spacing={2}>
                {deletedBooks.map((book, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Typography variant="body1">
                      <strong>Title:</strong> {book.title}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Authors:</strong> {book.authors}
                    </Typography>
                    <Typography variant="body2">
                      <strong>ISBN:</strong> {book.isbn}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Average Rating:</strong> {book.averageRating} ({book.ratingCount} ratings)
                    </Typography>
                    {book.coverImage && (
                      <img
                        src={book.coverImage}
                        alt={book.title || 'Cover'}
                        style={{ maxWidth: '100px', marginTop: '10px' }}
                      />
                    )}
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      )}

    </>
  );
}
