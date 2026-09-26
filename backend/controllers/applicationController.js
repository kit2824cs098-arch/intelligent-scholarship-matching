const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');

exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate('scholarship')
      .sort({ updatedAt: -1 });
    
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveOrUpdateApplication = async (req, res) => {
  try {
    const { scholarshipId, status, notes, completedDocuments } = req.body;
    
    if (!scholarshipId) {
      return res.status(400).json({ error: 'Scholarship ID is required.' });
    }

    let application = await Application.findOne({ user: req.user.id, scholarship: scholarshipId });

    if (application) {
      if (status) application.status = status;
      if (notes !== undefined) application.notes = notes;
      if (completedDocuments) application.completedDocuments = completedDocuments;
      if (status === 'Applied' && !application.appliedAt) {
        application.appliedAt = new Date();
      }
      application.updatedAt = new Date();
      await application.save();
    } else {
      application = await Application.create({
        user: req.user.id,
        scholarship: scholarshipId,
        status: status || 'Saved',
        notes: notes || '',
        completedDocuments: completedDocuments || [],
        appliedAt: status === 'Applied' ? new Date() : null
      });
    }

    const populated = await Application.findById(application._id).populate('scholarship');
    res.json({ message: 'Application saved successfully', application: populated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleSaveScholarship = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    const existing = await Application.findOne({ user: req.user.id, scholarship: scholarshipId });

    if (existing) {
      await Application.findByIdAndDelete(existing._id);
      res.json({ message: 'Scholarship removed from saved list', saved: false });
    } else {
      const newApp = await Application.create({
        user: req.user.id,
        scholarship: scholarshipId,
        status: 'Saved'
      });
      res.json({ message: 'Scholarship saved to your journey', saved: true, application: newApp });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDocumentChecklist = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    const { completedDocuments } = req.body;

    let application = await Application.findOne({ user: req.user.id, scholarship: scholarshipId });
    if (!application) {
      application = await Application.create({
        user: req.user.id,
        scholarship: scholarshipId,
        status: 'Preparing',
        completedDocuments
      });
    } else {
      application.completedDocuments = completedDocuments;
      if (application.status === 'Saved' && completedDocuments.length > 0) {
        application.status = 'Preparing';
      }
      application.updatedAt = new Date();
      await application.save();
    }

    res.json({ message: 'Document checklist updated', completedDocuments: application.completedDocuments, application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
