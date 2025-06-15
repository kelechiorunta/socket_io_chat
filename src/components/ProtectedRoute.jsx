import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AUTH } from '../graphql/queries';
import { useQuery } from '@apollo/client';

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading, true/false: result
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const { loading, error, data } = useQuery(AUTH)

  useEffect(() => {
    const authStatus = async () => {
      try {
        const response = await fetch('http://localhost:7334/isAuthenticated', {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok || !data.user) {
          throw new Error(data.error || 'Unauthorized');
        }

        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('entry');
      }
    };

    authStatus();
  }, []);

  // Show loading while authentication is being checked
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Replace with spinner if needed
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ path: location.pathname }} replace />;
  }

  // If authenticated, render child routes
  return <Outlet context={{ currentUser }} />;
}