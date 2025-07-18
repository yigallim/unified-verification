import React, { useState, useEffect, useRef } from 'react';

const APP_STATE = {
  UPLOADING: 'uploading',
  VERIFYING: 'verifying',
  EKYB_VERIFYING: 'ekyb_verifying',
  VERIFIED: 'verified',
};

// UploadForm Component
function UploadForm({ onUploadSuccess, onUploadStart }) {
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

    console.log("Upload simulation starting...");
    setTimeout(() => {
      console.log("Upload simulation completed");
      if (typeof onUploadSuccess === 'function') {
        const mockData = { 
          uid: "u-1022", 
          name: "Azlan Bin Ahmad",
          dob: "1990-01-01",
          license_no: "D12345678",
          business: {
            name: "Azlan's Warung",
            reg_no: "SSM2020-123456"
          },
          status: "verified",
          passport: { 
            age_verified: true,
            business_verified: true,
            photo_verified: false 
          } 
        };
        onUploadSuccess(mockData);
        console.log("Upload success callback triggered with:", mockData);
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

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">1. Driver's License</label>
          <input 
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
            type="file" 
            onChange={(e) => handleFileChange(e, setLicense)} 
            accept="image/*" 
          />
          {license && <FilePreview file={license} />}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">2. SSM Business Certificate</label>
          <input 
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
            type="file" 
            onChange={(e) => handleFileChange(e, setSsm)} 
            accept="image/*" 
          />
          {ssm && <FilePreview file={ssm} />}
        </div>

        {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

        <button 
          onClick={handleSubmit}
          disabled={isLoading} 
          className="w-full mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 text-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? 'Processing...' : 'Submit for Verification'}
        </button>
      </div>
    </div>
  );
}

// StatusTracker Component
function StatusTracker({ onAnimationComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Document Upload', 'OCR Processing', 'Verification Complete'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onAnimationComplete, 500);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onAnimationComplete]);

  return (
    <div className="w-full p-6 bg-white rounded-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Processing Documents</h2>
        <p className="mt-2 text-sm text-gray-600">Please wait while we verify your documents...</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentStep ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {index <= currentStep ? (
                <span className="text-white text-sm">✓</span>
              ) : (
                <span className="text-gray-600 text-sm">{index + 1}</span>
              )}
            </div>
            <span className={`text-sm font-medium ${
              index <= currentStep ? 'text-green-600' : 'text-gray-500'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// EKYBVerification Component
function EKYBVerification({ onVerificationSuccess, onBack }) {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    console.log("EKYBVerification component mounted");
    let stream;
    
    const startCamera = async () => {
      try {
        console.log("Starting camera...");
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log("Camera started successfully");
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError(`Camera error: ${err.message}. Ensure permissions are granted and a camera is available.`);
      }
    };

    if (isCameraOn) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn]);

  const handleCapture = () => {
    setIsLoading(true);
    setError('');
    console.log("Capturing photo for EKYB verification...");

    setTimeout(() => {
      const mockVerificationData = {
        uid: 'u-1022',
        status: 'verified',
        passport: {
          photo_verified: true,
        },
      };
      console.log("EKYB verification complete:", mockVerificationData);
      onVerificationSuccess(mockVerificationData);
      setIsLoading(false);
      
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }, 2000);
  };

  const handleToggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (!isCameraOn) setError('');
  };

  return (
    <div className="w-full p-4 bg-white rounded-xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">e-KYB Verification</h2>
        <p className="mt-2 text-sm text-gray-600">
          Use your camera to verify your business stall.
        </p>
      </div>

      {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

      <div className="flex justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-[300px] h-[200px] border border-gray-300 rounded-lg ${isCameraOn ? '' : 'hidden'}`}
        />
        {!isCameraOn && (
          <div className="w-[300px] h-[200px] border border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Camera not started</p>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleToggleCamera}
          className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-all duration-300"
        >
          {isCameraOn ? 'Stop Camera' : 'Start Camera'}
        </button>
        <button
          onClick={handleCapture}
          disabled={!isCameraOn || isLoading}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 text-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? 'Verifying...' : 'Capture & Verify'}
        </button>
      </div>

      <button
        onClick={onBack}
        className="w-full mt-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-all duration-300"
      >
        Back to Upload
      </button>
    </div>
  );
}

// DigitalPassport Component
function DigitalPassport({ passportData }) {
  const data = passportData || {
    name: 'N/A',
    business: { name: 'N/A', reg_no: 'N/A' },
    passport: { age_verified: false, business_verified: false, photo_verified: false },
    uid: 'u-1022',
  };

  const VerifiedField = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 text-right">{value}</p>
    </div>
  );

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="shrink-0">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center ring-4 ring-green-200">
              <span className="text-3xl text-green-600 font-bold">✓</span>
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-black">Digital Passport</div>
            <p className="text-green-600 font-semibold">Verified & Secured</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <VerifiedField label="Name" value={data.name} />
        <VerifiedField label="Business Name" value={data.business.name} />
        <VerifiedField label="Business Reg. No" value={data.business.reg_no} />
        <VerifiedField
          label="Verification Status"
          value={
            data.passport.photo_verified
              ? 'Fully Verified (Including Stall)'
              : 'Verified (Pending Stall Photo)'
          }
        />
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Verification Complete</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your UVS Digital Passport is ready! You can now apply to services instantly.
        </p>
      </div>
    </div>
  );
}

// PartnerDemo Component
function PartnerDemo() {
  const [isApplying, setIsApplying] = useState(false);
  const [applicationComplete, setApplicationComplete] = useState(false);

  const handleApplyWithUVS = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplicationComplete(true);
    }, 2000);
  };

  if (applicationComplete) {
    return (
      <div className="w-full p-6 bg-white rounded-xl text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Successful!</h2>
        <p className="text-gray-600 mb-6">Your FPX application has been processed using your UVS Digital Passport.</p>
        <button
          onClick={() => setApplicationComplete(false)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Apply for Another Service
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Maybank FPX</h2>
        <p className="text-gray-600 mt-2">Apply for FPX payment gateway</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Required Documents:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Business Registration Certificate</li>
            <li>• Owner's IC/Passport</li>
            <li>• Business Address Proof</li>
            <li>• Bank Statement (6 months)</li>
          </ul>
        </div>
      </div>

      <button
        onClick={handleApplyWithUVS}
        disabled={isApplying}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isApplying ? 'Processing with UVS...' : 'Apply with UVS Passport'}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Skip the paperwork! Apply instantly with your verified UVS Digital Passport.
      </p>
    </div>
  );
}

// Main App Component
function App() {
  const [appState, setAppState] = useState(APP_STATE.UPLOADING);
  const [passportData, setPassportData] = useState(null);
  const [showPartnerDemo, setShowPartnerDemo] = useState(false);

  console.log("App rendering with state:", appState);

  const handleUploadStart = () => {
    console.log("Upload started, moving to VERIFYING");
    setAppState(APP_STATE.VERIFYING);
  };

  const handleUploadSuccess = (data) => {
    console.log("Upload success, moving to EKYB_VERIFYING", data);
    setPassportData(data);
    setAppState(APP_STATE.EKYB_VERIFYING); // Go directly to EKYB
  };

  const handleEKYBVerificationSuccess = (data) => {
    console.log("EKYB verification success, moving to VERIFIED", data);
    setPassportData((prev) => ({ ...prev, ...data }));
    setAppState(APP_STATE.VERIFIED);
  };

  const handleAnimationComplete = () => {
    console.log("Animation complete, moving to EKYB_VERIFYING");
    setAppState(APP_STATE.EKYB_VERIFYING);
  };

  const renderUVSApp = () => {
    console.log("Rendering UVS app with state:", appState);
    
    switch (appState) {
      case APP_STATE.VERIFYING:
        return <StatusTracker onAnimationComplete={handleAnimationComplete} />;
      case APP_STATE.EKYB_VERIFYING:
        return (
          <EKYBVerification
            onVerificationSuccess={handleEKYBVerificationSuccess}
            onBack={() => setAppState(APP_STATE.UPLOADING)}
          />
        );
      case APP_STATE.VERIFIED:
        if (!passportData) return null;
        return <DigitalPassport passportData={passportData} />;
      case APP_STATE.UPLOADING:
      default:
        return <UploadForm onUploadStart={handleUploadStart} onUploadSuccess={handleUploadSuccess} />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-[575px] h-[912px] bg-gray-100 rounded-[40px] shadow-2xl p-2 overflow-hidden flex flex-col">
        <div className="flex-shrink-0 p-2 bg-gray-200 rounded-t-3xl">
          <div className="p-1 bg-gray-300 rounded-lg flex justify-around text-xs font-bold">
            <button
              onClick={() => setShowPartnerDemo(false)}
              className={`w-1/2 p-2 rounded-md ${!showPartnerDemo ? 'bg-white shadow' : ''}`}
            >
              UVS Identity App
            </button>
            <button
              onClick={() => setShowPartnerDemo(true)}
              className={`w-1/2 p-2 rounded-md ${showPartnerDemo ? 'bg-white shadow' : ''}`}
            >
              Partner Demo
            </button>
          </div>
        </div>

        <div className="w-full flex-grow flex items-center justify-center p-2 overflow-y-auto">
          {showPartnerDemo ? <PartnerDemo /> : renderUVSApp()}
        </div>
      </div>
    </div>
  );
}

export default App;