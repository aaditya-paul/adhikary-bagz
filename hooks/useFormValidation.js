// hooks/useFormValidation.js
import { useState, useCallback } from "react";

export default function useFormValidation(initialState, validateFn) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = validateFn(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateFn]);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
  }, [initialState]);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validateForm,
    resetForm,
  };
}
