const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Specialization = require('../models/Specialization');
const Doctor = require('../models/Doctor');
const Symptom = require('../models/Symptom');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

const { specializationsData, symptomsData, doctorsData } = require('./seedData');

const defaultSlotTimes = [
  '09:00 AM - 09:30 AM',
  '10:00 AM - 10:30 AM',
  '11:30 AM - 12:00 PM',
  '02:00 PM - 02:30 PM',
  '03:30 PM - 04:00 PM',
  '04:30 PM - 05:00 PM',
];

const seedDatabase = async () => {
  try {
    console.log('🔄 Initiating Database Seeding...');

    // Clear existing data cleanly
    await Appointment.deleteMany();
    await Availability.deleteMany();
    await Symptom.deleteMany();
    await Doctor.deleteMany();
    await Specialization.deleteMany();
    await User.deleteMany();

    console.log('🧹 Purged existing collections.');

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'System Hospital Administrator',
      email: 'admin',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9447000000',
    });

    // Also support admin with email admin@hospital.com
    await User.create({
      name: 'System Hospital Administrator (Email)',
      email: 'admin@hospital.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9447000000',
    });

    // 2. Create Patients
    const patient1 = await User.create({
      name: 'Ananya Menon',
      email: 'patient1',
      password: 'pat123',
      role: 'patient',
      phone: '+91 9876543210',
      age: 28,
      gender: 'Female',
      address: 'Skyline Haven, Kakkanad, Kochi, Kerala',
    });

    await User.create({
      name: 'Ananya Menon',
      email: 'patient1@hospital.com',
      password: 'pat123',
      role: 'patient',
      phone: '+91 9876543210',
      age: 28,
      gender: 'Female',
      address: 'Skyline Haven, Kakkanad, Kochi, Kerala',
    });

    const patient2 = await User.create({
      name: 'Arjun Krishnan',
      email: 'patient2',
      password: 'pat123',
      role: 'patient',
      phone: '+91 9876543211',
      age: 34,
      gender: 'Male',
      address: 'Palm Meadows, Thrissur, Kerala',
    });

    console.log('👤 Created Admin & Patient accounts.');

    // 3. Create Specializations
    const createdSpecializations = await Specialization.insertMany(specializationsData);
    const specMap = {};
    createdSpecializations.forEach((s) => {
      specMap[s.name] = s._id;
    });

    console.log(`🩺 Created ${createdSpecializations.length} Medical Specializations.`);

    // 4. Create Symptoms mapped to Specializations
    const mappedSymptoms = symptomsData.map((sym) => ({
      name: sym.name,
      specialization: specMap[sym.specializationName],
      guidanceText: sym.guidanceText,
      urgencyLevel: sym.urgencyLevel,
      warningSigns: sym.warningSigns,
    }));
    await Symptom.insertMany(mappedSymptoms);
    console.log(`📋 Created ${mappedSymptoms.length} Clinical Symptom Rules.`);

    // 5. Create Doctors with Availability & Accounts
    const createdDoctorDocs = [];
    const today = new Date();

    for (let i = 0; i < doctorsData.length; i++) {
      const doc = doctorsData[i];

      // Login id variant 1 (e.g., dr.rajesh)
      const username = doc.email.split('@')[0];
      const docUser = await User.create({
        name: doc.name,
        email: username,
        password: 'doc123',
        role: 'doctor',
        phone: doc.phone,
      });

      // Login id variant 2 (e.g., dr.rajesh@hospital.com)
      await User.create({
        name: doc.name,
        email: doc.email,
        password: 'doc123',
        role: 'doctor',
        phone: doc.phone,
      });

      const doctorDoc = await Doctor.create({
        user: docUser._id,
        specialization: specMap[doc.specializationName],
        experienceYears: doc.experienceYears,
        consultationFee: doc.consultationFee,
        qualifications: doc.qualifications,
        about: doc.about,
        rating: doc.rating,
        reviewsCount: doc.reviewsCount,
        hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
      });

      createdDoctorDocs.push(doctorDoc);

      // Create Availability slots for today and next 5 days
      for (let dayOffset = 0; dayOffset <= 5; dayOffset++) {
        const slotDate = new Date(today);
        slotDate.setDate(today.getDate() + dayOffset);
        const dateStr = slotDate.toISOString().split('T')[0];

        const slots = defaultSlotTimes.map((time, idx) => ({
          slotTime: time,
          isBooked: false,
        }));

        await Availability.create({
          doctor: doctorDoc._id,
          date: dateStr,
          slots,
        });
      }
    }

    console.log(`👨‍⚕️ Created ${createdDoctorDocs.length} Doctor profiles with upcoming schedules.`);

    // 6. Seed Sample Appointments
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Appointment 1: Confirmed
    await Appointment.create({
      patient: patient1._id,
      doctor: createdDoctorDocs[0]._id, // Cardiology Dr. Rajesh
      specialization: specMap['Cardiology'],
      date: tomorrowStr,
      slotTime: '10:00 AM - 10:30 AM',
      symptomsDescription: 'Occasional mild palpitations after morning jogging.',
      status: 'confirmed',
      consultationFee: 750,
      patientAge: 28,
      patientPhone: '+91 9876543210',
    });

    // Mark slot booked
    await Availability.updateOne(
      { doctor: createdDoctorDocs[0]._id, date: tomorrowStr, 'slots.slotTime': '10:00 AM - 10:30 AM' },
      { $set: { 'slots.$.isBooked': true, 'slots.$.bookedBy': patient1._id } }
    );

    // Appointment 2: Completed with Notes & Prescription
    await Appointment.create({
      patient: patient2._id,
      doctor: createdDoctorDocs[2]._id, // Dermatology Dr. Priya
      specialization: specMap['Dermatology'],
      date: todayStr,
      slotTime: '09:00 AM - 09:30 AM',
      symptomsDescription: 'Contact dermatitis on right forearm after gardening.',
      status: 'completed',
      consultationFee: 600,
      patientAge: 34,
      patientPhone: '+91 9876543211',
      consultationNotes: 'Erythematous macular lesions observed. No systemic reaction or infection signs.',
      prescription: 'Rx: Hydrocortisone 1% topical cream twice daily for 7 days. Cetirizine 10mg once daily at bedtime for itching.',
    });

    console.log('📅 Seeded realistic initial appointment records.');
    console.log('✅ Database Seeding Completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    throw error;
  }
};

// Execute if run directly
if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async (connected) => {
    if (connected) {
      await seedDatabase();
      process.exit(0);
    } else {
      console.error('Database connection failed. Exiting.');
      process.exit(1);
    }
  });
}

module.exports = seedDatabase;
