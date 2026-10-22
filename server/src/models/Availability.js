const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotTime: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null,
  },
});

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: String, // Format YYYY-MM-DD
      required: true,
    },
    slots: [slotSchema],
  },
  { timestamps: true }
);

availabilitySchema.index({ doctor: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
