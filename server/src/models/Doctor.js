const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialization',
      required: [true, 'Doctor specialization is required'],
    },
    experienceYears: {
      type: Number,
      required: [true, 'Experience years required'],
      min: 0,
      default: 5,
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee required'],
      min: 0,
      default: 500,
    },
    qualifications: {
      type: String,
      default: 'MBBS, MD',
    },
    about: {
      type: String,
      default: 'Experienced healthcare professional dedicated to patient-centered clinical care.',
    },
    hospitalAffiliation: {
      type: String,
      default: 'ICTAK Apex Multi-Specialty Hospital',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 18,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
