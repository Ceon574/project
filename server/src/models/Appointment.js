const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialization',
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    slotTime: {
      type: String,
      required: true,
    },
    symptomsDescription: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    consultationFee: {
      type: Number,
      default: 500,
    },
    consultationNotes: {
      type: String,
      default: '',
    },
    prescription: {
      type: String,
      default: '',
    },
    patientAge: {
      type: Number,
      default: null,
    },
    patientPhone: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
