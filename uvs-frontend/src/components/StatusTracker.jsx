// src/components/StatusTracker.jsx

import React, { useState, useEffect } from "react";

// Define the steps for the tracker
const steps = ["Docs Received", "OCR Processing", "Verifying Data", "Verified!"];

export const StatusTracker = ({ currentStep }) => {
  // State to track which step we are on (0-indexed)

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification in Progress</h2>
      <p className="text-gray-600 mb-8">
        We're analyzing your documents. This will only take a moment.
      </p>

      {/* Stepper UI */}
      <ol className="flex items-center justify-between w-full text-sm font-medium text-center text-gray-500">
        {steps.map((step, index) => (
          <li
            key={step}
            // Dynamically apply classes based on the current step
            className={`flex items-center ${index <= currentStep ? "text-blue-600" : ""}`}
          >
            <span
              className={`flex items-center justify-center w-6 h-6 mr-2 text-xs border rounded-full shrink-0 ${
                index <= currentStep ? "border-blue-600" : "border-gray-500"
              }`}
            >
              {/* Show a checkmark for completed steps */}
              {index < currentStep ? "✓" : index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      {/* Show a success message on the final step */}
      {currentStep === steps.length - 1 && (
        <div className="mt-8">
          <p className="text-lg font-semibold text-green-600 animate-pulse">
            🎉 Success! You are now UVS verified!
          </p>
        </div>
      )}
    </div>
  );
};
