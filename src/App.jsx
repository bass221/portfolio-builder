// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Builder from './pages/Builder';
import Success from './pages/Success';
import { CustomizationProvider } from './context/CustomizationContext';

const App = () => {
  return (
    <CustomizationProvider>
      <Routes>
        <Route path="/" element={<Builder />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </CustomizationProvider>
  );
};

export default App;
