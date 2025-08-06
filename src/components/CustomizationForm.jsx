import React from "react";
import { useEffect } from "react"; // make sure this is imported at the top

const CustomizationForm = ({ formData, setFormData, selectedTemplate }) => {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setFormData((prev) => ({ ...prev, projects: updatedProjects }));
  };

  const handleImageUpload = (e, fieldName, index = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("Image must be less than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      if (fieldName === "profileImage") {
        handleInputChange("profileImage", base64Image);
      } else if (fieldName === "projectImage" && index !== null) {
        handleProjectChange(index, "image", base64Image);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full md:w-1/3 h-screen overflow-y-auto bg-black text-white p-6 space-y-6 border-r border-zinc-800"
    >
      <h2 className="text-2xl font-bold text-gold mb-4">Customize Your Portfolio</h2>

      {/* Basic info fields */}
      {[
        { label: "Full Name", key: "name", type: "text" },
        { label: "Title / Role", key: "role", type: "text" },
        { label: "Bio", key: "bio", type: "textarea" },
        { label: "Email", key: "email", type: "email" },
        { label: "Location", key: "location", type: "text" },
        { label: "Contact Info", key: "contact", type: "text" },
      ].map(({ label, key, type }) => (
        <div key={key}>
          <label className="text-gold font-medium">{label}</label>
          {type === "textarea" ? (
            <textarea
              rows="3"
              value={formData[key] || ""}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded resize-none"
            />
          ) : (
            <input
              type={type}
              value={formData[key] || ""}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded"
            />
          )}
        </div>
      ))}

      {/* Profile Image Upload */}
      <div>
        <label className="text-gold font-medium">Upload Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "profileImage")}
          className="w-full text-sm text-gray-300"
        />
        <p className="text-sm text-yellow-400 mt-1 italic">
          ⚠️ Upload images under 10MB.
        </p>
      </div>

      {/* Projects (only for creative template) */}
      {selectedTemplate === "creative" && formData.projects?.length > 0 && (
        <>
          <label className="text-gold font-medium">Project Details</label>
          {formData.projects.map((project, index) => (
            <div
              key={index}
              className="mb-4 p-3 border border-zinc-700 rounded-md space-y-2"
            >
              <input
                type="text"
                placeholder={`Project ${index + 1} Title`}
                value={project.title || ""}
                onChange={(e) =>
                  handleProjectChange(index, "title", e.target.value)
                }
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm"
              />
              <input
                type="text"
                placeholder={`Project ${index + 1} Link`}
                value={project.link || ""}
                onChange={(e) =>
                  handleProjectChange(index, "link", e.target.value)
                }
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "projectImage", index)}
                className="w-full text-sm text-gray-300"
              />
              {project.image && (
                <img
                  src={project.image}
                  alt={`Project ${index + 1} Preview`}
                  className="mt-2 w-full h-32 object-cover border border-zinc-700 rounded"
                />
              )}
              <p className="text-sm text-yellow-400 italic">
                ⚠️ Upload images under 10MB.
              </p>
            </div>
          ))}
        </>
      )}
    </form>
  );
};

export default CustomizationForm;
