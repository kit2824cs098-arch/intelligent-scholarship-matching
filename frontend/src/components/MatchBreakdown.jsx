import React from 'react';
import { CheckCircle2, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';

const MatchBreakdown = ({ 
  matchPercentage = 70, 
  matchedCriteria = [], 
  missingCriteria = [], 
  eligibilityRisks = [],
  breakdown = null,
  showTitle = true,
  expandedDefault = true
}) => {
  const [expanded, setExpanded] = React.useState(expandedDefault);

  const getMatchBadgeStyle = (score) => {
    if (score >= 85) return 'bg-orange-100 text-orange-950 border-orange-300';
    if (score >= 65) return 'bg-amber-100 text-amber-950 border-amber-300';
    if (score >= 45) return 'bg-amber-50 text-amber-900 border-amber-200';
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#EAE3D9] rounded-xl p-4 sm:p-5 text-slate-800 transition-all">
      <div 
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl border text-base font-extrabold flex items-center gap-1.5 shadow-xs ${getMatchBadgeStyle(matchPercentage)}`}>
            <span className="text-lg">{matchPercentage}%</span>
            <span className="text-xs font-bold uppercase tracking-wider">Match</span>
          </div>
          {showTitle && (
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Explainable Eligibility Breakdown</h4>
              <p className="text-xs text-slate-500">Weighted transparent criteria evaluation</p>
            </div>
          )}
        </div>

        <button className="text-slate-400 hover:text-slate-700 p-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#EAE3D9] space-y-4">
          
          {/* Weighted factor progress bars */}
          {breakdown && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Academic (25%)</span>
                  <span>{breakdown.academicScore || 0}/25</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#EA580C] h-full" style={{ width: `${((breakdown.academicScore || 0)/25)*100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Financial (20%)</span>
                  <span>{breakdown.financialScore || 0}/20</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#D97706] h-full" style={{ width: `${((breakdown.financialScore || 0)/20)*100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Course (20%)</span>
                  <span>{breakdown.courseScore || 0}/20</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: `${((breakdown.courseScore || 0)/20)*100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Location (15%)</span>
                  <span>{breakdown.locationScore || 0}/15</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full" style={{ width: `${((breakdown.locationScore || 0)/15)*100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Demographics (10%)</span>
                  <span>{breakdown.demographicScore || 0}/10</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-700 h-full" style={{ width: `${((breakdown.demographicScore || 0)/10)*100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Achievements (10%)</span>
                  <span>{breakdown.achievementScore || 0}/10</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full" style={{ width: `${((breakdown.achievementScore || 0)/10)*100}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Matched Criteria */}
          {matchedCriteria.length > 0 && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-orange-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
                Why You Match ({matchedCriteria.length})
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {matchedCriteria.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-orange-50/70 p-2 rounded-lg border border-orange-200/80">
                    <span className="text-[#EA580C] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Criteria / Almost There */}
          {missingCriteria.length > 0 && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Things To Check / Almost There ({missingCriteria.length})
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {missingCriteria.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-amber-50/70 p-2 rounded-lg border border-amber-200/80">
                    <span className="text-amber-600 font-bold">⚠</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eligibility Risks */}
          {eligibilityRisks.length > 0 && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-rose-600" />
                Important Reminders & Document Checks
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {eligibilityRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-rose-50/60 p-2 rounded-lg border border-rose-200/80">
                    <span className="text-rose-600 font-bold">!</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default MatchBreakdown;
