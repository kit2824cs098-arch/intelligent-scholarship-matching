import React, { useState } from 'react';
import { CheckCircle2, Clock, Calendar, Edit3, ShieldAlert, FileText, Info } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentReportedTrackerWidget = ({ scholarshipId, scholarshipTitle, applicationData, onStatusUpdated }) => {
  const { user, openLoginModal } = useAuth();
  const [currentApp, setCurrentApp] = useState(applicationData);
  const [notes, setNotes] = useState(applicationData?.notes || '');
  const [resultStatus, setResultStatus] = useState(applicationData?.resultStatus || 'Pending');
  const [editingNotes, setEditingNotes] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpdateStatus = async (newStatus) => {
    if (!user) {
      openLoginModal();
      return;
    }

    setSaving(true);
    try {
      const res = await API.post('/applications/save', {
        scholarshipId,
        status: newStatus,
        notes,
        resultStatus
      });
      setCurrentApp(res.data.application);
      if (onStatusUpdated) onStatusUpdated(res.data.application);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await API.post('/applications/save', {
        scholarshipId,
        status: currentApp?.status || 'Applied',
        notes,
        resultStatus
      });
      setCurrentApp(res.data.application);
      setEditingNotes(false);
      if (onStatusUpdated) onStatusUpdated(res.data.application);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="warm-card p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 font-serif flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#EA580C]" />
            Application Tracking
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">Track your progress post-official website redirect</p>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
          <Info className="w-3 h-3 text-amber-700" />
          Student-Reported Status
        </span>
      </div>

      {/* Have you applied question box if not applied yet */}
      {(!currentApp || currentApp.status === 'Saved' || currentApp.status === 'Preparing') ? (
        <div className="p-4 bg-[#FFFDF9] border border-[#F5EBE0] rounded-2xl space-y-3">
          <p className="text-xs font-bold text-slate-900">
            Have you completed your application on the official website?
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleUpdateStatus('Applied')}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs shadow-xs cursor-pointer"
            >
              Yes, I Applied
            </button>
            <button
              onClick={() => handleUpdateStatus('Preparing')}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Not Yet (Preparing)
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600">Current Status:</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#EA580C] text-white">
              {currentApp.status}
            </span>
          </div>

          {currentApp.appliedAt && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              Applied Date: {new Date(currentApp.appliedAt).toLocaleDateString('en-IN')}
            </p>
          )}
        </div>
      )}

      {/* Status Stage Toggles */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">Update Application Stage</label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {['Preparing', 'Applied', 'Under Review', 'Result'].map((st) => (
            <button
              key={st}
              onClick={() => handleUpdateStatus(st)}
              className={`py-2 px-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                currentApp?.status === st
                  ? 'bg-[#EA580C] text-white border-[#EA580C]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-orange-50/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Outcome / Result Selector */}
      {currentApp?.status === 'Result' && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <label className="block text-xs font-bold text-slate-700">Scholarship Award Outcome</label>
          <div className="flex gap-2">
            {['Pending', 'Awarded', 'Not Awarded'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setResultStatus(r);
                  handleUpdateStatus('Result');
                }}
                className={`py-1.5 px-3 rounded-lg border text-xs font-bold ${
                  currentApp?.resultStatus === r
                    ? r === 'Awarded' 
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Application Notes */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Application Notes
          </span>
          {!editingNotes && (
            <button
              onClick={() => setEditingNotes(true)}
              className="text-[#EA580C] font-bold hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {editingNotes ? (
          <div className="space-y-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add personal application reference number, login details, or notes..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#EA580C]"
            ></textarea>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingNotes(false)}
                className="px-3 py-1 rounded-lg border border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                className="px-3 py-1 rounded-lg bg-[#EA580C] text-white font-bold"
              >
                Save Note
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 italic">
            {currentApp?.notes || 'No notes added yet. Click edit to add application ID or details.'}
          </p>
        )}
      </div>

    </div>
  );
};

export default StudentReportedTrackerWidget;
