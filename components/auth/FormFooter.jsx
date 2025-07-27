import React, { memo } from "react";
import Link from "next/link";

const FormFooter = memo(({ type }) => (
  <div className="text-center mt-6">
    {type === "signup" ? (
      <p className="text-gray-600">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
        >
          Sign in here
        </Link>
      </p>
    ) : (
      <p className="text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
        >
          Sign up here
        </Link>
      </p>
    )}
  </div>
));

FormFooter.displayName = 'FormFooter';

export default FormFooter;
