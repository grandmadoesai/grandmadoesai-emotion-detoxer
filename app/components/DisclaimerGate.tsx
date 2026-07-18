// UPDATE THIS COMPONENT IN THE FRONTEND TO INCLUDE THE NEW DISCLAIMER
import React, { useState } from 'react';

export default function LegalNoticeModal({ onAccept }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (e) => {
    const target = e.target;
    // Checks if user scrolled to the bottom of the legal text
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
        
        <h2 className="text-xl font-bold text-gray-900 mb-2 border-b pb-2">Important Legal Notice</h2>
        <p className="text-xs font-semibold text-red-600 mb-4 uppercase tracking-wider">
          APPLICATION DISCLAIMER • CRITICAL LEGAL NOTICE, LEGAL DISCLAIMER & DATA PRIVACY AGREEMENT
        </p>

        {/* Scrollable Text Box */}
        <div 
          onScroll={handleScroll}
          className="overflow-y-auto pr-2 text-sm text-gray-700 space-y-4 mb-6 border p-4 bg-gray-50 rounded"
          style={{ maxHeight: '50vh' }}
        >
          <p className="font-bold text-gray-900">
            IMPORTANT: BY ACCESSING OR USING THIS APPLICATION, YOU EXPLICITLY AGREE TO BE BOUND BY ALL THE TERMS AND CONDITIONS STATED BELOW. IF YOU DO NOT AGREE, YOU MUST IMMEDIATELY CEASE AND TERMINATE ANY USE OF THIS PLATFORM.
          </p>

          <div>
            <h3 className="font-bold text-gray-900 mb-1">1. ABSOLUTE DATA PRIVACY & ENCRYPTION GUARANTEE (NO HUMAN FACTOR)</h3>
            <p>
              All private numbers, financial offers, maximum budgets, and minimum acceptable prices entered into this system are strictly LOCKED, FULLY ENCRYPTED, and processed automatically by an unmonitored AI algorithm.
            </p>
            <p className="mt-2 font-semibold">
              NO HUMAN BEING — including the creator of this application, the administrators, the owners of the "Grandma Goes AI" YouTube channel, or any third party — has the technical ability or legal authorization to view, access, inspect, or manipulate individual private numbers. The application functions blindly and outputs only the automated final match (ZOPA - Zone of Possible Agreement).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-1">2. NOT A LICENSED REAL ESTATE BROKER OR AGENT</h3>
            <p>
              This application, its creators, operators, owners, and affiliates are NOT licensed real estate brokers, salespersons, agents, or attorneys within the State of Washington, the State of Oregon, or anywhere within the United States of America.
            </p>
            <p className="mt-2">
              This platform does NOT perform any licensed real estate activities. We do not solicit listings.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-1 text-red-700">3. THIRD-PARTY DATA DISCLAIMER & LIMITATION OF LIABILITY</h3>
            <p>
              This application automatically fetches, processes, and aggregates public property information from external third-party platforms, including public real estate listing websites and municipal or county property records databases.
            </p>
            <p className="mt-2">
              The creators and operators of this application do not guarantee the 100% accuracy, completeness, timeliness, availability, or reliability of any data retrieved from these external sources. All information provided by this platform is for educational and analytical comparison purposes only, and should be independently verified by the user before making any financial decisions or real estate commitments.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t">
          <button
            disabled={!hasScrolledToBottom}
            onClick={onAccept}
            className={`px-6 py-2.5 rounded font-semibold text-white transition-all ${
              hasScrolledToBottom 
                ? 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer' 
                : 'bg-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            {hasScrolledToBottom ? 'I Agree & Continue' : 'Please Scroll Down to Read & Agree'}
          </button>
        </div>

      </div>
    </div>
  );
}
