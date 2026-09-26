import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import DeadlineBadge from '../components/DeadlineBadge';
import MatchBreakdown from '../components/MatchBreakdown';
import DocumentChecklistWidget from '../components/DocumentChecklistWidget';
import StudentReportedTrackerWidget from '../components/StudentReportedTrackerWidget';
import { getValidOfficialUrl, getDomainFromUrl } from '../utils/urlUtils';
import { 
  Building2, 
  MapPin, 
  GraduationCap, 
  ExternalLink, 
  Bookmark, 
  ArrowLeft, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openLoginModal } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userApp, setUserApp] = useState(null);
  const [saved, setSaved] = useState(false);

  const userId = user?._id;

  // Stable useEffect to prevent re-render blinking loops
  useEffect(() => {
    let isMounted = true;
    
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/scholarships/${id}`);
        if (isMounted) setData(res.data);

        if (userId) {
          const appsRes = await API.get('/applications');
          const currentApp = appsRes.data.find(a => a.scholarship?._id === id);
          if (isMounted && currentApp) {
            setUserApp(currentApp);
            setSaved(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch scholarship details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [id, userId]);

  const handleToggleSave = async () => {
    if (!user) {
      openLoginModal();
      return;
    }

    try {
      const res = await API.post(`/applications/toggle-save/${id}`);
      setSaved(res.data.saved);
    } catch (err) {
      console.error('Failed to save scholarship:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="warm-card p-12 animate-pulse bg-slate-100 h-96"></div>
      </div>
    );
  }

  if (!data || !data.scholarship) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif text-slate-900">Scholarship Opportunity Not Found</h2>
        <p className="text-sm text-slate-600">The scholarship link may have expired or been updated.</p>
        <Link to="/discover" className="inline-block px-5 py-2.5 rounded-xl bg-[#EA580C] text-white font-bold text-sm">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const sch = data.scholarship;
  const matchScore = data.matchPercentage || 75;
  const validUrl = getValidOfficialUrl(sch);
  const providerDomain = validUrl ? getDomainFromUrl(validUrl) : (sch.providerDomain || 'official-portal.org');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#EA580C] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Scholarships
      </button>

      {/* Main Header Card */}
      <div className="warm-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-950 text-xs font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-700" />
                {matchScore}% Match Score
              </span>

              <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
                {sch.fundingType || 'Grant'}
              </span>

              {validUrl ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Official Portal Verified ({providerDomain})
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Official Application Link Unavailable
                </span>
              )}

              {sch.isSampleData && (
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold border border-slate-200">
                  Demo Opportunity
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif leading-tight">
              {sch.title}
            </h1>

            <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#EA580C]" />
              Provided by <strong className="text-slate-900">{sch.provider}</strong>
            </p>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleSave}
              className={`p-3 rounded-xl border font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                saved
                  ? 'bg-orange-100 border-orange-300 text-orange-900'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-orange-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-orange-600 text-orange-600' : ''}`} />
              {saved ? 'Saved' : 'Save'}
            </button>

            {validUrl ? (
              <a
                href={validUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                Apply on Official Website <ExternalLink className="w-4 h-4 text-amber-200" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="px-5 py-3.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed"
              >
                Official application link unavailable
              </button>
            )}
          </div>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FFFDF9] border border-[#F5EBE0]">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Funding</p>
            <p className="text-xl font-extrabold text-[#EA580C] mt-0.5 font-serif">
              {sch.currency || '₹'}{sch.amount ? sch.amount.toLocaleString('en-IN') : '0'}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Deadline Status</p>
            <div className="mt-1">
              <DeadlineBadge deadlineDate={sch.deadline} />
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Target Location</p>
            <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              {sch.location}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Education Level</p>
            <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              {sch.educationLevel ? sch.educationLevel.join(', ') : 'All'}
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-8">
          
          <MatchBreakdown
            matchPercentage={matchScore}
            matchedCriteria={data.matchedCriteria || []}
            missingCriteria={data.missingCriteria || []}
            eligibilityRisks={data.eligibilityRisks || []}
            breakdown={data.matchBreakdown}
            showTitle={true}
            expandedDefault={true}
          />

          <div className="warm-card p-6 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 font-serif">About This Opportunity</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {sch.description}
            </p>
          </div>

          <div className="warm-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Eligibility Guidelines</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase block text-[10px]">Academic Minimum</span>
                <span className="text-sm font-bold text-slate-900">
                  {sch.minAcademicPercentage > 0 ? `Min ${sch.minAcademicPercentage}% Marks / CGPA` : 'No minimum mark cap'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase block text-[10px]">Max Family Income</span>
                <span className="text-sm font-bold text-slate-900">
                  {sch.maxFamilyIncome < 10000000 ? `Max ₹${(sch.maxFamilyIncome/100000).toFixed(1)} Lakhs / year` : 'No upper income ceiling'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase block text-[10px]">Eligible Categories</span>
                <span className="text-sm font-bold text-slate-900">
                  {sch.categoryEligibility ? sch.categoryEligibility.join(', ') : 'All'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase block text-[10px]">Gender Eligibility</span>
                <span className="text-sm font-bold text-slate-900">
                  {sch.genderEligibility ? sch.genderEligibility.join(', ') : 'All'}
                </span>
              </div>
            </div>
          </div>

          <div className="warm-card p-6 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Selection Process & Evaluation</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {sch.selectionProcess}
            </p>
          </div>

        </div>

        {/* Right 1 Col */}
        <div className="space-y-6">
          
          <StudentReportedTrackerWidget
            scholarshipId={sch._id}
            scholarshipTitle={sch.title}
            applicationData={userApp}
            onStatusUpdated={(updatedApp) => setUserApp(updatedApp)}
          />

          <DocumentChecklistWidget
            scholarshipId={sch._id}
            requiredDocuments={sch.requiredDocuments || []}
            initialCompleted={userApp ? userApp.completedDocuments || [] : []}
          />

        </div>

      </div>

    </div>
  );
};

export default DetailsPage;
