const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedDB = require('./seed/seedRunner');
const Scholarship = require('./models/Scholarship');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection & Auto-Seeding
connectDB().then(async () => {
  try {
    const count = await Scholarship.countDocuments({});
    if (count === 0) {
      console.log('[Startup] No scholarships found in DB. Auto-seeding initial dataset...');
      await seedDB();
    }
  } catch (err) {
    console.error('[Startup Seed Error]', err.message);
  }
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/scholarships', require('./routes/scholarshipRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ScholarNest API', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[ScholarNest Server] Running on http://localhost:${PORT}`);
});
