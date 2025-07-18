// src/components/DigitalPassport.jsx

import React from 'react';
import QRCode from 'react-qr-code';

const VerifiedField = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800 text-right">{value}</p>
  </div>
);

export const DigitalPassport = ({ passportData }) => {
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
        <VerifiedField label="Name" value={passportData.name} />
        <VerifiedField label="Business Name" value={passportData.business.name} />
        <VerifiedField label="Business Reg. No" value={passportData.business.reg_no} />
      </div>
      
      {/* THIS SECTION IS REPLACED */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
         <h3 className="text-md font-semibold text-gray-700 mb-2">Your Identity is Ready</h3>
         <p className="text-sm text-gray-600">
           Use your UVS Passport to instantly apply for services with our partners.
         </p>
      </div>

      <div className="p-6 flex flex-col items-center bg-white border-t">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Share via QR</h3>
        <div className="p-2 bg-white border rounded-lg">
          {/* This QR code now represents the key to their identity vault */}
          <QRCode value={JSON.stringify({ uid: passportData.uid })} size={128} />
        </div>
      </div>
    </div>
  );
};