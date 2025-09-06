import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
// import {
//   Button,
//   Container,
//   Form as BootstrapForm,
//   Alert,
//   NavLink,
//   Row,
//   Col
// } from 'react-bootstrap';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  Link
} from '@mui/material';
// import { Formik, Form, ErrorMessage } from 'formik';
import { Email, Person, Lock } from '@mui/icons-material';
import { object, string } from 'yup';
// import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SignUpSchema = object({
  email: string().email('Invalid email').required('Email is required'),
  username: string().required('Username is required'),
  password: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

export default function SignUp() {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('/api/signup', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSuccessMessage(data.message || 'Signup successful');
      setServerError('');
      navigate('/');
    } catch (err) {
      setServerError(err.message);
      setSuccessMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // <Container
    //   className="d-flex flex-column align-items-center justify-content-center"
    //   style={{ minHeight: '100vh', maxWidth: '500px' }}
    // >
    //   <Row className="w-100 shadow p-4 rounded bg-white">
    //     <Col>
    //       <h2 className="text-center mb-4" style={{ fontFamily: 'Cinzel' }}>
    //         Sign Up
    //       </h2>

    //       {serverError && <Alert variant="danger">{serverError}</Alert>}
    //       {successMessage && <Alert variant="success">{successMessage}</Alert>}

    //       <Formik
    //         initialValues={{ email: '', username: '', password: '' }}
    //         validationSchema={SignUpSchema}
    //         onSubmit={handleSubmit}
    //       >
    //         {({ isSubmitting }) => (
    //           <Form>
    //             <BootstrapForm.Group className="mb-3">
    //               <BootstrapForm.Label className="fs-5" style={{ fontFamily: 'Cinzel' }}>
    //                 <FaEnvelope className="me-2" />
    //                 Email
    //               </BootstrapForm.Label>
    //               <Field type="email" name="email" className="form-control" />
    //               <ErrorMessage name="email" component="div" className="text-danger" />
    //             </BootstrapForm.Group>

    //             <BootstrapForm.Group className="mb-3">
    //               <BootstrapForm.Label className="fs-5" style={{ fontFamily: 'Cinzel' }}>
    //                 <FaUser className="me-2" />
    //                 Username
    //               </BootstrapForm.Label>
    //               <Field type="text" name="username" className="form-control" />
    //               <ErrorMessage name="username" component="div" className="text-danger" />
    //             </BootstrapForm.Group>

    //             <BootstrapForm.Group className="mb-3">
    //               <BootstrapForm.Label className="fs-5" style={{ fontFamily: 'Cinzel' }}>
    //                 <FaLock className="me-2" />
    //                 Password
    //               </BootstrapForm.Label>
    //               <Field type="password" name="password" className="form-control" />
    //               <ErrorMessage name="password" component="div" className="text-danger" />
    //             </BootstrapForm.Group>

    //             <div className="d-grid mb-3">
    //               <Button
    //                 type="submit"
    //                 disabled={isSubmitting}
    //                 variant="primary"
    //                 className="fs-5"
    //                 style={{ fontFamily: 'Cinzel' }}
    //               >
    //                 {isSubmitting ? 'Signing up...' : 'Sign Up'}
    //               </Button>
    //             </div>

    //             {/* <div className="d-grid mb-3">
    //               <NavLink
    //                 href="/google"
    //                 className="bg-primary fs-5 mt-2 p-2 mx-auto text-center btn btn-outline-primary d-flex align-items-center justify-content-center"
    //                 style={{
    //                   fontFamily: 'Cinzel',
    //                   width: '100%',
    //                   borderRadius: '10px',
    //                   color: 'white'
    //                 }}
    //               >
    //                 <FaGoogle className="me-2" />
    //                 Sign Up with Google
    //               </NavLink>
    //             </div> */}

    //             <div className="text-center mt-3">
    //               <span style={{ fontFamily: 'Cinzel' }}>Already have an account? </span>
    //               <NavLink
    //                 href="/login"
    //                 className="text-primary"
    //                 style={{
    //                   fontFamily: 'Cinzel',
    //                   fontWeight: 'bold'
    //                 }}
    //               >
    //                 Login
    //               </NavLink>
    //             </div>
    //           </Form>
    //         )}
    //       </Formik>
    //     </Col>
    //   </Row>
    // </Container>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#121212"
      px={2}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 420,
          bgcolor: '#1e1e1e',
          color: 'white'
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontFamily: 'Cinzel', fontWeight: 'bold', mb: 2 }}
        >
          Sign Up
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {serverError}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Formik
          initialValues={{ email: '', username: '', password: '' }}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values, isSubmitting, touched, errors }) => (
            <Form noValidate>
              {/* Email */}
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={<ErrorMessage name="email" />}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'grey.400' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  bgcolor: '#2c2c2c',
                  borderRadius: 2,
                  input: { color: 'white' },
                  label: { color: 'grey.400' }
                }}
              />

              {/* Username */}
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                type="text"
                value={values.username}
                onChange={handleChange}
                error={touched.username && Boolean(errors.username)}
                helperText={<ErrorMessage name="username" />}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'grey.400' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  bgcolor: '#2c2c2c',
                  borderRadius: 2,
                  input: { color: 'white' },
                  label: { color: 'grey.400' }
                }}
              />

              {/* Password */}
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={<ErrorMessage name="password" />}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'grey.400' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  bgcolor: '#2c2c2c',
                  borderRadius: 2,
                  input: { color: 'white' },
                  label: { color: 'grey.400' }
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  mt: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontFamily: 'Cinzel',
                  bgcolor: '#bb86fc',
                  '&:hover': { bgcolor: '#9c4dcc' }
                }}
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </Button>

              {/* Already have account? */}
              <Typography variant="body2" align="center" sx={{ mt: 3, fontFamily: 'Cinzel' }}>
                Already have an account?{' '}
                <Link href="/login" underline="hover" sx={{ color: '#bb86fc', fontWeight: 'bold' }}>
                  Login
                </Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
}
