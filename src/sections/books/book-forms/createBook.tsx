'use client';

import React from 'react';

// next

//material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

import axios from 'utils/axios';

export default function CreateBookForm({ onSuccess, onError }: { onSuccess: () => void; onError: (msg: string) => void }) {
  return (
    <>
      <Formik
        initialValues={{
          isbn13: '',
          authors: '',
          publicationYear: '',
          originalTitle: '',
          title: '',
          totalRatingCount: '',
          averageRating: '',
          oneStarRating: '',
          twoStarRating: '',
          threeStarRating: '',
          fourStarRating: '',
          fiveStarRating: '',
          largeImageURL: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
          smallImageURL: 'https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png',
          largeImageURL: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
          smallImageURL: 'https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          isbn13: Yup.string().required('ISBN is required'),
          authors: Yup.string().required('Authors are required'),
          publicationYear: Yup.number().required('Publication Year is required'),
          originalTitle: Yup.string().required('Original Title is required'),
          title: Yup.string().required('Title is required'),
          totalRatingCount: Yup.number().required('Total Rating Count is required'),
          averageRating: Yup.number().required('Average Rating is required'),
          oneStarRating: Yup.number().required('1 Star Rating Count is required'),
          twoStarRating: Yup.number().required('2 Star Rating Count is required'),
          threeStarRating: Yup.number().required('3 Star Rating Count is required'),
          fourStarRating: Yup.number().required('4 Star Rating Count is required'),
          fiveStarRating: Yup.number().required('5 Star Rating Count is required'),
          largeImageUrl: Yup.string().url('Invalid URL').required('Large Image URL is required'),
          smallImageUrl: Yup.string().url('Invalid URL').required('Small Image URL is required')
        })}
        onSubmit={(values, { setErrors, setSubmitting, resetForm }) => {
          console.dir(values);

          axios
            .post('/books', {
              entry: {
                isbn13: values.isbn13,
                authors: values.authors,
                publication: values.publicationYear,
                original_title: values.originalTitle,
                title: values.title,
                ratings: {
                  count: values.totalRatingCount,
                  average: values.averageRating,
                  rating1: values.oneStarRating,
                  rating2: values.twoStarRating,
                  rating3: values.threeStarRating,
                  rating4: values.fourStarRating,
                  rating5: values.fiveStarRating
                },
                icons: {
                  large: values.largeImageURL,
                  small: values.smallImageURL
                }
              }
            })
            .then((response) => {
              setSubmitting(false);
              resetForm({
                values: {
                  isbn13: '',
                  authors: '',
                  publicationYear: '',
                  originalTitle: '',
                  title: '',
                  totalRatingCount: '',
                  averageRating: '',
                  oneStarRating: '',
                  twoStarRating: '',
                  threeStarRating: '',
                  fourStarRating: '',
                  fiveStarRating: '',
                  largeImageURL: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
                  smallImageURL: 'https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png',
                  largeImageURL: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png',
                  smallImageURL: 'https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png',
                  submit: null
                }
              });
              onSuccess();
            })
            .catch((error) => {
              console.error(error);
              setErrors({ isbn13: error.message });
              setSubmitting(false);
              onError(error.message);
            });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="isbn13">Book&apos;s ISBN13</InputLabel>
                  <OutlinedInput
                    id="isbn13"
                    type="text"
                    value={values.isbn13}
                    name="isbn13"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the book's ISBN number"
                    fullWidth
                    error={Boolean(touched.isbn13 && errors.isbn13)}
                  />
                </Stack>
                {touched.isbn13 && errors.isbn13 && (
                  <FormHelperText error id="standard-weight-helper-text-isbn13-message-send">
                    {errors.isbn13}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="authors">Book&apos;s Authors</InputLabel>
                  <OutlinedInput
                    id="authors"
                    type="text"
                    value={values.authors}
                    name="authors"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the book's author(s), comma seperated"
                    fullWidth
                    error={Boolean(touched.authors && errors.authors)}
                  />
                </Stack>
                {touched.authors && errors.authors && (
                  <FormHelperText error id="standard-weight-helper-text-authors-message-send">
                    {errors.authors}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="publicationYear">Publication Year</InputLabel>
                  <OutlinedInput
                    id="publicationYear"
                    type="number"
                    value={values.publicationYear}
                    name="publicationYear"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the book's publication year"
                    fullWidth
                    error={Boolean(touched.publicationYear && errors.publicationYear)}
                  />
                </Stack>
                {touched.publicationYear && errors.publicationYear && (
                  <FormHelperText error id="standard-weight-helper-text-publicationYear-message-send">
                    {errors.publicationYear}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="originalTitle">Original Title</InputLabel>
                  <OutlinedInput
                    id="originalTitle"
                    type="text"
                    value={values.originalTitle}
                    name="originalTitle"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the book's original title"
                    fullWidth
                    error={Boolean(touched.originalTitle && errors.originalTitle)}
                  />
                </Stack>
                {touched.originalTitle && errors.originalTitle && (
                  <FormHelperText error id="standard-weight-helper-text-originalTitle-message-send">
                    {errors.originalTitle}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="title">Title</InputLabel>
                  <OutlinedInput
                    id="title"
                    type="text"
                    value={values.title}
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the book's title"
                    fullWidth
                    error={Boolean(touched.title && errors.title)}
                  />
                </Stack>
                {touched.title && errors.title && (
                  <FormHelperText error id="standard-weight-helper-text-title-message-send">
                    {errors.title}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="totalRatingCount">Total Ratings</InputLabel>
                  <OutlinedInput
                    id="totalRatingCount"
                    type="number"
                    value={values.totalRatingCount}
                    name="totalRatingCount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the total number of ratings"
                    fullWidth
                    error={Boolean(touched.totalRatingCount && errors.totalRatingCount)}
                  />
                </Stack>
                {touched.totalRatingCount && errors.totalRatingCount && (
                  <FormHelperText error id="standard-weight-helper-text-totalRatingCount-message-send">
                    {errors.totalRatingCount}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="averageRating">Average Rating</InputLabel>
                  <OutlinedInput
                    id="averageRating"
                    type="number"
                    value={values.averageRating}
                    name="averageRating"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the average rating"
                    fullWidth
                    error={Boolean(touched.averageRating && errors.averageRating)}
                  />
                </Stack>
                {touched.averageRating && errors.averageRating && (
                  <FormHelperText error id="standard-weight-helper-text-averageRating-message-send">
                    {errors.averageRating}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="oneStarRating">1 Star Rating</InputLabel>
                  <OutlinedInput
                    id="oneStarRating"
                    type="number"
                    value={values.oneStarRating}
                    name="oneStarRating"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the number of 1-star ratings"
                    fullWidth
                    error={Boolean(touched.oneStarRating && errors.oneStarRating)}
                  />
                </Stack>
                {touched.oneStarRating && errors.oneStarRating && (
                  <FormHelperText error id="standard-weight-helper-text-oneStarRating-message-send">
                    {errors.oneStarRating}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="twoStarRating">2 Star Rating</InputLabel>
                  <OutlinedInput
                    id="twoStarRating"
                    type="number"
                    value={values.twoStarRating}
                    name="twoStarRating"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the number of 2-star ratings"
                    fullWidth
                    error={Boolean(touched.twoStarRating && errors.twoStarRating)}
                  />
                </Stack>
                {touched.twoStarRating && errors.twoStarRating && (
                  <FormHelperText error id="standard-weight-helper-text-twoStarRating-message-send">
                    {errors.twoStarRating}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="threeStarRating">3 Star Rating</InputLabel>
                  <OutlinedInput
                    id="threeStarRating"
                    type="number"
                    value={values.threeStarRating}
                    name="threeStarRating"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the number of 3-star ratings"
                    fullWidth
                    error={Boolean(touched.threeStarRating && errors.threeStarRating)}
                  />
                </Stack>
                {touched.threeStarRating && errors.threeStarRating && (
                  <FormHelperText error id="standard-weight-helper-text-threeStarRating-message-send">
                    {errors.threeStarRating}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="fourStarRating">4 Star Rating</InputLabel>
                  <OutlinedInput
                    id="fourStarRating"
                    type="number"
                    value={values.fourStarRating}
                    name="fourStarRating"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the number of 4-star ratings"
                    fullWidth
                    error={Boolean(touched.fourStarRating && errors.fourStarRating)}
                  />
                </Stack>
                {touched.fourStarRating && errors.fourStarRating && (
                  <FormHelperText error id="standard-weight-helper-text-fourStarRating-message-send">
                    {errors.fourStarRating}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="fiveStarRating">5 Star Rating</InputLabel>
                  <OutlinedInput
                    id="fiveStarRating"
                    type="number"
                    value={values.fiveStarRating}
                    name="fiveStarRating"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the number of 5-star ratings"
                    fullWidth
                    error={Boolean(touched.fiveStarRating && errors.fiveStarRating)}
                  />
                </Stack>
                {touched.fiveStarRating && errors.fiveStarRating && (
                  <FormHelperText error id="standard-weight-helper-text-fiveStarRating-message-send">
                    {errors.fiveStarRating}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="largeImageURL">Large Image URL</InputLabel>
                  <OutlinedInput
                    id="largeImageURL"
                    type="string"
                    value={values.largeImageURL}
                    name="largeImageURL"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(touched.largeImageURL && errors.largeImageURL)}
                  />
                </Stack>
                {touched.largeImageURL && errors.largeImageURL && (
                  <FormHelperText error id="standard-weight-helper-text-largeImageURL-message-send">
                    {errors.largeImageURL}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="smallImageURL">Small Image URL</InputLabel>
                  <OutlinedInput
                    id="smallImageURL"
                    type="string"
                    value={values.smallImageURL}
                    name="smallImageURL"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(touched.smallImageURL && errors.smallImageURL)}
                  />
                </Stack>
                {touched.smallImageURL && errors.smallImageURL && (
                  <FormHelperText error id="standard-weight-helper-text-smallImageURL-message-send">
                    {errors.smallImageURL}
                  </FormHelperText>
                )}
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Add Book!
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
