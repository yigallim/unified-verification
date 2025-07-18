// src/App.jsx

import React, { useState } from "react";
import { UploadForm } from "./components/UploadForm.jsx";
import { StatusTracker } from "./components/StatusTracker.jsx";
import { DigitalPassport } from "./components/DigitalPassport.jsx";
// Import our new partner demo component
import { PartnerDemo } from "./components/PartnerDemo.jsx";
import "./index.css";

const APP_STATE = {
  UPLOADING: "uploading",
  VERIFYING: "verifying",
  VERIFIED: "verified",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function App() {
  const [appState, setAppState] = useState(APP_STATE.UPLOADING);
  const [passportData, setPassportData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  // NEW STATE TO TOGGLE BETWEEN DEMOS
  const [showPartnerDemo, setShowPartnerDemo] = useState(false);

  const handleUploadStart = async (formData) => {
    setAppState(APP_STATE.VERIFYING);
    setCurrentStep(0);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-docs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      const { license_file, ssm_file } = result;

      console.log("✅ Files uploaded:", license_file, ssm_file);

      const socket = new WebSocket("ws://127.0.0.1:8000/ws/verification");

      socket.onopen = () => {
        console.log("🔌 WebSocket connected, sending file names...");
        socket.send(
          JSON.stringify({
            license_file,
            ssm_file,
          })
        );
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("🟡 Received step:", data);
        setCurrentStep(data.step);

        if (data.step === 3) {
          const mockPassportData = {
            uid: "u-1022",
            name: data.passport_data?.name || "Azlan Bin Ahmad",
            dob: data.passport_data?.dob || "1990-01-01",
            license_no: data.passport_data?.license_no || "D12345678",
            business_name: data.passport_data?.business_name || "Azlan's Warung",
            business_reg_no: data.passport_data?.business_reg_no || "SSM2020-123456",
            address: data.passport_data?.address || "123 Jalan Niaga, 50450 Kuala Lumpur",
            status: "verified",
            passport: {
              age_verified: true,
              business_verified: true,
              photo_verified: true,
            },
          };
          localStorage.setItem("passportData", JSON.stringify(mockPassportData));
          setPassportData(mockPassportData);
          setTimeout(() => handleAnimationComplete(), 500);
        }
      };

      socket.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
      };

      socket.onclose = () => {
        console.log("🔌 WebSocket closed");
      };
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed.");
      setAppState(APP_STATE.UPLOADING);
      setCurrentStep(0);
    }
  };

  const handleUploadSuccess = (data) => setPassportData(data);
  const handleAnimationComplete = () => setAppState(APP_STATE.VERIFIED);

  // A function to reset the UVS app flow
  const resetUVS = () => {
    setPassportData(null);
    setAppState(APP_STATE.UPLOADING);
    setShowPartnerDemo(false);
  };

  const renderUVSApp = () => {
    switch (appState) {
      case APP_STATE.VERIFYING:
        return <StatusTracker currentStep={currentStep} />;
      case APP_STATE.VERIFIED:
        if (!passportData) return null;
        return <DigitalPassport passportData={passportData} />;
      case APP_STATE.UPLOADING:
      default:
        return (
          <UploadForm onUploadStart={handleUploadStart} onUploadSuccess={handleUploadSuccess} />
        );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-[575px] h-[912px] bg-gray-100 rounded-[40px] shadow-2xl p-2 overflow-hidden flex flex-col">
        {/* DEMO TOGGLE BUTTONS */}
        <div className="flex-shrink-0 p-2 bg-gray-200 rounded-t-3xl">
          <div className="p-1 bg-gray-300 rounded-lg flex justify-around text-xs font-bold">
            <button
              onClick={() => setShowPartnerDemo(false)}
              className={`w-1/2 p-2 rounded-md ${!showPartnerDemo ? "bg-white shadow" : ""}`}
            >
              UVS Identity App
            </button>
            <button
              onClick={() => setShowPartnerDemo(true)}
              className={`w-1/2 p-2 rounded-md ${showPartnerDemo ? "bg-white shadow" : ""}`}
            >
              Partner Demo
            </button>
          </div>
        </div>

        <div className="w-full flex-grow flex items-center justify-center p-2 overflow-y-auto">
          {/* Show either the UVS flow or the Partner Demo */}
          {showPartnerDemo ? <PartnerDemo /> : renderUVSApp()}
        </div>
      </div>
    </div>
  );
}

export default App;
