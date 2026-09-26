const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {}
  }
  next();
};

router.post('/nestguide', optionalAuth, aiController.askNestGuide);
router.get('/missing-analysis/:scholarshipId', optionalAuth, aiController.getMissingRequirementsAnalysis);

module.exports = router;
