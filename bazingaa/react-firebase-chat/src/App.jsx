import React, { useState, useEffect } from 'react';
import Login from '../components/login_page/login';
import Chat from '../components/chat/chat';
import Register from '../components/register_page/register';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { allUsers } from '../database/curruser';

const App = () => {
  const { curruser, userinfo } = allUsers();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    setIsAuthenticated(!!curruser);
  }, [curruser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/chat" 
          element={isAuthenticated ? <Chat /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
