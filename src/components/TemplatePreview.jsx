import React, { useEffect } from 'react';
import MinimalTemplate from '../templates/MinimalTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';

const TemplatePreview = ({ formData, selectedTemplate }) => {
  useEffect(() => {
    if (selectedTemplate && formData) {
      const payload = {
        selectedTemplate,
        formData,
      };
      localStorage.setItem('portfolioData', JSON.stringify(payload));
    }
  }, [formData, selectedTemplate]);

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'minimal':
        return <MinimalTemplate formData={formData} />;
      case 'creative':
        return <CreativeTemplate formData={formData} />;
      default:
        return <p className="text-center text-zinc-400">Please select a template to preview.</p>;
    }
  };

  return (
    <div className="w-full md:w-2/3 h-screen overflow-y-auto bg-zinc-950 text-white p-6">
      <h2 className="text-2xl font-semibold text-gold mb-6">📄 Live Template Preview</h2>

      <div className="bg-black border border-zinc-800 rounded-xl p-4 shadow-md">
        <div id="template-preview" className="bg-white text-black rounded overflow-hidden">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
