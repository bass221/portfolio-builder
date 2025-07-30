import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomizationProvider } from './context/CustomizationContext';
import Builder from './pages/Builder';
import Success from './pages/Success';

function App() {
  return (
    <CustomizationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Builder />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Router>
    </CustomizationProvider>
  );
}

export default App;
