import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

const DeadlineBadge = ({ deadlineDate, compact = false }) => {
  if (!deadlineDate) return null;

  const target = new Date(deadlineDate);
  const now = new Date();
  const diffTime = target - now;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = target.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  if (daysLeft < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        Passed ({formattedDate})
      </span>
    );
  }

  if (daysLeft <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
        🔴 {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left ({formattedDate})
      </span>
    );
  }

  if (daysLeft <= 20) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        🟡 {daysLeft} days left ({formattedDate})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      🟢 {daysLeft} days left ({formattedDate})
    </span>
  );
};

export default DeadlineBadge;
