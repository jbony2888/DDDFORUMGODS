import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/mainPage';
import { RegisterPage } from './pages/registerPage';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <meta name="color-scheme" content="light only" />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

