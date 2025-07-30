import React, { useEffect } from "react";

const CustomizationForm = ({ formData, setFormData, selectedTemplate }) => {
  const {
    name = "",
    role = "",
    bio = "",
    email = "",
    profileImage = "",
    location = "",
    contact = "",
    projects = [],
  } = formData || {};

useEffect(() => {
  localStorage.setItem('formData', JSON.stringify(formData));
}, [formData]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleProjectChange = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, projects: updated });
  };

  const handleImageUpload = (e, fieldName, index = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;

      if (fieldName === "profileImage") {
        const updatedForm = { ...formData, profileImage: imageData };
        setFormData(updatedForm);
        localStorage.setItem("formData", JSON.stringify(updatedForm));
      } else if (fieldName === "projectImage" && index !== null) {
        const updatedProjects = [...formData.projects];
        updatedProjects[index] = {
          ...updatedProjects[index],
          image: imageData,
        };
        const updatedForm = { ...formData, projects: updatedProjects };
        setFormData(updatedForm);
        localStorage.setItem("formData", JSON.stringify(updatedForm));
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full md:w-1/3 h-screen overflow-y-auto bg-black text-white p-6 space-y-6 border-r border-zinc-800"
    >
      <h2 className="text-2xl font-bold text-gold mb-4">Customize Your Portfolio</h2>

      <label className="text-gold font-medium">Full Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded"
      />

      <label className="text-gold font-medium">Title / Role</label>
      <input
        type="text"
        value={role}
        onChange={(e) => handleInputChange("role", e.target.value)}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded"
      />

      <label className="text-gold font-medium">Bio</label>
      <textarea
        rows="3"
        value={bio}
        onChange={(e) => handleInputChange("bio", e.target.value)}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded resize-none"
      />

      <label className="text-gold font-medium">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded"
      />

      <label className="text-gold font-medium">Upload Profile Picture</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, "profileImage")}
        className="w-full text-sm text-gray-300"
      />
        <p className="text-sm text-yellow-400 mt-1 italic">
            ⚠️ Please upload images under 1MB to ensure smooth preview and download.
        </p>

      <label className="text-gold font-medium">Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => handleInputChange("location", e.target.value)}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded"
      />

      {selectedTemplate === "creative" && (
        <>
          <label className="text-gold font-medium">Project Details</label>
          {projects.map((project, index) => (
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
                placeholder={`Project ${index + 1} Link (https://...)`}
                value={project.link || ""}
                onChange={(e) =>
                  handleProjectChange(index, "link", e.target.value)
                }
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e, "projectImage", index)
                }
                className="w-full text-sm text-gray-300"
              />
                <p className="text-sm text-yellow-400 mt-1 italic">
                    ⚠️ Please upload images under 1MB to ensure smooth preview and download.
                </p>
            </div>
          ))}
        </>
      )}

      <label className="text-gold font-medium">Contact Info</label>
      <input
        type="text"
        value={contact}
        onChange={(e) => handleInputChange("contact", e.target.value)}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded"
      />
    </form>
  );
};

export default CustomizationForm;
