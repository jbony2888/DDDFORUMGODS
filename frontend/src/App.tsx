import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/mainPage';
import { RegisterPage } from './pages/registerPage';
import { LoginPage } from './pages/loginPage';
import { ProtectedRoute } from './components/protectedRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <meta name="color-scheme" content="light only" />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
