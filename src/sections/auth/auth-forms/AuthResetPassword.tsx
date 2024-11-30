'use client';

import { useEffect, useState, SyntheticEvent } from 'react';
import { signIn } from 'next-auth/react';

// next
import { useRouter } from 'next/navigation';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { preload } from 'swr';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { APP_DEFAULT_PATH } from 'config';
import { fetcher } from 'utils/axios';

import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { StringColorProps } from 'types/password';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| STATIC - RESET PASSWORD ||============================ //

export default function AuthResetPassword() {
  // const scriptedRef = useScriptRef();
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');

  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        username: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Username is required'),
        oldPassword: Yup.string().required('Old Password is required'),
        newPassword: Yup.string().max(255).required('Password is required'),
        confirmPassword: Yup.string()
          .required('Confirm Password is required')
          .test('confirmPassword', 'Both Password must match!', (confirmPassword, yup) => yup.parent.newPassword === confirmPassword)
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        const trimmedusername = values.username.trim();
          signIn('reset-password', {
            redirect: false,
            username: trimmedusername,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            callbackUrl: APP_DEFAULT_PATH
          }).then(
            (res: any) => {
              if (res?.error) {
                setErrors({ submit: res.error });
                setSubmitting(false);
              } else {
                setSuccessMessage('Your password has been successfully changed!');
                setSubmitting(false);
                setTimeout(() => {
                  router.push('/sample-page');
                }, 2000);
              }
            },
            (res) => {
              setErrors({ submit: res.error });
              setSubmitting(false);
            }
          );
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="username">Username</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                    id="username"
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Username"
                  />
              </Stack>
              {touched.username && errors.username && (
              <FormHelperText error id="helper-text-username">
                {errors.username}
              </FormHelperText>
              )}
            </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="old-password">Old Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.oldPassword && errors.oldPassword)}
                  id="old-password"
                  type="password"
                  value={values.oldPassword}
                  name="oldPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter Old password"
                />
              </Stack>
              {touched.oldPassword && errors.oldPassword && (
              <FormHelperText error id="helper-text-old-password">
                {errors.oldPassword}
              </FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="new-password">New Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.newPassword}
                  name="newPassword"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter New Password"
                />
              </Stack>
              {touched.newPassword && errors.newPassword && (
                <FormHelperText error id="helper-text-new-password">
                  {errors.newPassword}
                </FormHelperText>
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="confirm-password-reset">Confirm New Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  id="confirm-password-reset"
                  type="password"
                  value={values.confirmPassword}
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter Confirm Password"
                />
              </Stack>
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="helper-text-confirm-password-reset">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              {successMessage && (
                <Typography variant="body2" color="success.main" align="center">
                  {successMessage}
                </Typography>
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
                  Reset Password
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}