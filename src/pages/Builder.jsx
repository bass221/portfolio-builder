import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import CustomizationForm from '../components/CustomizationForm';
import TemplatePreview from '../components/TemplatePreview';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const PRICES = { minimal: 200, creative: 500 }; // in cents

export default function Builder() {
  const clearedRef = useRef(false);
  const [template, setTemplate] = useState('minimal');

  const [minimalData, setMinimalData] = useState({
    name: '', role: '', location: '', bio: '', contact: '', profileImage: ''
  });

  const [creativeData, setCreativeData] = useState({
    name: '', role: '', location: '', bio: '', contact: '', profileImage: '',
    projects: [
      { title: '', image: '', link: '' },
      { title: '', image: '', link: '' },
      { title: '', image: '', link: '' }
    ]
  });

  const activeData = template === 'minimal' ? minimalData : creativeData;
  const setActiveData = template === 'minimal' ? setMinimalData : setCreativeData;

  const [formValid, setFormValid] = useState(false);

  // ✅ Validate form completion
  useEffect(() => {
    const filledBasicFields = ['name', 'role', 'location', 'bio', 'contact']
      .every(key => activeData[key]);

    const projectsValid = template !== 'creative' ||
      activeData.projects.every(p => p.title && p.link);

    setFormValid(filledBasicFields && projectsValid);
  }, [activeData, template]);

  // ✅ Save full form data to localStorage (used after payment)
  const saveFormDataToLocalStorage = () => {
    const sanitized = {
      ...activeData,
      profileImage: activeData.profileImage || '',
      ...(template === 'creative' && {
        projects: activeData.projects.map(p => ({
          title: p.title || '',
          link: p.link || '',
          image: p.image || ''
        }))
      })
    };

    localStorage.setItem('formData', JSON.stringify({
      template,
      ...sanitized
    }));
  };

  const handleCheckout = async () => {
    try {
      const formData = {
        ...activeData,
        profileImage: activeData.profileImage || '',
        ...(template === 'creative' && {
          projects: activeData.projects.map(p => ({
            title: p.title || '',
            link: p.link || '',
            image: p.image || ''
          }))
        })
      };

      const price = PRICES[template];

      // ✅ Create Stripe Checkout session
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-stripe-session`,
        { template, price, name: formData.name, role: formData.role }
      );

      const sessionId = response.data.id;

      if (!sessionId) {
        alert('Something went wrong. Please try again.');
        return;
      }

      // ✅ Send full form data to backend
      await axios.post(`${import.meta.env.VITE_API_URL}/api/save-form-data`, {
        sessionId,
        formData: { template, ...formData },
      });

      // ✅ Redirect to Stripe Checkout
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('❌ Checkout Error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 pb-32 flex flex-col items-center space-y-6">

      {/* Template Selector */}
      <div className="flex space-x-4 mt-6">
        {Object.keys(PRICES).map((tmpl) => (
          <button
            key={tmpl}
            onClick={() => setTemplate(tmpl)}
            className={`px-5 py-2 rounded-xl font-semibold capitalize transition text-black ${
              tmpl === template
                ? 'bg-yellow-400 scale-105 shadow-md'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            {tmpl} (${PRICES[tmpl] / 100})
          </button>
        ))}
      </div>

      {/* Form + Preview */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        <CustomizationForm
          formData={activeData}
          setFormData={setActiveData}
          selectedTemplate={template}
        />
        <TemplatePreview
          formData={activeData}
          selectedTemplate={template}
        />
      </div>

      {/* Buy Now Button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() =>
            formValid
              ? handleCheckout()
              : alert('Please complete all required fields.')
          }
          className={`px-8 py-4 text-lg font-bold rounded-2xl shadow-xl transition-all ${
            formValid
              ? 'bg-yellow-400 hover:bg-yellow-500 text-black animate-bounce'
              : 'bg-yellow-300 opacity-70 text-black'
          }`}
        >
          💳 Buy Now (${PRICES[template] / 100})
        </button>
      </div>

    </main>
  );
}
