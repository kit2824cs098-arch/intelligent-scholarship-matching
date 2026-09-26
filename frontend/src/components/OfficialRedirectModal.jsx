import React from 'react';
import { ExternalLink, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { getValidOfficialUrl, getDomainFromUrl } from '../utils/urlUtils';

const OfficialRedirectModal = ({ 
  isOpen, 
  onClose, 
  scholarship, 
  onConfirmRedirect 
}) => {
  if (!isOpen || !scholarship) return null;

  const validUrl = getValidOfficialUrl(scholarship);
  const destinationDomain = validUrl ? getDomainFromUrl(validUrl) : 'Unavailable';

  const handleLinkClick = () => {
    if (onConfirmRedirect) {
      onConfirmRedirect();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#EAE3D9] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#EA580C] to-[#F97316] p-6 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#EA580C] flex items-center justify-center mx-auto mb-3 shadow-md">
            <ExternalLink className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold font-serif">
            You’re leaving ScholarNest
          </h3>
          <p className="text-xs text-orange-100 mt-1 max-w-sm mx-auto leading-relaxed">
            You will be redirected to the official scholarship application website. ScholarNest does not submit applications or collect application decisions.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-slate-800">
          
          {/* Target Summary Card */}
          <div className="p-4 bg-[#FFFDF9] border border-[#F5EBE0] rounded-2xl space-y-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Scholarship</span>
              <h4 className="text-base font-bold text-slate-900 font-serif leading-snug">{scholarship.title}</h4>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Official Provider</span>
                <span className="font-bold text-slate-800">{scholarship.provider}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Destination Domain</span>
                <span className="font-bold text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  🌐 {destinationDomain}
                </span>
              </div>
            </div>
          </div>

          {validUrl ? (
            <>
              {/* Verification Badge */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>✓ Official provider link verified by ScholarNest admin</span>
              </div>

              {/* Target URL Preview */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 truncate">
                <span className="font-bold text-slate-700">Destination URL: </span>
                <span className="font-mono text-slate-600">{validUrl}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Official application link unavailable.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>

            {validUrl ? (
              <a
                href={validUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="flex-2 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Continue to Official Website <ExternalLink className="w-4 h-4 text-amber-200" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex-2 py-3 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed text-center"
              >
                Official application link unavailable
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default OfficialRedirectModal;
