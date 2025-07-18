import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Button,
  Container,
  Form as BootstrapForm,
  Alert,
  NavLink,
  Row,
  Col,
} from 'react-bootstrap';
import { object, string } from 'yup'; // ✅ Use named imports instead of `* as Yup`
import { FaUser, FaLock, FaGoogle } from 'react-icons/fa';

const LoginSchema = object({
  username: string().required('Username is required'),
  password: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`/signin`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccessMessage(data.message || 'Login successful');
      setServerError('');
      window.location.href = '/';
    } catch (err) {
      setServerError(err.message);
      setSuccessMessage('');
      localStorage.removeItem('username');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '100vh', maxWidth: '500px' }}
    >
      <Row className="w-100 shadow p-4 rounded bg-white">
        <Col>
          <h2 className="text-center mb-4" style={{ fontFamily: 'Cinzel' }}>
            Login
          </h2>

          {serverError && <Alert variant="danger">{serverError}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label
                    style={{ fontFamily: 'Cinzel' }}
                    className="fs-5"
                  >
                    <FaUser className="me-2" />
                    Username
                  </BootstrapForm.Label>
                  <Field type="text" name="username" className="form-control" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger"
                  />
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label
                    style={{ fontFamily: 'Cinzel' }}
                    className="fs-5"
                  >
                    <FaLock className="me-2" />
                    Password
                  </BootstrapForm.Label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </BootstrapForm.Group>

                <div className="d-grid mb-3">
                  <Button
                    style={{ fontFamily: 'Cinzel' }}
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    className="fs-5"
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </div>

                <div className="d-grid mb-3">
                  <NavLink
                    href="/google"
                    style={{
                      fontFamily: 'Cinzel',
                      width: '100%',
                      borderRadius: '10px',
                      color: 'white',
                    }}
                    className="bg-primary fs-5 mt-2 p-2 mx-auto text-center btn btn-outline-primary text-center d-flex align-items-center justify-content-center"
                  >
                    <FaGoogle className="me-2" /> Sign In with Google
                  </NavLink>
                </div>

                <div className="text-center mt-3">
                  <span style={{ fontFamily: 'Cinzel' }}>
                    Don’t have an account?{' '}
                  </span>
                  <NavLink
                    href="/signup"
                    className="text-primary"
                    style={{
                      fontFamily: 'Cinzel',
                      fontWeight: 'bold',
                    }}
                  >
                    Sign up
                  </NavLink>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}

