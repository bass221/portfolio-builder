// src/context/CustomizationContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CustomizationContext = createContext();

export const useCustomization = () => useContext(CustomizationContext);

const defaultFormData = {
  name: "",
  role: "",
  bio: "",
  email: "",
  profileImage: "",
  location: "",
  contact: "",
  projects: [],
};

export const CustomizationProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    try {
      const stored = localStorage.getItem("formData");
      return stored ? JSON.parse(stored) : defaultFormData;
    } catch {
      return defaultFormData;
    }
  });

  // Keep localStorage in sync with formData
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // Optional: auto-clean broken data (e.g., from older builds)
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
