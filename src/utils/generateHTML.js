export function generateHTMLFile(formData) {
const {
    name = 'Anonymous',
    location = '',
    skills,
    bio = '',
    profileImage = '',
    projects = [],
 } = formData;

  if (!Array.isArray(skills)) {
    throw new Error("Skills must be an array.");
  }

  const skillsText = skills.join(" • ");

  const projectCards = projects.map(project => `
    <div class="project-card">
      <a href="${project.link}" target="_blank">
        <img src="${project.image}" alt="${project.title}" />
        <p>${project.title}</p>
      </a>
    </div>
  `).join("");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${name}'s Portfolio</title>
  <style>
    body {
      margin: 0;
      padding: 2rem;
      background-color: #0a0a0a;
      color: #f5f5f5;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .container {
      max-width: 800px;
      width: 100%;
      padding: 2rem;
      background-color: #111;
      border-radius: 1rem;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
      text-align: center;
    }

    img.profile {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid gold;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
      margin: 0.5rem 0;
      color: gold;
    }

    h2 {
      margin-top: 2.5rem;
      font-size: 1.8rem;
      color: #f5f5f5;
    }

    p.subtitle {
      color: #bbb;
      margin-top: -0.5rem;
      font-size: 1rem;
    }

    .about {
      margin-top: 1rem;
      font-size: 0.95rem;
      color: #e5e5e5;
      line-height: 1.6;
      max-width: 600px;
      text-align: center;
      white-space: normal; /* Changed from pre-line */
      margin-left: auto;
      margin-right: auto;
    }

    .projects-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .project-card {
      width: 200px;
      text-align: center;
    }

    .project-card img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      border-radius: 0.75rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 1px solid #333;
    }

    .project-card img:hover {
      transform: scale(1.03);
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
    }

    .project-card p {
      margin-top: 0.5rem;
      font-weight: 500;
      color: #f5f5f5;
      text-decoration: none;
    }

    .project-card a {
      text-decoration: none;
    }

    .project-card a:hover p {
      color: gold;
    }

    footer {
      margin-top: 3rem;
      font-size: 0.9rem;
      color: #888;
    }

    footer p {
      margin-bottom: 0.5rem;
    }

    footer button {
      background-color: #333;
      color: gold;
      padding: 0.5rem 1rem;
      border: 1px solid gold;
      border-radius: 0.5rem;
      cursor: not-allowed;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <img class="profile" src="${profileImage}" alt="Profile Image" />
    <h1>${name}</h1>
    <p class="subtitle">${location} • ${skillsText}</p>
    ${bio ? `<div class="about">${bio.replace(/\n/g, '<br>')}</div>` : ""}
    <h2>My Projects</h2>
    <div class="projects-grid">
      ${projectCards}
    </div>
    <footer>
      <p>This portfolio was built with BassUp.<br/>Want a custom site?</p>
      <button disabled>Coming Soon</button>
    </footer>
  </div>
</body>
</html>
`;

  // ✅ Trigger the download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/\s+/g, '_')}_Portfolio.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
