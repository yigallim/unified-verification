
import { useState } from "react";

export const UploadForm = ({ onUploadSuccess, onUploadStart }) => {
  const [license, setLicense] = useState(null);
  const [ssm, setSsm] = useState(null);
  const [previewUrls, setPreviewUrls] = useState({ license: "", ssm: "" });


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e, setFile, type) => {
    setError("");
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreviewUrls((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // if (!license || !ssm) {
    //   setError("Please upload both documents.");
    //   return;
    // }


    setIsLoading(true);


    const formData = new FormData();
    formData.append("license", license);
    formData.append("ssm", ssm);

    console.log("Simulating file upload...");
    onUploadStart(formData);

  };

  const FilePreview = ({ file }) => (
    <p className="text-xs text-green-600 mt-1 font-medium truncate">✓ {file.name}</p>
  );

  return (
    <div className="w-full p-4 bg-white rounded-xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">UVS Onboarding</h2>
        <p className="mt-2 text-sm text-gray-600">Upload your documents to get verified.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1. Driver’s License
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setLicense, "license")}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          {license && <FilePreview file={license} />}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            2. SSM Business Certificate
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setSsm, "ssm")}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          {ssm && <FilePreview file={ssm} />}
        </div>

        {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 text-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? "Processing..." : "Submit for Verification"}
        </button>
      </form>

      {/* 👇 Image Preview After Submit */}
      {(previewUrls.license || previewUrls.ssm) && !isLoading && (
        <div className="pt-4 border-t border-gray-200 space-y-4">
          <p className="text-sm font-medium text-gray-700">Preview:</p>
          <div className="grid grid-cols-2 gap-4">
            {previewUrls.license && (
              <div>
                <p className="text-xs text-gray-500 mb-1">License:</p>
                <img
                  src={previewUrls.license}
                  alt="License"
                  className="w-full max-h-32 object-contain rounded-md border"
                />
              </div>
            )}
            {previewUrls.ssm && (
              <div>
                <p className="text-xs text-gray-500 mb-1">SSM Certificate:</p>
                <img
                  src={previewUrls.ssm}
                  alt="SSM"
                  className="w-full max-h-32 object-contain rounded-md border"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

};

