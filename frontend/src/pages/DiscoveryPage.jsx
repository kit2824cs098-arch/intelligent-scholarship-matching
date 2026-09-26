import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import ScholarshipCard from '../components/ScholarshipCard';
import { 
  Search, 
  RotateCcw, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DiscoveryPage = () => {
  const { profile } = useAuth();
  
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCount: 0,
    totalFundingAvailable: 0,
    upcomingDeadlinesCount: 0,
    profileCompletion: 0
  });

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('All');
  const [educationLevel, setEducationLevel] = useState('All');
  const [field, setField] = useState('All');
  const [fullyFunded, setFullyFunded] = useState(false);
  const [urgentDeadline, setUrgentDeadline] = useState(false);
  const [minAmount, setMinAmount] = useState('');

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (location !== 'All') params.location = location;
      if (educationLevel !== 'All') params.educationLevel = educationLevel;
      if (field !== 'All') params.field = field;
      if (fullyFunded) params.fullyFunded = true;
      if (urgentDeadline) params.urgentDeadline = true;
      if (minAmount) params.minAmount = minAmount;

      const res = await API.get('/scholarships', { params });
      setScholarships(res.data.scholarships || []);
      setStats({
        totalCount: res.data.totalCount || 0,
        totalFundingAvailable: res.data.totalFundingAvailable || 0,
        upcomingDeadlinesCount: res.data.upcomingDeadlinesCount || 0,
        profileCompletion: res.data.profileCompletion || (profile ? profile.completionPercentage : 0)
      });
    } catch (err) {
      console.error('Failed to fetch scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [location, educationLevel, field, fullyFunded, urgentDeadline]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchScholarships();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocation('All');
    setEducationLevel('All');
    setField('All');
    setFullyFunded(false);
    setUrgentDeadline(false);
    setMinAmount('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE3D9] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#EA580C]">Scholarship Marketplace</span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif mt-1">
            Scholarships For You
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Opportunities sorted by transparent weighted match score for your profile.
          </p>
        </div>

        {/* Profile Completion Indicator */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#EAE3D9] shadow-xs">
          <div className="text-right">
            <p className="text-xs font-extrabold text-slate-900">
              Profile Completion: <span className="text-[#EA580C]">{stats.profileCompletion}%</span>
            </p>
            <p className="text-[10px] text-slate-500">Higher completion = precision matching</p>
          </div>
          <Link
            to="/onboarding"
            className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-900 text-xs font-bold border border-orange-200 hover:bg-orange-100"
          >
            Update
          </Link>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="warm-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 font-serif">{stats.totalCount}</p>
            <p className="text-xs text-slate-500 font-medium">Matching Scholarships</p>
          </div>
        </div>

        <div className="warm-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 font-serif">
              ₹{(stats.totalFundingAvailable / 100000).toFixed(1)} Lakhs
            </p>
            <p className="text-xs text-slate-500 font-medium">Estimated Funding Pool</p>
          </div>
        </div>

        <div className="warm-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 font-serif">{stats.upcomingDeadlinesCount}</p>
            <p className="text-xs text-slate-500 font-medium">Deadlines &lt; 15 Days</p>
          </div>
        </div>

        <div className="warm-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-[#FEF3C7]" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 font-serif">100%</p>
            <p className="text-xs text-slate-500 font-medium">Verified Eligibility Rules</p>
          </div>
        </div>

      </div>

      {/* Search & Filters Controls */}
      <div className="warm-card p-5 space-y-4">
        
        {/* Natural Language Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by scholarship title, field (e.g. Computer Science), or eligibility requirement..."
              className="w-full text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#EA580C]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Education Level</label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="All">All Education Levels</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="High School (10th/12th)">High School</option>
              <option value="Doctorate/PhD">Doctorate / PhD</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Location / State</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="All">All Locations</option>
              <option value="All India">All India</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Delhi">Delhi</option>
              <option value="Kerala">Kerala</option>
              <option value="International">International</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Field of Study</label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="All">All Fields</option>
              <option value="Engineering">Engineering & Tech</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Medicine">Medicine & Health</option>
              <option value="Commerce">Commerce & Finance</option>
              <option value="Arts">Arts & Humanities</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Min Amount (₹)</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              onBlur={fetchScholarships}
              placeholder="e.g. 50000"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            />
          </div>

          <div className="flex items-center pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={fullyFunded}
                onChange={(e) => setFullyFunded(e.target.checked)}
                className="w-4 h-4 accent-[#EA580C] rounded"
              />
              Fully Funded Only
            </label>
          </div>

          <div className="flex items-center pt-4 justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-rose-800">
              <input
                type="checkbox"
                checked={urgentDeadline}
                onChange={(e) => setUrgentDeadline(e.target.checked)}
                className="w-4 h-4 accent-rose-600 rounded"
              />
              Closing Soon
            </label>

            <button
              onClick={handleResetFilters}
              className="p-1.5 text-slate-400 hover:text-slate-700"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Scholarships Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="warm-card p-6 h-72 animate-pulse bg-slate-100"></div>
          ))}
        </div>
      ) : scholarships.length === 0 ? (
        <div className="warm-card p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl font-bold">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-serif">No Matching Scholarships Found</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Try resetting your filters or broadening your search criteria to discover more opportunities.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#EA580C] text-white font-bold text-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map(scholarship => (
            <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
          ))}
        </div>
      )}

    </div>
  );
};

export default DiscoveryPage;
