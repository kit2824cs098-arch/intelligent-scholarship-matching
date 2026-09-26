import React, { useState, useEffect } from 'react';
import API from '../services/api';
import DeadlineBadge from '../components/DeadlineBadge';
import { Calendar as CalendarIcon, Bell, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const DeadlineTrackerPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await API.get('/scholarships');
        setScholarships(res.data.scholarships || []);
      } catch (err) {
        console.error('Failed to fetch deadline data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleReminder = (id) => {
    setReminders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const now = new Date();
  
  const todayList = [];
  const thisWeekList = [];
  const thisMonthList = [];
  const laterList = [];

  scholarships.forEach((s) => {
    const target = new Date(s.deadline);
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1 && diffDays >= 0) {
      todayList.push(s);
    } else if (diffDays <= 7 && diffDays > 1) {
      thisWeekList.push(s);
    } else if (diffDays <= 30 && diffDays > 7) {
      thisMonthList.push(s);
    } else if (diffDays > 30) {
      laterList.push(s);
    }
  });

  const renderDeadlineGroup = (title, list, badgeColorClass) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-[#EAE3D9] pb-2">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${badgeColorClass}`}>
          {list.length}
        </span>
        <h3 className="text-lg font-bold font-serif text-slate-900">{title}</h3>
      </div>

      {list.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No scholarship deadlines scheduled in this window.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((s) => (
            <div key={s._id} className="warm-card p-5 space-y-3 relative group">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link to={`/scholarship/${s._id}`} className="hover:text-[#EA580C] transition-colors">
                    <h4 className="text-base font-bold text-slate-900 font-serif leading-snug line-clamp-1">{s.title}</h4>
                  </Link>
                  <p className="text-xs text-slate-500 font-medium">Provided by {s.provider}</p>
                </div>

                <button
                  onClick={() => toggleReminder(s._id)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    reminders[s._id]
                      ? 'bg-orange-100 border-orange-300 text-orange-950'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-orange-600'
                  }`}
                  title="Toggle Email Reminder"
                >
                  <Bell className={`w-4 h-4 ${reminders[s._id] ? 'fill-orange-600 text-orange-600' : ''}`} />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <DeadlineBadge deadlineDate={s.deadline} />

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#EA580C]">
                    {s.currency || '₹'}{s.amount ? s.amount.toLocaleString('en-IN') : '0'}
                  </span>
                  <a
                    href={s.officialUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-500 hover:text-[#EA580C]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#EAE3D9] pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#EA580C]">Urgency & Deadlines</span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-serif mt-1 flex items-center gap-2">
          <CalendarIcon className="w-8 h-8 text-[#EA580C]" />
          Scholarship Deadline Tracker
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Stay on top of upcoming closing dates to submit your documents on time.
        </p>
      </div>

      {loading ? (
        <div className="warm-card p-12 animate-pulse bg-slate-100 h-64"></div>
      ) : (
        <div className="space-y-10">
          {renderDeadlineGroup('Closing Today / Urgent', todayList, 'bg-rose-100 text-rose-900 border border-rose-300')}
          {renderDeadlineGroup('Closing This Week', thisWeekList, 'bg-amber-100 text-amber-900 border border-amber-300')}
          {renderDeadlineGroup('Closing This Month', thisMonthList, 'bg-orange-100 text-orange-950 border border-orange-300')}
          {renderDeadlineGroup('Later Opportunities', laterList, 'bg-slate-100 text-slate-800 border border-slate-300')}
        </div>
      )}

    </div>
  );
};

export default DeadlineTrackerPage;
