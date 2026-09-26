import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import DeadlineBadge from '../components/DeadlineBadge';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  FileCheck, 
  ArrowRight
} from 'lucide-react';

const DashboardPage = () => {
  const { user, profile, openLoginModal } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePipelineTab, setActivePipelineTab] = useState('All');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await API.get('/applications');
        setApplications(res.data || []);
      } catch (err) {
        console.error('Failed to fetch user applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center mx-auto text-2xl font-bold">
          🪹
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-serif">Your Scholarship Journey Awaits</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Sign in or create a student account to save scholarships, track application document checklists, and monitor upcoming deadlines.
        </p>
        <button
          onClick={openLoginModal}
          className="px-6 py-3 rounded-xl bg-[#EA580C] text-white font-extrabold text-sm shadow-md"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  // Pipeline Counts
  const savedCount = applications.filter(a => a.status === 'Saved').length;
  const preparingCount = applications.filter(a => a.status === 'Preparing').length;
  const appliedCount = applications.filter(a => a.status === 'Applied').length;
  const reviewCount = applications.filter(a => a.status === 'Under Review').length;
  const resultCount = applications.filter(a => a.status === 'Result').length;

  const filteredApplications = activePipelineTab === 'All' 
    ? applications 
    : applications.filter(a => a.status === activePipelineTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE3D9] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#EA580C]">Personal Student Dashboard</span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif mt-1">
            My Scholarship Journey
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track your saved opportunities, preparation dossiers, and upcoming deadlines.
          </p>
        </div>

        {/* Profile Completion Bar Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAE3D9] shadow-xs flex items-center gap-4 min-w-[280px]">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
              <span>Profile Completion</span>
              <span className="text-[#EA580C]">{profile?.completionPercentage || 50}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#EA580C] h-full"
                style={{ width: `${profile?.completionPercentage || 50}%` }}
              ></div>
            </div>
          </div>
          <Link
            to="/onboarding"
            className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-900 text-xs font-bold border border-orange-200 hover:bg-orange-100 shrink-0"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Visual Application Pipeline Stage Bar */}
      <div className="warm-card p-6 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 font-serif">Application Pipeline Overview</h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          
          <button
            onClick={() => setActivePipelineTab(activePipelineTab === 'Saved' ? 'All' : 'Saved')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activePipelineTab === 'Saved'
                ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
                : 'bg-[#FFFDF9] border-[#F5EBE0] hover:border-amber-300'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">Saved</span>
            <span className="text-2xl font-extrabold font-serif text-amber-900 block mt-1">{savedCount}</span>
            <span className="text-[10px] text-slate-500">Shortlisted</span>
          </button>

          <button
            onClick={() => setActivePipelineTab(activePipelineTab === 'Preparing' ? 'All' : 'Preparing')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activePipelineTab === 'Preparing'
                ? 'bg-orange-100 border-orange-400 text-orange-950 shadow-xs'
                : 'bg-[#FFFDF9] border-[#F5EBE0] hover:border-orange-300'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-orange-900 block">Preparing</span>
            <span className="text-2xl font-extrabold font-serif text-orange-900 block mt-1">{preparingCount}</span>
            <span className="text-[10px] text-slate-500">Docs Checklist</span>
          </button>

          <button
            onClick={() => setActivePipelineTab(activePipelineTab === 'Applied' ? 'All' : 'Applied')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activePipelineTab === 'Applied'
                ? 'bg-blue-100 border-blue-400 text-blue-950 shadow-xs'
                : 'bg-[#FFFDF9] border-[#F5EBE0] hover:border-blue-300'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block">Applied</span>
            <span className="text-2xl font-extrabold font-serif text-blue-900 block mt-1">{appliedCount}</span>
            <span className="text-[10px] text-slate-500">Submitted</span>
          </button>

          <button
            onClick={() => setActivePipelineTab(activePipelineTab === 'Under Review' ? 'All' : 'Under Review')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activePipelineTab === 'Under Review'
                ? 'bg-purple-100 border-purple-400 text-purple-950 shadow-xs'
                : 'bg-[#FFFDF9] border-[#F5EBE0] hover:border-purple-300'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 block">Under Review</span>
            <span className="text-2xl font-extrabold font-serif text-purple-900 block mt-1">{reviewCount}</span>
            <span className="text-[10px] text-slate-500">Screening</span>
          </button>

          <button
            onClick={() => setActivePipelineTab(activePipelineTab === 'Result' ? 'All' : 'Result')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activePipelineTab === 'Result'
                ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-xs'
                : 'bg-[#FFFDF9] border-[#F5EBE0] hover:border-emerald-300'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">Result</span>
            <span className="text-2xl font-extrabold font-serif text-emerald-900 block mt-1">{resultCount}</span>
            <span className="text-[10px] text-slate-500">Awarded</span>
          </button>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 font-serif">
              {activePipelineTab === 'All' ? 'All Tracked Applications' : `${activePipelineTab} Opportunities`}
            </h3>
            {activePipelineTab !== 'All' && (
              <button
                onClick={() => setActivePipelineTab('All')}
                className="text-xs font-bold text-[#EA580C] hover:underline cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          {loading ? (
            <div className="warm-card p-8 animate-pulse bg-slate-100 h-64"></div>
          ) : filteredApplications.length === 0 ? (
            <div className="warm-card p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto text-2xl font-bold border border-orange-200">
                🌱
              </div>
              <h4 className="text-xl font-bold text-slate-900 font-serif">No applications yet</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your next opportunity could be one search away. Explore scholarships matched to your education profile!
              </p>
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EA580C] text-white font-bold text-sm shadow-md"
              >
                Discover Scholarships <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => {
                const sch = app.scholarship;
                if (!sch) return null;
                const readyDocs = app.completedDocuments ? app.completedDocuments.length : 0;
                const totalDocs = sch.requiredDocuments ? sch.requiredDocuments.length : 1;

                return (
                  <div key={app._id} className="warm-card p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EA580C]/10 text-[#EA580C] border border-[#EA580C]/20">
                          Status: {app.status}
                        </span>
                        <Link to={`/scholarship/${sch._id}`} className="block hover:text-[#EA580C] transition-colors mt-1">
                          <h4 className="text-lg font-bold text-slate-900 font-serif">{sch.title}</h4>
                        </Link>
                        <p className="text-xs text-slate-500 font-medium">Provided by {sch.provider}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-lg font-extrabold text-[#EA580C] font-serif">
                          {sch.currency || '₹'}{sch.amount ? sch.amount.toLocaleString('en-IN') : '0'}
                        </p>
                        <DeadlineBadge deadlineDate={sch.deadline} />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <FileCheck className="w-4 h-4 text-[#EA580C]" />
                        <span>Document Dossier: <strong>{readyDocs} / {totalDocs}</strong> Ready</span>
                      </div>
                      <Link
                        to={`/scholarship/${sch._id}`}
                        className="font-bold text-[#EA580C] hover:underline"
                      >
                        Manage Checklist →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col */}
        <div className="space-y-6">
          <div className="warm-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-slate-900 font-serif flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#D97706]" />
                Upcoming Deadlines
              </h4>
              <Link to="/deadlines" className="text-xs font-bold text-[#EA580C] hover:underline">
                View Full Calendar
              </Link>
            </div>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-500">Save scholarships to populate your deadline tracker calendar.</p>
            ) : (
              <div className="space-y-3 pt-2">
                {applications.slice(0, 5).map((app) => {
                  const sch = app.scholarship;
                  if (!sch) return null;
                  return (
                    <div key={app._id} className="p-3 bg-[#FFFDF9] rounded-xl border border-[#F5EBE0] space-y-1">
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{sch.title}</h5>
                      <DeadlineBadge deadlineDate={sch.deadline} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
