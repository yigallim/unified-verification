// src/components/PartnerDemo.jsx

import React, { useState } from 'react';

const uvsVerifiedData = {
  name: "Azlan Bin Ahmad",
  business: {
    name: "Azlan's Warung",
    reg_no: "SSM2020-123456",
    address: "123 Jalan Niaga, 50450 Kuala Lumpur",
    type: "Sole Proprietorship",
    branch: "KL Main Branch",
  },
  dob: "1990-01-01",
};

export const PartnerDemo = () => {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [address, setAddress] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [branch, setBranch] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleApplyWithUVS = () => {
    setIsLoading(true);
    setTimeout(() => {
      setName(uvsVerifiedData.name);
      setBusinessName(uvsVerifiedData.business.name);
      setRegNo(uvsVerifiedData.business.reg_no);
      setAddress(uvsVerifiedData.business.address);
      setBusinessType(uvsVerifiedData.business.type);
      setBranch(uvsVerifiedData.business.branch);
      
      setIsLoading(false);
      setIsApplied(true);
    }, 1500);
  };

  return (
    // 1. THE FIX: 'overflow-hidden' is REMOVED from this main container
    <div className="w-full bg-transparent rounded-xl shadow-lg">
      
      {/* 2. THE FIX: We apply rounding ONLY to the top corners of the header */}
      <div className="p-3 bg-yellow-400 flex items-center rounded-t-xl">
        <img src="/Maybank_Logo.png" alt="Maybank Logo" className="h-8" />
      </div>

      {/* 3. THE FIX: The main body gets its own background and bottom rounding */}
      <div className="p-6 space-y-4 text-left bg-yellow-50 rounded-b-xl">
        <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">FPX Business Application</h2>
            <p className="text-sm text-gray-600">Please fill in your details below.</p>
        </div>

        <div className="space-y-4 pt-4">
            <h3 className="font-bold text-gray-700">Business Information</h3>
            <div>
              <label className="text-xs font-medium text-gray-500">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isApplied} className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md disabled:bg-gray-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Business Name</label>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} disabled={isApplied} className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md disabled:bg-gray-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Business Registration No.</label>
              <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} disabled={isApplied} className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md disabled:bg-gray-200" />
            </div>
             <div>
              <label className="text-xs font-medium text-gray-500">Business Type</label>
              <input type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} disabled={isApplied} className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md disabled:bg-gray-200" />
            </div>
             <div>
              <label className="text-xs font-medium text-gray-500">Branch</label>
              <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} disabled={isApplied} className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md disabled:bg-gray-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Business Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} disabled={isApplied} rows="2" className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md disabled:bg-gray-200"></textarea>
            </div>
        </div>

        {!isApplied && (
            <button onClick={handleApplyWithUVS} disabled={isLoading} className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-all disabled:bg-gray-400">
            {isLoading ? 'Verifying with UVS...' : 'âœ¨ Auto-fill with UVS Passport'}
            </button>
        )}
        
        {isApplied && (
             <div className="p-4 mt-2 bg-green-100 border border-green-300 rounded-lg text-center">
                <p className="font-semibold text-green-800">âœ“ Application Approved!</p>
                <p className="text-sm text-green-700">All details were instantly verified by UVS.</p>
            </div>
        )}
      </div>
    </div>
  );
};