const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, applicationController.getUserApplications);
router.post('/save', verifyToken, applicationController.saveOrUpdateApplication);
router.post('/toggle-save/:scholarshipId', verifyToken, applicationController.toggleSaveScholarship);
router.put('/checklist/:scholarshipId', verifyToken, applicationController.updateDocumentChecklist);

module.exports = router;
