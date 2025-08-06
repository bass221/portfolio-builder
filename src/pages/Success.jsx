import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { generateHTMLFile } from '../utils/generateHTML';

export default function Success() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  // ✅ Validate form structure
  const isFormValid = (data) => {
    const requiredFields = ['name', 'role', 'location', 'bio', 'contact'];
    const basicValid = requiredFields.every(field => data[field]);

    const projectsValid = data.template !== 'creative' || (
      Array.isArray(data.projects) &&
      data.projects.every(p => p.title && p.link)
    );

    return basicValid && projectsValid;
  };

useEffect(() => {
  const sessionId = new URLSearchParams(window.location.search).get('session_id');

  if (!sessionId) {
    alert('⚠️ No session ID found.');
    return navigate('/');
  }

  const verifySession = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/verify-stripe-session?session_id=${sessionId}`
      );

      const { success, formData } = res.data;

      if (!success || !formData || !isFormValid(formData)) {
        alert('❌ Invalid or incomplete form data.');
        return navigate('/');
      }

      setFormData(formData);
      localStorage.setItem('formData', JSON.stringify(formData));
      generateHTMLFile(formData);
      setIsGenerating(false);

    } catch (err) {
      console.error('❌ Stripe verification error:', err);
      alert('❌ Payment verification failed.');
      navigate('/');
    }
  };

  verifySession();
}, [navigate]);


  // 🧹 Optional: clear data after generation
  useEffect(() => {
    if (formData) {
      localStorage.removeItem('formData'); // ❌ Comment out if you want to keep it for redownloads
    }
  }, [formData]);

  const handleRedownload = () => {
    const saved = localStorage.getItem('formData');
    if (saved) {
      try {
        generateHTMLFile(JSON.parse(saved));
      } catch (err) {
        alert('❌ Failed to re-generate file.');
      }
    } else {
      alert('⚠️ No saved form data found.');
    }
  };

  const handleClearAndReturn = () => {
    localStorage.removeItem('formData');
    alert('🧹 Data cleared.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-yellow-400 mb-2">🎉 Payment Successful!</h1>
      <p className="text-lg mb-4">
        {isGenerating ? 'Generating your portfolio...' : 'Your portfolio is ready ✅'}
      </p>

      {!isGenerating && (
        <>
          <button
            onClick={handleRedownload}
            className="px-6 py-2 rounded-xl font-semibold mb-3 bg-yellow-400 text-black hover:bg-yellow-300 transition"
          >
            📁 Download Again
          </button>

          <button
            onClick={handleClearAndReturn}
            className="text-sm text-red-400 hover:text-red-300 mb-4"
          >
            🧹 Clear Data & Return
          </button>
        </>
      )}

      <button
        onClick={() => navigate('/')}
        className="text-sm underline text-yellow-400 hover:text-yellow-300 transition"
      >
        ← Back to Builder
      </button>
    </div>
  );
}
