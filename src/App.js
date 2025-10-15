import React from 'react';
import './App.css';
import ChatApp from './components/ChatApp.jsx';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import ForgotPassword from './ForgotPassword/ForgotPassword.jsx';

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <div className="App">
              <ChatApp />
            </div>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
