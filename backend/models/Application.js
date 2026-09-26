const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scholarship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship',
    required: true
  },
  status: {
    type: String,
    enum: ['Saved', 'Preparing', 'Applied', 'Under Review', 'Result'],
    default: 'Saved'
  },
  resultStatus: {
    type: String,
    enum: ['Pending', 'Awarded', 'Not Awarded'],
    default: 'Pending'
  },
  isStudentReported: { type: Boolean, default: true },
  notes: { type: String, default: '' },
  completedDocuments: [{ type: String }],
  appliedAt: { type: Date },
  updatedAt: { type: Date, default: Date.now }
});

ApplicationSchema.index({ user: 1, scholarship: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
