import React, { useState } from 'react';
import CustomizationForm from '../components/CustomizationForm';
import TemplatePreview from '../components/TemplatePreview';

function Builder() {
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');

  const [minimalFormData, setMinimalFormData] = useState({
    name: '',
    role: '',
    location: '',
    bio: '',
    contact: '',
    profileImage: '',
  });

  const [creativeFormData, setCreativeFormData] = useState({
    name: '',
    role: '',
    location: '',
    bio: '',
    contact: '',
    profileImage: '',
    projects: [
      { title: 'Project One', image: '', link: '' },
      { title: 'Project Two', image: '', link: '' },
      { title: 'Project Three', image: '', link: '' },
    ],
  });

  const activeFormData = selectedTemplate === 'minimal' ? minimalFormData : creativeFormData;
  const setActiveFormData = selectedTemplate === 'minimal' ? setMinimalFormData : setCreativeFormData;

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center space-y-6">
      {/* Template Selection */}
      <div className="flex space-x-4">
        {['minimal', 'creative'].map((template) => (
          <button
            key={template}
            onClick={() => setSelectedTemplate(template)}
            className={`px-4 py-2 rounded-xl capitalize ${
              selectedTemplate === template
                ? 'bg-gold text-black'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {template}
          </button>
        ))}
      </div>

      {/* Form + Preview */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        <CustomizationForm
          formData={activeFormData}
          setFormData={setActiveFormData}
          selectedTemplate={selectedTemplate}
        />
        <TemplatePreview
          formData={activeFormData}
          selectedTemplate={selectedTemplate}
        />
      </div>
    </main>
  );
}

export default Builder;
