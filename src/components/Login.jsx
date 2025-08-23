// import React, { useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import {
//   Button,
//   Container,
//   Form as BootstrapForm,
//   Alert,
//   NavLink,
//   Row,
//   Col
// } from 'react-bootstrap';
// import { object, string } from 'yup'; // ✅ Use named imports instead of `* as Yup`
// import { FaUser, FaLock, FaGoogle } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import AnimateText from './AnimateText/AnimateText';

// const LoginSchema = object({
//   username: string().required('Username is required'),
//   password: string()
//     .min(6, 'Password must be at least 6 characters')
//     .required('Password is required')
// });

// export default function Login() {
//   const [serverError, setServerError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await fetch(`/api/signin`, {
//         credentials: 'include',
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(values)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Login failed');
//       }

//       setSuccessMessage(data.message || 'Login successful');
//       setServerError('');
//       navigate('/');
//     } catch (err) {
//       setServerError(err.message);
//       setSuccessMessage('');
//       localStorage.removeItem('username');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className="overlay_screenshot"
//       style={{
//         backgroundAttachment: 'fixed',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         backgroundImage: 'url(/screenshot.png)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%'
//       }}
//     >
//       <Container
//         className="d-flex flex-column align-items-center justify-content-center"
//         style={{ minHeight: '100vh', maxWidth: '500px', zIndex: 50 }}
//       >
//         <Row className="w-100 shadow p-2 rounded bg-dark">
//           <AnimateText texts={['J U S T C H A T', "Let's Chat", 'C O N N E C T']} />
//         </Row>
//         <Row className="w-100 shadow p-4 rounded bg-white">
//           <Col>
//             <h2 className="text-center mb-4" style={{ fontFamily: 'Cinzel' }}>
//               Login
//             </h2>

//             {serverError && <Alert variant="danger">{serverError}</Alert>}
//             {successMessage && <Alert variant="success">{successMessage}</Alert>}

//             <Formik
//               initialValues={{ username: '', password: '' }}
//               validationSchema={LoginSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ isSubmitting }) => (
//                 <Form>
//                   <BootstrapForm.Group className="mb-3">
//                     <BootstrapForm.Label style={{ fontFamily: 'Cinzel' }} className="fs-5">
//                       <FaUser className="me-2" />
//                       Username
//                     </BootstrapForm.Label>
//                     <Field type="text" name="username" className="form-control" />
//                     <ErrorMessage name="username" component="div" className="text-danger" />
//                   </BootstrapForm.Group>

//                   <BootstrapForm.Group className="mb-3">
//                     <BootstrapForm.Label style={{ fontFamily: 'Cinzel' }} className="fs-5">
//                       <FaLock className="me-2" />
//                       Password
//                     </BootstrapForm.Label>
//                     <Field type="password" name="password" className="form-control" />
//                     <ErrorMessage name="password" component="div" className="text-danger" />
//                   </BootstrapForm.Group>

//                   <div className="d-grid mb-3">
//                     <Button
//                       style={{ fontFamily: 'Jost' }}
//                       type="submit"
//                       disabled={isSubmitting}
//                       variant="primary"
//                       className="fs-5"
//                     >
//                       {isSubmitting ? 'Logging in...' : 'Login'}
//                     </Button>
//                   </div>

//                   <div className="d-grid mb-3">
//                     <NavLink
//                       href="/api/google"
//                       style={{
//                         fontFamily: 'Jost',
//                         width: '100%',
//                         borderRadius: '10px',
//                         color: 'white'
//                       }}
//                       className="bg-primary fs-5 mt-2 p-2 mx-auto text-center btn btn-outline-primary text-center d-flex align-items-center justify-content-center"
//                     >
//                       <FaGoogle className="me-2" /> Sign In with Google
//                     </NavLink>
//                   </div>

//                   <div className="text-center mt-3">
//                     <span style={{ fontFamily: 'Raleway' }}>Don’t have an account? </span>
//                     <NavLink
//                       href="/signup"
//                       className="text-primary"
//                       style={{
//                         fontFamily: 'Raleway',
//                         fontWeight: 'bold'
//                       }}
//                     >
//                       Sign up
//                     </NavLink>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Button,
  Container,
  Form as BootstrapForm,
  Alert,
  NavLink,
  Row,
  Col
} from 'react-bootstrap';
import { object, string } from 'yup';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AnimateText from './AnimateText/AnimateText';

const LoginSchema = object({
  username: string().email('Enter a valid email').required('Email is required'),
  password: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

export default function Login() {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`/api/signin`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccessMessage(data.message || 'Login successful');
      setServerError('');
      navigate('/');
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
            <h3 className="text-center mb-1">JUSTCHAT</h3>
            <p className="text-center text-muted mb-4">C'mon let's chat. 🚀</p>

            {serverError && <Alert variant="danger">{serverError}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            {/* Google login button */}
            <div className="d-grid mb-3">
              <NavLink
                href="/api/google"
                className="btn btn-light fs-5 p-2 border d-flex align-items-center justify-content-center"
              >
                <FaGoogle className="me-2" /> Login with Google
              </NavLink>
            </div>

            {/* Divider */}
            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="mx-2 text-muted">OR</span>
              <hr className="flex-grow-1" />
            </div>

            {/* Form */}
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  {/* Email */}
                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Username</BootstrapForm.Label>
                    <Field
                      type="name"
                      name="username"
                      className="form-control"
                      placeholder="Enter your username"
                    />
                    <ErrorMessage name="username" component="div" className="text-danger" />
                  </BootstrapForm.Group>

                  {/* Password */}
                  <BootstrapForm.Group className="mb-3">
                    <div className="d-flex justify-content-between">
                      <BootstrapForm.Label>Password</BootstrapForm.Label>
                      <NavLink href="/forgot-password" className="text-primary">
                        Forgot your password?
                      </NavLink>
                    </div>
                    <Field
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </BootstrapForm.Group>

                  {/* Login button */}
                  <div className="d-grid mb-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="fs-5"
                      style={{
                        backgroundColor: '#008000', //'#9b59b6',
                        border: 'none'
                      }}
                    >
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                  </div>

                  {/* Signup link */}
                  <div className="text-center mt-3">
                    <span>Don’t have an account? </span>
                    <NavLink href="/signup" className="text-primary fw-bold">
                      create a new account
                    </NavLink>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
