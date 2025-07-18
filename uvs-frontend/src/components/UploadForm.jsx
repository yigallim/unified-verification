// src/components/UploadForm.jsx

import React, { useState } from 'react';

export const UploadForm = ({ onUploadSuccess, onUploadStart }) => {
  // 1. Simplified State: Removed 'stall'
  const [license, setLicense] = useState(null);
  const [ssm, setSsm] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e, setFile) => {
    setError('');
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 2. Simplified Validation
    if (!license || !ssm) {
      setError('Please upload both documents.');
      return;
    }

    setIsLoading(true);
    onUploadStart();

    const formData = new FormData();
    formData.append('license', license);
    formData.append('ssm', ssm);
    // 3. Simplified FormData: No longer appending 'stall'

    // --- SIMULATED BACKEND CALL ---
    console.log("Simulating file upload...");
    setTimeout(() => {
      console.log("Upload simulation complete.");

      // 4. Updated Mock Data: photo_verified is now false
      const mockPassportData = {
        "uid": "u-1022",
        "name": "Azlan Bin Ahmad",
        "dob": "1990-01-01",
        "license_no": "D12345678",
        "business": {
          "name": "Azlan's Warung",
          "reg_no": "SSM2020-123456"
        },
        "status": "verified",
        "passport": {
          "age_verified": true,
          "business_verified": true,
          "photo_verified": false // Important: reflects the new logic
        }
      };
      onUploadSuccess(mockPassportData);
      setIsLoading(false);
    }, 2000);
  };

  const FilePreview = ({ file }) => (
    <p className="text-xs text-green-600 mt-1 font-medium truncate">
      ✓ {file.name}
    </p>
  );

  return (
    // The form now fits nicely inside the phone frame
    <div className="w-full p-4 bg-white rounded-xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">UVS Onboarding</h2>
        <p className="mt-2 text-sm text-gray-600">
          Upload your documents to get verified.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">1. Driver’s License</label>
          <input className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" type="file" onChange={(e) => handleFileChange(e, setLicense)} accept="image/*" />
          {license && <FilePreview file={license} />}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">2. SSM Business Certificate</label>
          <input className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" type="file" onChange={(e) => handleFileChange(e, setSsm)} accept="image/*" />
          {ssm && <FilePreview file={ssm} />}
        </div>
        
        {/* 5. UI Simplified: The stall photo input is completely removed */}

        {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

        <button type="submit" disabled={isLoading} className="w-full mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 text-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300">
          {isLoading ? 'Processing...' : 'Submit for Verification'}
        </button>
      </form>
    </div>
  );
};