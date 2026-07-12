"use client";

import React, { useState } from 'react';
import { Lock, Home, FileText, MapPin, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function HomeForm() {
  const [state, setState] = useState('WA');
  const [county, setCounty] = useState('Clark');
  const [buyerMax, setBuyerMax] = useState('');
  const [sellerMin, setSellerMin] = useState('');

  const bMax = parseFloat(buyerMax);
  const sMin = parseFloat(sellerMin);
  const hasValidInputs = !isNaN(bMax) && !isNaN(sMin);
  const isOverlap = hasValidInputs && bMax >= sMin;
  const midpoint = hasValidInputs ? (bMax + sMin) / 2 : 0;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto font-sans selection:bg-[#3F5C4C] selection:text-white">
      {/* HEADER SECTION */}
      <header className="mb-12 text-center md:text-left border-b border-[#16241D]/10 pb-6">
        <div className="inline-flex items-center gap-2 bg-[#3F5C4C]/10 text-[#3F5C4C] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <MapPin size={12} /> Pacific Northwest Regional Node
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#16241D] tracking-tight">
          Objective Reality Matching System
        </h1>
        <p className="text-[#3F5C4C] mt-2 font-medium">
          The AI Real Estate Emotion Detoxer • Independent WA/OR Portal
        </p>
      </header>

      {/* STEP 1: REGION SELECTOR */}
      <section className="bg-white border-2 border-[#16241D] p-6 rounded-xl shadow-[4px_4px_0px_0px_#16241D] mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#16241D]">
          <MapPin className="text-[#3F5C4C]" size={20} /> 1. Regional Jurisdiction Setup
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#16241D]/70 mb-2">Select State</label>
            <select 
              value={state} 
              onChange={(e) => {
                const s = e.target.value;
                setState(s);
                setCounty(s === 'WA' ? 'Clark' : 'Multnomah');
              }}
              className="w-full bg-[#F6F4EF] border-2 border-[#16241D] rounded-lg p-3 font-bold text-[#16241D] focus:outline-none"
            >
              <option value="WA">Washington (WA)</option>
              <option value="OR">Oregon (OR)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#16241D]/70 mb-2">Select County</label>
            <select 
              value={county} 
              onChange={(e) => setCounty(e.target.value)}
              className="w-full bg-[#F6F4EF] border-2 border-[#16241D] rounded-lg p-3 font-bold text-[#16241D] focus:outline-none"
            >
              {state === 'WA' ? (
                <>
                  <option value="Clark">Clark County</option>
                  <option value="King">King County</option>
                  <option value="Pierce">Pierce County</option>
                  <option value="Snohomish">Snohomish County</option>
                  <option value="Spokane">Spokane County</option>
                </>
              ) : (
                <>
                  <option value="Multnomah">Multnomah County</option>
                  <option value="Clackamas">Clackamas County</option>
                  <option value="Washington">Washington County</option>
                  <option value="Lane">Lane County</option>
                  <option value="Marion">Marion County</option>
                </>
              )}
            </select>
          </div>
        </div>
      </section>

      {/* STEP 2: THE NEGOTIATION BLACK BOX */}
      <section className="bg-white border-2 border-[#16241D] p-6 rounded-xl shadow-[4px_4px_0px_0px_#16241D] mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#16241D]">
            <Lock className="text-[#3F5C4C]" size={20} /> 2. The Negotiation Black Box (ZOPA Filter)
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <ShieldCheck size={14} /> Supabase RLS Secured
          </div>
        </div>
        
        <p className="text-sm text-[#3F5C4C] mb-6">
          Inputs are strictly isolated via Row Level Security (RLS). No human eyes, third-party agents, or opposing parties can intercept these un-submitted positions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#F6F4EF] p-4 rounded-lg border border-[#16241D]/20">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">Buyer Maximum Budget ($)</label>
            <input 
              type="number" 
              placeholder="e.g. 550000" 
              value={buyerMax}
              onChange={(e) => setBuyerMax(e.target.value)}
              className="w-full bg-white border-2 border-[#16241D] rounded-lg p-3 font-mono font-bold text-lg focus:outline-none"
            />
            <span className="text-[10px] text-[#3F5C4C] block mt-1.5 font-medium">Encrypted & masked from seller view</span>
          </div>

          <div className="bg-[#F6F4EF] p-4 rounded-lg border border-[#16241D]/20">
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Seller Minimum Walkaway ($)</label>
            <input 
              type="number" 
              placeholder="e.g. 520000" 
              value={sellerMin}
              onChange={(e) => setSellerMin(e.target.value)}
              className="w-full bg-white border-2 border-[#16241D] rounded-lg p-3 font-mono font-bold text-lg focus:outline-none"
            />
            <span className="text-[10px] text-[#3F5C4C] block mt-1.5 font-medium">Encrypted & masked from buyer view</span>
          </div>
        </div>

        {/* MATH ENGINE & OUTPUT */}
        {hasValidInputs && (
          <div className={`p-5 rounded-lg border-2 transition-all duration-300 ${isOverlap ? 'bg-emerald-50 border-emerald-600 text-emerald-950' : 'bg-amber-50 border-amber-500 text-amber-950'}`}>
            {isOverlap ? (
              <div>
                <h3 className="font-extrabold text-xl mb-2 flex items-center gap-2 text-emerald-800">
                  🎉 Objective Match Found!
                </h3>
                <p className="text-sm font-medium mb-4">
                  A Zone of Possible Agreement (ZOPA) exists between your numbers. Emotion successfully detoxed.
                </p>
                <div className="bg-white border border-emerald-200 rounded-md p-4 text-center shadow-sm">
                  <span className="block text-xs font-bold uppercase tracking-wider text-emerald-700/80 mb-1">Mathematical Equilibrium Price</span>
                  <span className="text-3xl font-black font-mono tracking-tight text-[#16241D]">
                    ${midpoint.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-extrabold text-lg mb-1 flex items-center gap-2 text-amber-800">
                  <AlertTriangle size={18} /> Reality Misalignment Detected
                </h3>
                <p className="text-sm font-medium">
                  Current math shows no direct overlay. The Seller walkaway price remains higher than the Buyer absolute threshold. Consider expanding parameters slightly to locate a structural path forward.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* FUTURE SUITE UPGRADES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="bg-[#F6F4EF] border border-[#16241D]/20 p-5 rounded-xl opacity-75 relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-[#16241D] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
            Pipeline
          </div>
          <h3 className="font-bold text-[#16241D] flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-[#3F5C4C]" /> Coexistence Index
          </h3>
          <p className="text-xs text-[#3F5C4C] font-medium">
            Automated regional hyper-local trends dashboard tailored for private sales.
          </p>
        </div>

        <div className="bg-[#F6F4EF] border border-[#16241D]/20 p-5 rounded-xl opacity-75 relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-[#16241D] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
            Pipeline
          </div>
          <h3 className="font-bold text-[#16241D] flex items-center gap-2 mb-1">
            <FileText size={16} className="text-[#3F5C4C]" /> HomeFax Passport
          </h3>
          <p className="text-xs text-[#3F5C4C] font-medium">
            Direct public data extraction for instant structural and legal title clarity.
          </p>
        </div>
      </section>

      {/* ARMORED RED LEGAL DISCLAIMER */}
      <footer className="bg-red-50 border-2 border-red-600 rounded-xl p-6 text-red-950 shadow-[4px_4px_0px_0px_#DC2626]">
        <h3 className="font-black text-sm uppercase tracking-wider text-red-700 flex items-center gap-2 mb-3">
          <AlertTriangle size={16} /> Armored Legal & Operational Disclaimers
        </h3>
        <div className="space-y-3 text-xs leading-relaxed font-medium text-red-900/90">
          <p>
