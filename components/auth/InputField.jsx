import React, { memo } from "react";

const InputField = memo(
  ({
    label,
    type = "text",
    name,
    value,
    onChange,
    error,
    placeholder,
    ...props
  }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
);

InputField.displayName = "InputField";

export default InputField;
