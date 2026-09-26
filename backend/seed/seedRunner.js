const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');
const sampleScholarships = require('./scholarshipData');

const seedDB = async () => {
  try {
    // Clear existing sample scholarships
    await Scholarship.deleteMany({ isSampleData: true });

    // Insert sample scholarships
    const insertedScholarships = await Scholarship.insertMany(sampleScholarships);
    console.log(`[Seed] Successfully inserted ${insertedScholarships.length} sample scholarships.`);

    // Check if demo student exists
    let demoStudent = await User.findOne({ email: 'student@scholarnest.edu' });
    if (!demoStudent) {
      const hashedPassword = await bcrypt.hash('student123', 10);
      demoStudent = await User.create({
        name: 'Aarav Sharma',
        email: 'student@scholarnest.edu',
        password: hashedPassword,
        role: 'student'
      });

      // Create initial profile for demo student
      await StudentProfile.create({
        user: demoStudent._id,
        educationLevel: 'Undergraduate',
        degreeCourse: 'B.Tech',
        specialization: 'Computer Science',
        institutionType: 'Government College / University',
        yearOfStudy: '2nd Year',
        gpaPercentage: 82,
        familyIncomeRange: '₹2,50,000 - ₹5,00,000',
        annualIncomeAmount: 350000,
        needsAssistance: true,
        isFirstGeneration: true,
        stateCountry: 'Maharashtra',
        gender: 'Male',
        categoryCommunity: 'OBC',
        disabilityStatus: false,
        skills: ['JavaScript', 'Python', 'Web Development', 'Data Structures'],
        certifications: ['Fullstack Web Dev Cert', 'NPTEL Python'],
        extracurriculars: ['Code Club Lead', 'Volunteered for NGO Literacy'],
        isProfileCompleted: true,
        completionPercentage: 90
      });
      console.log('[Seed] Created default student account: student@scholarnest.edu / student123');
    }

    // Check if admin user exists
    let adminUser = await User.findOne({ email: 'admin@scholarnest.edu' });
    if (!adminUser) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'ScholarNest Admin',
        email: 'admin@scholarnest.edu',
        password: hashedAdminPassword,
        role: 'admin'
      });
      console.log('[Seed] Created default admin account: admin@scholarnest.edu / admin123');
    }

    // Create 2 sample saved applications for demo student
    if (demoStudent && insertedScholarships.length >= 3) {
      const existingApps = await Application.countDocuments({ user: demoStudent._id });
      if (existingApps === 0) {
        await Application.create([
          {
            user: demoStudent._id,
            scholarship: insertedScholarships[0]._id,
            status: 'Applied',
            completedDocuments: ['Academic transcript', 'Income certificate', 'ID proof (Aadhaar/Passport)'],
            notes: 'Applied via online portal on 24 Sep 2026'
          },
          {
            user: demoStudent._id,
            scholarship: insertedScholarships[1]._id,
            status: 'Saved',
            completedDocuments: ['Academic transcript'],
            notes: 'Need to prepare recommendation letter'
          }
        ]);
        console.log('[Seed] Created initial application records for demo student');
      }
    }

    return { success: true, count: insertedScholarships.length };
  } catch (error) {
    console.error('[Seed Error]', error);
    return { success: false, error: error.message };
  }
};

module.exports = seedDB;
