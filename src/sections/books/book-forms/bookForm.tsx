'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Rating,
} from '@mui/material';
import axios from 'utils/axios';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
  onError,
}: IRetrieveBooksProps) {
  const [retrievedBooks, setRetrievedBooks] = useState<IRetrievedBook[]>([]);
  const [showRetrievedBooks, setShowRetrievedBooks] = useState<boolean>(false);
  const router = useRouter(); // Use next/navigation for App Router

  const handleMoreDetail = (isbn: string) => {
    router.push(`/books/${isbn}`); // Navigate to the single book page
  };

  useEffect(() => {
    setShowRetrievedBooks(false);
    setRetrievedBooks([]);
  }, [priority]);

  const validationSchema = priority === 1
    ? Yup.object().shape({
        value: Yup.string()
          .max(255)
          .matches(/^\d+$/, 'ISBN value must be a number')
          .required('ISBN is required'),
      })
    : Yup.object().shape({
        value: Yup.string()
          .max(255)
          .required('Value is required'),
      });

  return (
    <div>
      <Formik
        initialValues={{ value: '', submit: null }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const apiEndpoint =
            priority === 1
              ? `/books/isbns/${values.value}`
              : priority === 2
              ? `/books/author/${values.value}`
              : priority === 3
              ? `/books/title/${values.value}`
              : priority === 4
              ? `/books/rating/${values.value}`
              : '/books/pagination/offset';

          axios
            .get(apiEndpoint)
            .then((response) => {
              const results =
                response.data.results || [response.data.result];
              setRetrievedBooks(results.map((book: any) => ({
                isbn: book.isbn13 || 'N/A',
                title: book.title || 'Untitled',
                authors: book.authors || 'Unknown Authors',
                averageRating: book.ratings?.average || '0',
                ratingCount: book.ratings?.count || 0,
                coverImage: book.icons?.small || '',
                publication: book.publication || 'N/A',
              })));
              setShowRetrievedBooks(true);
              onSuccess();
              resetForm();
              setSubmitting(false);
            })
            .catch((error) => {
              onError(error.message || 'Error fetching books');
              setSubmitting(false);
            });
        }}
      >
        {({ handleSubmit, values, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="value"
              value={values.value}
              onChange={handleChange}
              placeholder="Search for books"
            />
            <button type="submit">Retrieve Books</button>
          </form>
        )}
      </Formik>

      {showRetrievedBooks && (
        <Grid container spacing={2}>
          {retrievedBooks.map((book) => (
            <Grid item xs={12} sm={6} key={book.isbn}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{book.title}</Typography>
                  <Typography variant="body1">Author(s): {book.authors}</Typography>
                  <Typography variant="body1">ISBN: {book.isbn}</Typography>
                  <Typography variant="body1">Publication Year: {book.publication}</Typography>
                  <Box display="flex" alignItems="center">
                    <Rating
                      value={Number(book.averageRating)}
                      precision={0.1}
                      readOnly
                    />
                    <Typography>{`(${book.ratingCount})`}</Typography>
                  </Box>
                  <Button
                    onClick={() => handleMoreDetail(book.isbn)}
                    variant="contained"
                    color="primary"
                  >
                    More Detail
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}
