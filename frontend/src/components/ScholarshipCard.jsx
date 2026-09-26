import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, GraduationCap, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import DeadlineBadge from './DeadlineBadge';
import MatchBreakdown from './MatchBreakdown';
import { getValidOfficialUrl, getDomainFromUrl } from '../utils/urlUtils';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const ScholarshipCard = ({ scholarship, isSaved = false, onToggleSave = null }) => {
  const { user, openLoginModal } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const [savingLoading, setSavingLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openLoginModal();
      return;
    }

    setSavingLoading(true);
    try {
      const res = await API.post(`/applications/toggle-save/${scholarship._id}`);
      setSaved(res.data.saved);
      if (onToggleSave) onToggleSave(scholarship._id, res.data.saved);
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setSavingLoading(false);
    }
  };

  const matchPercentage = scholarship.matchPercentage || 75;
  const validUrl = getValidOfficialUrl(scholarship);
  const providerDomain = validUrl ? getDomainFromUrl(validUrl) : (scholarship.providerDomain || 'official-portal.org');

  return (
    <div className="warm-card relative flex flex-col justify-between p-5 sm:p-6 group">
      <div>
        {/* Top Header: Badge & Save Button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Match score pill */}
            <button
              type="button"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="px-3 py-1 rounded-full bg-[#FFEDD5] border border-[#FED7AA] text-[#C2410C] text-xs font-extrabold flex items-center gap-1 hover:bg-[#FDBA74]/40 transition-all cursor-pointer"
            >
              <span>{matchPercentage}% Match</span>
              <span className="text-[10px] text-orange-900 underline font-normal">(Why?)</span>
            </button>

            {/* Funding type tag */}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {scholarship.fundingType || 'Grant'}
            </span>

            {/* Sample data indicator badge */}
            {scholarship.isSampleData && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                Demo Opportunity
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveToggle}
            disabled={savingLoading}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              saved
                ? 'bg-orange-100 border-orange-300 text-orange-900'
                : 'bg-white border-[#EAE3D9] text-slate-400 hover:text-orange-600 hover:bg-orange-50'
            }`}
            title={saved ? 'Remove from saved' : 'Save scholarship'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-orange-600' : ''}`} />
          </button>
        </div>

        {/* Scholarship Name & Provider */}
        <Link to={`/scholarship/${scholarship._id}`} className="block group-hover:text-[#EA580C] transition-colors">
          <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 font-serif">
            {scholarship.title}
          </h3>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1 mb-3 text-xs">
          <p className="font-semibold text-slate-500">
            Provider: <span className="text-slate-800 font-bold">{scholarship.provider}</span>
          </p>

          {validUrl ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 w-fit">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Official Application Available ({providerDomain})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 w-fit">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              Official Link Unavailable
            </span>
          )}
        </div>

        {/* Key Metrics: Amount & Location */}
        <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-[#FFFDF9] border border-[#F5EBE0]">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Funding Amount</p>
            <p className="text-lg font-extrabold text-[#EA580C]">
              {scholarship.currency || '₹'}{scholarship.amount ? scholarship.amount.toLocaleString('en-IN') : '0'}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Eligibility Level</p>
            <p className="text-xs font-bold text-slate-800 truncate mt-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              {scholarship.educationLevel ? scholarship.educationLevel.join(', ') : 'All Levels'}
            </p>
          </div>
        </div>

        {/* Location & Fields tags */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-4">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            {scholarship.location || 'All India'}
          </span>
          <span className="text-slate-300">•</span>
          <span className="truncate max-w-[200px] text-slate-500">
            {scholarship.fieldsOfStudy ? scholarship.fieldsOfStudy.join(', ') : 'General'}
          </span>
        </div>

        {/* Breakdown Accordion if expanded */}
        {showBreakdown && (
          <div className="my-3">
            <MatchBreakdown
              matchPercentage={matchPercentage}
              matchedCriteria={scholarship.matchedCriteria || []}
              missingCriteria={scholarship.missingCriteria || []}
              eligibilityRisks={scholarship.eligibilityRisks || []}
              breakdown={scholarship.matchBreakdown}
              showTitle={false}
              expandedDefault={true}
            />
          </div>
        )}
      </div>

      {/* Footer Actions & Deadline */}
      <div className="pt-4 border-t border-[#EAE3D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <DeadlineBadge deadlineDate={scholarship.deadline} />

        <div className="flex items-center gap-2">
          <Link
            to={`/scholarship/${scholarship._id}`}
            className="px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            View Eligibility
          </Link>
          
          {validUrl ? (
            <a
              href={validUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-extrabold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              Apply on Official Website <ExternalLink className="w-3 h-3 text-amber-200" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="px-3 py-2 rounded-xl bg-slate-200 text-slate-500 text-[11px] font-bold cursor-not-allowed"
            >
              Official application link unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;
