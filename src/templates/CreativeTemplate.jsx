// src/templates/CreativeTemplate.jsx
import React from 'react';

const CreativeTemplate = ({ formData }) => {
  const {
    name,
    role,
    location,
    bio,
    email,
    profileImage,
    projects = [],
  } = formData;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 font-sans space-y-12">
      {/* Profile Section */}
      <section className="flex flex-col items-center text-center space-y-4">
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-gold"
          />
        )}
        {name && <h1 className="text-3xl font-bold text-gold">{name}</h1>}
        {role && <p className="text-lg text-white/80">{role}</p>}
        {location && <p className="text-sm text-white/60">{location}</p>}
        {bio && <p className="max-w-xl text-white/70 italic">{bio}</p>}
        {email && <p className="text-sm text-white/50">{email}</p>}
      </section>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gold mb-6">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-xl p-4 shadow-md hover:shadow-lg transition duration-300"
              >
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <h3 className="text-lg font-bold text-gold hover:underline">
                      {project.title}
                    </h3>
                  </a>
                ) : (
                  <>
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <h3 className="text-lg font-bold text-white">
                      {project.title}
                    </h3>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CreativeTemplate;
