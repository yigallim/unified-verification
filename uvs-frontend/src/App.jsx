// src/App.jsx

import React, { useState } from 'react';
import { UploadForm } from './components/UploadForm.jsx';
import { StatusTracker } from './components/StatusTracker.jsx';
import { DigitalPassport } from './components/DigitalPassport.jsx';
// Import our new partner demo component
import { PartnerDemo } from './components/PartnerDemo.jsx';
import './index.css';

const APP_STATE = {
  UPLOADING: 'uploading',
  VERIFYING: 'verifying',
  VERIFIED: 'verified',
};

function App() {
  const [appState, setAppState] = useState(APP_STATE.UPLOADING);
  const [passportData, setPassportData] = useState(null);

  // NEW STATE TO TOGGLE BETWEEN DEMOS
  const [showPartnerDemo, setShowPartnerDemo] = useState(false);

  const handleUploadStart = () => setAppState(APP_STATE.VERIFYING);
  const handleUploadSuccess = (data) => setPassportData(data);
  const handleAnimationComplete = () => setAppState(APP_STATE.VERIFIED);
  
  // A function to reset the UVS app flow
  const resetUVS = () => {
    setPassportData(null);
    setAppState(APP_STATE.UPLOADING);
    setShowPartnerDemo(false);
  }

  const renderUVSApp = () => {
    switch (appState) {
      case APP_STATE.VERIFYING:
        return <StatusTracker onAnimationComplete={handleAnimationComplete} />;
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
        
        {/* DEMO TOGGLE BUTTONS */}
        <div className="flex-shrink-0 p-2 bg-gray-200 rounded-t-3xl">
          <div className="p-1 bg-gray-300 rounded-lg flex justify-around text-xs font-bold">
             <button onClick={() => setShowPartnerDemo(false)} className={`w-1/2 p-2 rounded-md ${!showPartnerDemo ? 'bg-white shadow' : ''}`}>UVS Identity App</button>
             <button onClick={() => setShowPartnerDemo(true)} className={`w-1/2 p-2 rounded-md ${showPartnerDemo ? 'bg-white shadow' : ''}`}>Partner Demo</button>
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