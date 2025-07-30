import React from "react";

const MinimalTemplate = ({ formData }) => {
  const { name, role, location, bio, contact, profileImage } = formData;

  return (
    <div className="w-full max-w-2xl mx-auto bg-black text-white p-8 rounded-2xl shadow-lg space-y-6">
      {/* Profile Section */}
      <div className="text-center space-y-4">
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white"
          />
        )}
        <h1 className="text-3xl font-bold">{name || "Your Name"}</h1>
        <p className="text-xl text-yellow-400">{role || "Your Role"}</p>
        <p className="text-sm text-gray-400">{location || "Your Location"}</p>
      </div>

      {/* About Section */}
      <section>
        <h2 className="text-xl font-semibold border-b border-gray-700 pb-1">About Me</h2>
        <p className="text-gray-300 whitespace-pre-line">{bio || "Write a short bio about yourself."}</p>
      </section>

      {/* Contact Section */}
      <section>
        <h2 className="text-xl font-semibold border-b border-gray-700 pb-1">Contact</h2>
        <p className="text-gray-300">{contact || "your@email.com"}</p>
      </section>
    </div>
  );
};

export default MinimalTemplate;
