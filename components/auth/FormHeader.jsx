import React, { memo } from "react";

const FormHeader = memo(({ title, subtitle }) => (
  <div className="text-center mb-8">
    <h2 className="text-3xl font-light text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-600">{subtitle}</p>
  </div>
));

FormHeader.displayName = "FormHeader";

export default FormHeader;
