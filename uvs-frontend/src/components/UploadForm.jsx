import React, { useState } from 'react';

export default function UploadForm({ onUploadSuccess, onUploadStart }) {
  const [license, setLicense] = useState(null);
  const [ssm, setSsm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e, setFile) => {
    setError('');
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!license || !ssm) {
      setError('Please upload both documents.');
      return;
    }

    setIsLoading(true);
    onUploadStart();

    console.log("Upload simulation starting...", { onUploadSuccess: typeof onUploadSuccess });
    setTimeout(() => {
      console.log("Upload simulation attempt...");
      if (typeof onUploadSuccess === 'function') {
        const mockData = { uid: "u-1022", passport: { photo_verified: false } };
        onUploadSuccess(mockData);
        console.log("Upload success callback triggered with:", mockData);
      } else {
        console.error("onUploadSuccess is not a function:", onUploadSuccess);
        window.alert("Error: Callback failed. Check console.");
      }
      setIsLoading(false);
    }, 2000);
  };

  const FilePreview = ({ file }) => (
    <p className="text-xs text-green-600 mt-1 font-medium truncate">
      ✓ {file.name}
    </p>
  );

  return (
    <div className="w-full p-4 bg-white rounded-xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">UVS Onboarding</h2>
        <p className="mt-2 text-sm text-gray-600">Upload your documents to get verified.</p>
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

        {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

        <button type="submit" disabled={isLoading} className="w-full mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 text-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300">
          {isLoading ? 'Processing...' : 'Submit for Verification'}
        </button>
      </form>
    </div>
  );
}