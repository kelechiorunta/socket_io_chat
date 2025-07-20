import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('https://socketiochat-production.up.railway.app/isAuthenticated', {
          credentials: 'include', // 🔥 Send session cookie
          method: 'GET',
        });

        const data = await res.json();

        if (!res.ok || !data.user) {
          throw new Error(data.error || 'Unauthorized');
        }

        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed:', err.message);
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('entry'); // optional
      }
    };

    checkAuth();
  }, []);

  // 🌀 While checking auth
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // ❌ Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ path: location.pathname }} replace />;
  }

  // ✅ Authenticated: expose user to nested routes
  return <Outlet context={currentUser} />;
}


// import React from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { AUTH } from '../graphql/queries';
// import { useQuery } from '@apollo/client';
// import { Modal, Spinner } from 'react-bootstrap';

// export default function ProtectedRoute() {
//   const location = useLocation();
//   const { loading, error, data } = useQuery(AUTH);

//   if (loading) {
//     return (
//       <Modal show centered backdrop="static" keyboard={false}>
//         <Modal.Body
//           className="d-flex flex-column align-items-center justify-content-center"
//           style={{
//             padding: '2rem',
//             fontFamily: 'Segoe UI, Roboto, sans-serif',
//             fontSize: '1.1rem',
//             textAlign: 'center',
//             minHeight: '200px',
//           }}
//         >
//           <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }} />
//           <div className="mt-4" style={{ fontWeight: '500', color: '#333' }}>
//             Authenticating, please wait...
//           </div>
//         </Modal.Body>
//       </Modal>
//     );
//   }

//   if (error || !data) {
//     return <Navigate to="/login" state={{ path: location.pathname }} replace />;
//   }

//   return <Outlet context={data?.auth} />;
// }
