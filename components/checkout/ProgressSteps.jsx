"use client";
import React from "react";

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Shipping", description: "Delivery information" },
    { number: 2, title: "Billing", description: "Billing address" },
    { number: 3, title: "Payment", description: "Payment details" },
  ];

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium transition-colors ${
                  step.number <= currentStep
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={`text-sm font-medium ${
                    step.number <= currentStep
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 sm:mx-4">
                <div
                  className={`h-0.5 transition-colors ${
                    step.number < currentStep ? "bg-gray-900" : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Step Titles */}
      <div className="mt-4 sm:hidden">
        <p className="text-sm font-medium text-gray-900">
          Step {currentStep}: {steps[currentStep - 1].title}
        </p>
        <p className="text-xs text-gray-500">
          {steps[currentStep - 1].description}
        </p>
      </div>
    </div>
  );
};

export default ProgressSteps;
