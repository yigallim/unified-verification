import React, { useState, useRef, useEffect } from 'react';

export default function EKYBVerification({ onVerificationSuccess, onBack }) {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
  console.log("EKYBVerification mounted or updated, isCameraOn:", isCameraOn);
  let stream;
  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      console.log("Camera stream received");
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError(`Camera error: ${err.message}. Ensure permissions are granted and a camera is available.`);
    }
  };
  if (isCameraOn) startCamera();

  return () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      console.log("Camera stream stopped");
    }
  };
}, [isCameraOn]);

  const handleCapture = () => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const mockVerificationData = {
        uid: 'u-1022',
        status: 'verified',
        passport: {
          photo_verified: true,
        },
      };
      onVerificationSuccess(mockVerificationData);
      setIsLoading(false);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }, 2000);
  };

  const handleToggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (!isCameraOn) setError(''); // Clear error when restarting
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