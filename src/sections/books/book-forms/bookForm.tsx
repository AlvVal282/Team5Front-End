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
import { Card, CardContent, Rating, Box, TextField } from '@mui/material';


// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

import axios from 'utils/axios';
//import { width } from '@mui/system';
//import { useRouter } from 'next/router';

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
  const [nextPageOffset, setNextPageOffset] = useState<number | null>(null); // Next page offset
  const router = useRouter();

  const handleMoreDetail = (isbn: string) => {
     //Move the navigation logic to a function
    router.push(`/books/single-book/${isbn}`);
  };

 // Optional: Add input fields for limit and offset
 
  

  useEffect(() => {
    setShowRetrievedBooks(false);
    setRetrievedBooks([]);
  }, [priority]);

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
  const handleNextPage = (submitForm: any) => {
    if (nextPageOffset !== null) {
      setOffset(nextPageOffset); // Use nextPage from the backend
    }
    submitForm();
  };

  const handlePreviousPage = (submitForm: any) => {
    setOffset((prevOffset) => Math.max(0, prevOffset - limit));
    submitForm();
  };

  const validationString = Yup.object().shape({
    value: Yup.string()
      .max(255, "Maximum length is 255 characters")
      .required(() => `${labelText[priority - 1]} value is required`),
  });
  
  const validationNumber = Yup.object().shape({
    value: Yup.string()
      .max(255, "Maximum length is 255 characters")
      .matches(/^\d+$/, "ISBN value must be a number")
      .required(() => `${labelText[priority - 1]} value is required`),
  });
  
  const validationPriority5 = Yup.object().shape({
    limit: Yup.number()
      .min(1, "Limit must be at least 1")
      .required("Limit is required"),
    offset: Yup.number()
      .min(0, "Offset cannot be negative")
      .required("Offset is required"),
  });
  // Validation schema for rating search
  const validationRatingSearch = Yup.object().shape({
    min: Yup.number()
      .min(1, "Minimum rating must be between 1 and 5")
      .max(5, "Minimum rating must be between 1 and 5")
      .required("Minimum rating is required"),
    max: Yup.number()
      .min(1, "Maximum rating must be between 1 and 5")
      .max(5, "Maximum rating must be between 1 and 5")
      .required("Maximum rating is required"),
  });
  
  //const totalPages = Math.ceil(totalRecords / limit);
  return (
    <>
      <Formik
        initialValues={{
          value: '',
          submit: null,
          limit: '',
          offset: '',
          min: '',
          max: '',
          order: ''
        }}
        
        validationSchema={priority === 1
          ? validationNumber
          : priority === 5
          ? validationPriority5
          : priority === 4 
          ? validationRatingSearch
          : validationString
        }
        onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
          let apiEndpoint = '';
          
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
              apiEndpoint = `/books/rating`;
              break;
            case 5:
              apiEndpoint = '/books/pagination/offset';
              
              break;
            default:
              onError('Invalid search type');
              setSubmitting(false);
              return;
          }
          const endpoint = priority === 5 
          ? axios.post(apiEndpoint, { limit: values.limit  , offset: values.offset  })
          : priority === 4 
          ? axios.post(apiEndpoint, { min: values.min, max: values.max, order: values.order }) 
          : axios.get(apiEndpoint);
            
          endpoint
            //get(apiEndpoint)
            .then((response) => {
              //console.log('Request body:', body);
              //console.log('API Response:', response.data);
              setSubmitting(false);
              
              
              let results = [];
              if (priority === 5) {
                
                results = response.data.results || [];
                const pagination = response.data.pagination || {};
                setTotalRecords(pagination.totalRecords || 0);
                setNextPageOffset(pagination.nextPage || null); // Update the nextPage offset
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
            {priority === 4 && (
              <Stack spacing={2} sx={{ width: '100%' }}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Min Rating"
                    type="number"
                    name="min"
                    value={values.min}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{ inputProps: { min: 1, max: 5 } }}
                    error={Boolean(touched.min && errors.min)}
                    helperText={touched.min && errors.min ? errors.min : ''}
                    fullWidth
                  />
                  <TextField
                    label="Max Rating"
                    type="number"
                    name="max"
                    value={values.max}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{ inputProps: { min: 1, max: 5 } }}
                    error={Boolean(touched.max && errors.max)}
                    helperText={touched.max && errors.max ? errors.max : ''}
                    fullWidth
                  />
                </Stack>
                  <TextField
                    select
                    label="Order"
                    name="order"
                    value={values.order}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.order && errors.order)}
                    helperText={touched.order && errors.order ? errors.order : ''}
                    SelectProps={{
                      native: true,
                    }}
                    fullWidth
                  >
                    <option value="" disabled>
                      Select Order
                    </option>
                    <option value="min-first">Min-First</option>
                    <option value="max-first">Max-First</option>
                  </TextField>
                </Stack>
              )}

            {/* Custom logic for priority 5 */}
            {priority === 5 && (
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Limit"
                  type="number"
                  name='limit'
                  value={values.limit}
                  //onChange={handleChange}
                  onChange={(e) => {
                    const newLimit = Math.max(1, parseInt(e.target.value, 10) || 1);
                    setLimit(newLimit); // Update limit
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                />
                <TextField
                  label="Offset"
                  type="number"
                  name='offset'
                  value={values.offset}
                  //onChange={handleChange}
                  onChange={(e) => {
                    const newOffset = Math.max(0, parseInt(e.target.value, 10) || 0);
                    setOffset(newOffset); // Update offset
                    handleChange(e); // Update formik value
                  }}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Stack>
            )}
          {priority !== 5 && priority !==4 &&(
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
              //disabled={!values.value.trim()} 
              sx={{ height: '42px' }} // Match the height of the input field
            >
              {priority === 5 ? 'RETRIEVE ALL BOOKS' : 'RETRIEVE'}
            </Button>
          </AnimateButton>
          {priority === 5 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, height: '42px'}}>
                <Button
                  onClick={() => handlePreviousPage(handleSubmit)}
                  disabled={offset === 0} 
                >
                  Previous Page
                </Button>
                <Button
                  onClick={() => handleNextPage(handleSubmit)}
                  disabled={nextPageOffset === null || nextPageOffset >= totalRecords}
                
                >
                  Next Page
                </Button>
              </Box>
            )}
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
                        onClick={() => handleMoreDetail(book.isbn)}
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
