// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomizationProvider } from './context/CustomizationContext';
import Builder from './pages/Builder';
import Success from './pages/Success';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function App() {
  return (
    <CustomizationProvider>
      <PayPalScriptProvider
        options={{
          clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
          currency: 'USD',
          intent: 'capture',
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Builder />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </Router>
      </PayPalScriptProvider>
    </CustomizationProvider>
  );
}

export default App;
