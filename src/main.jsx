import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/input.css';
import { CustomizationProvider } from './context/CustomizationContext.jsx'; // ✅ CORRECT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CustomizationProvider>
      <App />
    </CustomizationProvider>
  </React.StrictMode>
);
