const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/stats', verifyToken, verifyAdmin, adminController.getAdminStats);
router.patch('/verify/:id', verifyToken, verifyAdmin, adminController.verifyScholarship);
router.post('/seed-reset', verifyToken, verifyAdmin, adminController.runSeed);

module.exports = router;
