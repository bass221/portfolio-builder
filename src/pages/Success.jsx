// src/pages/Success.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateHTMLFile } from '../utils/generateHTML';
import axios from 'axios';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(null);
  const [canDownload, setCanDownload] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    let data = location.state?.formData;

    // Fallback to localStorage if state is missing
    if (!data) {
      try {
        const stored = localStorage.getItem('formData');
        if (stored) data = JSON.parse(stored);
      } catch (err) {
        console.error('Error parsing localStorage data:', err);
      }
    }

    if (data && typeof data === 'object') {
      if (!Array.isArray(data.skills)) {
        data.skills = typeof data.skills === 'string'
          ? data.skills.split(',').map(s => s.trim())
          : [];
      }
      setFormData(data);
      verifyPayment(); // only verify if data found
    } else {
      navigate('/');
    }

    async function verifyPayment(retries = 5) {
      const urlParams = new URLSearchParams(location.search);
      const sessionId = urlParams.get('session_id');
      if (!sessionId) return navigate('/');

      for (let i = 0; i < retries; i++) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/verify-session?session_id=${sessionId}`);
          if (res.data.success) {
            setCanDownload(true);
            setVerifying(false);
            return;
          }
        } catch (error) {
          console.warn(`Retry ${i + 1} failed:`, error.message);
        }
        // wait 1.5s between retries
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Failed after all retries
      alert("Payment verification failed or expired.");
      navigate('/');
    }
  }, [location, navigate]);

  const handleDownload = () => {
    if (!formData) {
      alert('No form data found. Please rebuild your portfolio.');
      return;
    }

    if (!canDownload) {
      alert('Payment not verified. Please try again.');
      return;
    }

    try {
      generateHTMLFile(formData);
    } catch (err) {
      console.error('Download error:', err);
      alert('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gold mb-2">🎉 Success!</h1>
      <p className="text-white text-lg mb-6">
        {verifying
          ? "Verifying your payment..."
          : "Your portfolio is ready to download."}
      </p>

      <button
        onClick={handleDownload}
        disabled={!canDownload}
        className={`px-6 py-2 rounded-xl font-semibold mb-4 transition ${
          canDownload
            ? "bg-gold text-black hover:bg-yellow-400"
            : "bg-gray-600 text-gray-300 cursor-not-allowed"
        }`}
      >
        {canDownload ? "Download Portfolio" : "Verifying..."}
      </button>

      <button
        onClick={() => navigate('/')}
        className="text-sm underline text-gold hover:text-yellow-400 transition"
      >
        Return to Builder
      </button>
    </div>
  );
};

export default Success;
