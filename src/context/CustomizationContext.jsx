// src/context/CustomizationContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CustomizationContext = createContext();

export const useCustomization = () => useContext(CustomizationContext);

// Default form structure for both templates
const defaultFormData = {
  selectedTemplate: "minimal",
  minimal: {
    name: "",
    role: "",
    bio: "",
    email: "",
    profileImage: "",
    location: "",
    contact: "",
  },
  creative: {
    name: "",
    role: "",
    bio: "",
    email: "",
    profileImage: "",
    location: "",
    contact: "",
    projects: [
      { title: "", image: "", link: "" },
      { title: "", image: "", link: "" },
      { title: "", image: "", link: "" },
    ]
  },
  price: 5
};

export const CustomizationProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    try {
      const stored = localStorage.getItem("customFormData");
      return stored ? JSON.parse(stored) : defaultFormData;
    } catch (err) {
      console.warn("Failed to parse stored customFormData:", err);
      return defaultFormData;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("customFormData", JSON.stringify(formData));
  }, [formData]);

  // Defensive reset if corrupted
  useEffect(() => {
    if (!formData || typeof formData !== "object") {
      setFormData(defaultFormData);
    }
  }, []);

  return (
    <CustomizationContext.Provider value={{ formData, setFormData }}>
      {children}
    </CustomizationContext.Provider>
  );
};
