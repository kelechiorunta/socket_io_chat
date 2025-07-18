
import './App.css';
import ChatApp from './components/ChatApp.jsx';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './components/Login.jsx';


function App() {

  return (
    
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
