const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Optional auth middleware helper to extract user if token present without requiring it
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      // ignore token error for optional auth
    }
  }
  next();
};

router.get('/', optionalAuth, scholarshipController.getAllScholarships);
router.get('/:id', optionalAuth, scholarshipController.getScholarshipById);

// Admin endpoints
router.post('/', verifyToken, verifyAdmin, scholarshipController.createScholarship);
router.put('/:id', verifyToken, verifyAdmin, scholarshipController.updateScholarship);
router.delete('/:id', verifyToken, verifyAdmin, scholarshipController.deleteScholarship);

module.exports = router;
