import React from 'react';

const HeroIllustration = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto p-4 select-none">
      {/* Soft warm orange background decorative blob */}
      <div className="absolute -top-6 -left-6 w-72 h-72 bg-orange-100/70 rounded-full blur-2xl -z-10"></div>
      <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-amber-100/70 rounded-full blur-2xl -z-10"></div>

      <svg viewBox="0 0 500 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-sm">
        {/* Desk / Base Surface */}
        <rect x="40" y="360" width="420" height="12" rx="6" fill="#EAE3D9" />

        {/* Map / Location Graphic Element */}
        <rect x="60" y="80" width="180" height="240" rx="16" fill="#FFFDF9" stroke="#EAE3D9" strokeWidth="2" />
        <path d="M 80 120 L 220 120" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 80 160 L 200 160" stroke="#F1F5F9" strokeWidth="2" />
        <path d="M 80 200 L 220 200" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 80 240 L 190 240" stroke="#F1F5F9" strokeWidth="2" />
        {/* Map Pin in Warm Orange */}
        <g transform="translate(150, 140)">
          <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="#EA580C" />
        </g>
        <text x="75" y="105" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="sans-serif">Scholarship Map</text>

        {/* Calendar / Deadline Floating Card */}
        <g transform="translate(260, 50)" className="animate-pulse-subtle">
          <rect width="160" height="110" rx="12" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" shadow="sm" />
          <rect width="160" height="32" rx="12" fill="#FFEDD5" />
          <text x="16" y="21" fill="#C2410C" fontSize="12" fontWeight="700" fontFamily="sans-serif">📅 Deadline Alert</text>
          <text x="16" y="60" fill="#0F172A" fontSize="14" fontWeight="800" fontFamily="sans-serif">Oct 18, 2026</text>
          <text x="16" y="80" fill="#EA580C" fontSize="11" fontWeight="600" fontFamily="sans-serif">✓ 12 Days Remaining</text>
          <circle cx="130" cy="70" r="14" fill="#EA580C" />
          <path d="M 124 70 L 128 74 L 136 66" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Student Illustration */}
        <g transform="translate(190, 160)">
          {/* Chair / Desk Body */}
          <ellipse cx="60" cy="180" rx="55" ry="12" fill="#CBD5E1" opacity="0.6" />
          
          {/* Torso */}
          <path d="M 25 150 C 25 100, 95 100, 95 150 Z" fill="#EA580C" />
          {/* Amber Accent */}
          <path d="M 38 120 L 52 160 L 68 160 L 82 120" fill="#F59E0B" />

          {/* Head & Hair */}
          <circle cx="60" cy="75" r="24" fill="#FDE68A" />
          <path d="M 36 72 C 36 45, 84 45, 84 72 C 84 60, 70 50, 60 50 C 50 50, 36 60, 36 72 Z" fill="#1E293B" />
          
          {/* Glasses */}
          <circle cx="52" cy="74" r="6" stroke="#0F172A" strokeWidth="2" fill="none" />
          <circle cx="68" cy="74" r="6" stroke="#0F172A" strokeWidth="2" fill="none" />
          <line x1="58" y1="74" x2="62" y2="74" stroke="#0F172A" strokeWidth="2" />
          {/* Smile */}
          <path d="M 54 84 Q 60 88 66 84" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Hands holding Laptop/Notebook */}
          <rect x="25" y="140" width="70" height="40" rx="6" fill="#1E293B" />
          <rect x="30" y="145" width="60" height="30" rx="4" fill="#FFFDF9" />
          <text x="35" y="164" fill="#EA580C" fontSize="9" fontWeight="800" fontFamily="sans-serif">92% MATCH</text>
        </g>

        {/* Floating Checklist Element */}
        <g transform="translate(40, 240)">
          <rect width="140" height="100" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <text x="14" y="24" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="sans-serif">Document Checklist</text>
          <circle cx="22" cy="45" r="6" fill="#EA580C" />
          <path d="M 19 45 L 21 47 L 25 43" stroke="#FFF" strokeWidth="1.5" />
          <text x="34" y="48" fill="#334155" fontSize="10" fontFamily="sans-serif">Marksheet</text>

          <circle cx="22" cy="65" r="6" fill="#EA580C" />
          <path d="M 19 65 L 21 67 L 25 63" stroke="#FFF" strokeWidth="1.5" />
          <text x="34" y="68" fill="#334155" fontSize="10" fontFamily="sans-serif">Income Certificate</text>

          <circle cx="22" cy="85" r="6" fill="#F59E0B" />
          <text x="34" y="88" fill="#334155" fontSize="10" fontFamily="sans-serif">ID Proof (Pending)</text>
        </g>

        {/* Financial / Education Symbols */}
        <g transform="translate(320, 190)">
          <rect width="130" height="90" rx="12" fill="#0F172A" />
          <path d="M 35 30 L 65 18 L 95 30 L 65 42 Z" fill="#F97316" />
          <path d="M 45 37 L 45 48 C 45 54, 85 54, 85 48 L 85 37" fill="#EA580C" />
          <text x="25" y="70" fill="#FFFDF9" fontSize="13" fontWeight="800" fontFamily="sans-serif">₹1,00,000</text>
          <text x="25" y="82" fill="#94A3B8" fontSize="9" fontFamily="sans-serif">Direct Grant Assistance</text>
        </g>
      </svg>
    </div>
  );
};

export default HeroIllustration;
