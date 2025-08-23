// import React from 'react';

// export default function ForgotPassword() {
//   return <div>ForgotPassword</div>;
// }

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Button,
  Container,
  Form as BootstrapForm,
  Alert,
  //   NavLink,
  Row,
  Col
} from 'react-bootstrap';
import { object, string } from 'yup';
// import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import AnimateText from '../components/AnimateText/AnimateText';

const emailSchema = object({
  email: string().email('Please enter a valid email address').required('Email is required')
});

export default function ForgotPassword() {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`/api/forgot_password`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || 'Mailer failed');
      }

      setSuccessMessage(data.message || 'Password reset request sent. Please check your email.');
      setServerError('');

      // redirect after 2s so user sees success
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setServerError(err.message);
      setSuccessMessage('');
      localStorage.removeItem('username');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="overlay_screenshot"
      style={{
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        backgroundImage: 'url(/screenshot.png)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Container
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '100vh', maxWidth: '400px', zIndex: 50 }}
      >
        {/* Top animation bar */}
        <Row className="w-100 shadow p-3 rounded bg-dark text-white text-center">
          <AnimateText texts={['J U S T C H A T', "Let's Chat", 'C O N N E C T']} />
        </Row>

        {/* Main card */}
        <Row className="w-100 shadow p-4 rounded bg-white mt-3">
          <Col>
            <h3 className="text-center mb-1">Forgot your password</h3>
            <p className="text-center text-muted mb-4">
              Please enter your email to reset your password
            </p>

            {serverError && <Alert variant="danger">{serverError}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            {/* Google login button */}
            {/* <div className="d-grid mb-3">
              <NavLink
                href="/api/google"
                className="btn btn-light fs-5 p-2 border d-flex align-items-center justify-content-center"
              >
                <FaGoogle className="me-2" /> Login with Google
              </NavLink>
            </div> */}

            {/* Divider */}
            {/* <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="mx-2 text-muted">OR</span>
              <hr className="flex-grow-1" />
            </div> */}

            {/* Form */}
            <Formik
              initialValues={{ email: '' }}
              validationSchema={emailSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  {/* Email */}
                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Email Address</BootstrapForm.Label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email address"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </BootstrapForm.Group>

                  {/* Login button */}
                  <div className="d-grid mb-3">
                    <Button
                      type="submit"
                      disabled={!values.email || isSubmitting}
                      className="fs-5"
                      style={{
                        backgroundColor: '#008000', //'#9b59b6',
                        border: 'none'
                      }}
                    >
                      {isSubmitting ? 'Sending Request to inbox...' : 'Reset Password'}
                    </Button>
                  </div>

                  {/* Signup link
                  <div className="text-center mt-3">
                    <span>Don’t have an account? </span>
                    <NavLink href="/signup" className="text-primary fw-bold">
                      create a new account
                    </NavLink>
                  </div> */}
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
