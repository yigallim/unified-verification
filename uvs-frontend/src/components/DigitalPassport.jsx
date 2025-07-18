import React from 'react';
import QRCode from 'react-qr-code';

const VerifiedField = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800 text-right">{value}</p>
  </div>
);

export const DigitalPassport = ({ passportData }) => {
  const data = passportData || {
    name: 'N/A',
    business: { name: 'N/A', reg_no: 'N/A' },
    passport: { age_verified: false, business_verified: false, photo_verified: false },
    uid: 'u-1022',
  };

  const [selectedPartners, setSelectedPartners] = React.useState([]);

  const togglePartner = (partner) => {
    setSelectedPartners((prev) =>
      prev.includes(partner)
        ? prev.filter((p) => p !== partner)
        : [...prev, partner]
    );
  };

  const shareData = {
    uid: data.uid,
    business_verified: data.passport.business_verified,
    age_verified: data.passport.age_verified,
    dob: data.dob || '1990-01-01',
  };

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
          Apply to services instantly with your UVS Passport. Select partners to share minimal data.
        </p>

        <div className="space-y-2 mb-4">
          {['TNG', 'Agrobank', 'FPX'].map((partner) => (
            <button
              key={partner}
              onClick={() => togglePartner(partner)}
              className={`w-full text-left p-2 rounded-md text-sm font-medium ${
                selectedPartners.includes(partner)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Share with {partner}
            </button>
          ))}
        </div>

        {selectedPartners.length > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Sharing with: {selectedPartners.join(', ')}
          </p>
        )}
      </div>

      <div className="p-6 flex flex-col items-center bg-white border-t">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Share via QR</h3>
        <div className="p-2 bg-white border rounded-lg">
          <QRCode value={JSON.stringify(shareData)} size={128} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Scan to share verified data with selected partners.
        </p>
      </div>
    </div>
  );
};