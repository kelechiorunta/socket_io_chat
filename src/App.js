import logo from './logo.svg';
import './App.css';
import ChatApp from './components/ChatApp.jsx';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './components/Login.jsx';
import { useTheme } from './components/ThemeContext.js';

function App() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    // <Routes>
    //   <Routes element={<ProtectedRoute />}>
    //     <Route path="/"
    //       element={
    //         <div className="App">
    //           <ChatApp/>
    //         </div>
    //       } />
    //   </Routes>
    //   <Route path="/login" element={<Login />} />
    // </Routes>
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={
          <div className="App">
              <ChatApp/>
            </div>
          } />
      </Route>
     
        <Route path="/login" element={<Login />} />
        
    </Routes>
    
  );
}

export default App;
