import React, { useState, useEffect } from 'react';
import { Square, FileText, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const DocumentChecklistWidget = ({ scholarshipId, requiredDocuments = [], initialCompleted = [] }) => {
  const { user, openLoginModal } = useAuth();
  const [completed, setCompleted] = useState(initialCompleted);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCompleted(initialCompleted);
  }, [initialCompleted]);

  const toggleDocument = async (docName) => {
    if (!user) {
      openLoginModal();
      return;
    }

    let updated = [];
    if (completed.includes(docName)) {
      updated = completed.filter(d => d !== docName);
    } else {
      updated = [...completed, docName];
    }

    setCompleted(updated);
    setSaving(true);

    try {
      await API.put(`/applications/checklist/${scholarshipId}`, {
        completedDocuments: updated
      });
    } catch (err) {
      console.error('Failed to update document checklist:', err);
    } finally {
      setSaving(false);
    }
  };

  const totalCount = requiredDocuments.length || 1;
  const readyCount = completed.length;
  const progressPercent = Math.round((readyCount / totalCount) * 100);

  return (
    <div className="warm-card p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 font-serif flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#EA580C]" />
            Document Checklist
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">Track your application dossier preparation</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-extrabold text-[#EA580C]">{readyCount} / {totalCount}</span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Documents Ready</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-[#EA580C] to-[#F97316] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-2">
        {requiredDocuments.map((doc, idx) => {
          const isDone = completed.includes(doc);
          return (
            <div
              key={idx}
              onClick={() => toggleDocument(doc)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                isDone 
                  ? 'bg-orange-50/80 border-orange-200 text-orange-950 font-semibold' 
                  : 'bg-white border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50/40'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-[#EA580C] shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <span className="text-sm">{doc}</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                isDone ? 'bg-orange-200/80 text-orange-900' : 'bg-slate-100 text-slate-500'
              }`}>
                {isDone ? 'Ready' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>

      {progressPercent === 100 ? (
        <div className="p-3 bg-orange-100/80 border border-orange-300 rounded-xl text-center text-xs font-bold text-orange-950">
          🎉 All required documents are ready for submission!
        </div>
      ) : (
        <p className="text-[11px] text-slate-500 text-center">
          Click any document to mark it as completed. Progress is saved automatically to your dashboard.
        </p>
      )}
    </div>
  );
};

export default DocumentChecklistWidget;
