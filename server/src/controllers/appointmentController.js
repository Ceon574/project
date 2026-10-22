const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Book a new doctor appointment
// @route   POST /api/appointments
// @access  Private (Patient or Admin)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, slotTime, symptomsDescription, patientAge, patientPhone } = req.body;

    if (!doctorId || !date || !slotTime) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID, appointment date, and slot time are required',
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Check availability document
    let availability = await Availability.findOne({ doctor: doctorId, date });

    if (!availability) {
      // Create availability on-the-fly if not strictly pre-seeded
      availability = await Availability.create({
        doctor: doctorId,
        date,
        slots: [{ slotTime, isBooked: true, bookedBy: req.user._id }],
      });
    } else {
      // Check if slot exists and is available
      const slotIndex = availability.slots.findIndex((s) => s.slotTime === slotTime);

      if (slotIndex !== -1) {
        if (availability.slots[slotIndex].isBooked) {
          return res.status(400).json({
            success: false,
            message: 'This time slot is already booked. Please choose another slot.',
          });
        }
        availability.slots[slotIndex].isBooked = true;
        availability.slots[slotIndex].bookedBy = req.user._id;
      } else {
        availability.slots.push({
          slotTime,
          isBooked: true,
          bookedBy: req.user._id,
        });
      }
      await availability.save();
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctor._id,
      specialization: doctor.specialization,
      date,
      slotTime,
      symptomsDescription: symptomsDescription || '',
      status: 'confirmed', // Auto-confirmed on direct slot reservation
      consultationFee: doctor.consultationFee,
      patientAge: patientAge || req.user.age,
      patientPhone: patientPhone || req.user.phone,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: 'doctor',
        populate: [
          { path: 'user', select: 'name email phone' },
          { path: 'specialization', select: 'name icon' },
        ],
      })
      .populate('patient', 'name email phone age gender');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in patient's appointments
// @route   GET /api/appointments/my
// @access  Private (Patient)
exports.getMyPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({
        path: 'doctor',
        populate: [
          { path: 'user', select: 'name email phone' },
          { path: 'specialization', select: 'name icon' },
        ],
      })
      .populate('patient', 'name email phone age gender')
      .sort({ date: -1, slotTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in doctor's appointments
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'No doctor profile found for this user',
      });
    }

    const { status, date } = req.query;
    let filter = { doctor: doctor._id };
    if (status) filter.status = status;
    if (date) filter.date = date;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone age gender address')
      .populate('specialization', 'name icon')
      .sort({ date: 1, slotTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (confirm, complete, reject)
// @route   PATCH /api/appointments/:id/status
// @access  Private (Doctor or Admin)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, consultationNotes, prescription } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (status) appointment.status = status;
    if (consultationNotes !== undefined) appointment.consultationNotes = consultationNotes;
    if (prescription !== undefined) appointment.prescription = prescription;

    await appointment.save();

    const updated = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctor',
        populate: [
          { path: 'user', select: 'name email phone' },
          { path: 'specialization', select: 'name icon' },
        ],
      })
      .populate('patient', 'name email phone age gender');

    res.status(200).json({
      success: true,
      message: `Appointment updated to ${appointment.status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Patient, Doctor, or Admin)
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Authorization check
    if (
      req.user.role === 'patient' &&
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this appointment',
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Release the slot in availability
    await Availability.updateOne(
      { doctor: appointment.doctor, date: appointment.date, 'slots.slotTime': appointment.slotTime },
      { $set: { 'slots.$.isBooked': false, 'slots.$.bookedBy': null } }
    );

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully and slot released',
    });
  } catch (error) {
    next(error);
  }
};
