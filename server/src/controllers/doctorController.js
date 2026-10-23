const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Availability = require('../models/Availability');
const Specialization = require('../models/Specialization');
const User = require('../models/User');
const mockStore = require('../data/mockStore');

// @desc    Get all doctors with filtering & search
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
  try {
    // If MongoDB is not connected, seamlessly serve from mock store
    if (mongoose.connection.readyState !== 1) {
      const doctors = mockStore.getDoctors(req.query);
      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors,
      });
    }

    const { specialization, search, minExp, maxFee } = req.query;
    let query = { isAvailable: true };

    if (specialization) {
      query.specialization = specialization;
    }

    if (minExp) {
      query.experienceYears = { $gte: Number(minExp) };
    }

    if (maxFee) {
      query.consultationFee = { ...query.consultationFee, $lte: Number(maxFee) };
    }

    let doctors = await Doctor.find(query)
      .populate('user', 'name email phone age gender')
      .populate('specialization', 'name description icon')
      .sort({ rating: -1, experienceYears: -1 });

    if (search) {
      const term = search.toLowerCase();
      doctors = doctors.filter((doc) => {
        const docName = doc.user?.name?.toLowerCase() || '';
        const specName = doc.specialization?.name?.toLowerCase() || '';
        return docName.includes(term) || specName.includes(term);
      });
    }

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    // On buffer timeout or DB failure, fallback gracefully to mockStore
    console.warn('⚠️  Doctor fetch falling back to In-Memory store:', error.message);
    const doctors = mockStore.getDoctors(req.query);
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  }
};

// @desc    Get single doctor by ID with availability
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const doctor = mockStore.getDoctorById(req.params.id);
      if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
      return res.status(200).json({ success: true, data: doctor });
    }

    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('specialization', 'name description icon');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    const availabilities = await Availability.find({
      doctor: doctor._id,
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...doctor.toObject(),
        availabilities,
      },
    });
  } catch (error) {
    const doctor = mockStore.getDoctorById(req.params.id);
    if (doctor) return res.status(200).json({ success: true, data: doctor });
    next(error);
  }
};

// @desc    Get logged in doctor profile
// @route   GET /api/doctors/profile/me
// @access  Private (Doctor)
exports.getMyDoctorProfile = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const doctor = mockStore.doctors.find((d) => d.user._id === req.user._id);
      if (!doctor) return res.status(404).json({ success: false, message: 'No doctor profile found' });
      return res.status(200).json({ success: true, data: doctor });
    }

    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate('user', 'name email phone age gender address')
      .populate('specialization', 'name description icon');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'No doctor profile associated with this account',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor availability for a specific date
// @route   GET /api/doctors/:id/availability
// @access  Public
exports.getDoctorAvailability = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const availability = mockStore.getDoctorAvailability(req.params.id, req.query.date);
      return res.status(200).json({ success: true, data: availability });
    }

    const { date } = req.query;
    const query = { doctor: req.params.id };
    if (date) query.date = date;

    const availability = await Availability.find(query).sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    const availability = mockStore.getDoctorAvailability(req.params.id, req.query?.date);
    res.status(200).json({ success: true, data: availability });
  }
};

// @desc    Set or update doctor availability slots
// @route   POST /api/doctors/availability
// @access  Private (Doctor or Admin)
exports.setDoctorAvailability = async (req, res, next) => {
  try {
    const { date, slots } = req.body;

    let doctorId;
    if (req.user.role === 'doctor') {
      if (mongoose.connection.readyState !== 1) {
        const doc = mockStore.doctors.find((d) => d.user._id === req.user._id);
        doctorId = doc ? doc._id : null;
      } else {
        const doc = await Doctor.findOne({ user: req.user._id });
        if (!doc) return res.status(404).json({ success: false, message: 'Doctor record not found' });
        doctorId = doc._id;
      }
    } else if (req.user.role === 'admin') {
      doctorId = req.body.doctorId;
    }

    if (!date || !slots || !Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid date (YYYY-MM-DD) and an array of slot objects',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const avail = mockStore.setDoctorAvailability(doctorId, date, slots);
      return res.status(200).json({
        success: true,
        message: 'Doctor availability slots updated successfully',
        data: avail,
      });
    }

    const formattedSlots = slots.map((s) => ({
      slotTime: typeof s === 'string' ? s : s.slotTime,
      isBooked: false,
    }));

    const availability = await Availability.findOneAndUpdate(
      { doctor: doctorId, date },
      { doctor: doctorId, date, slots: formattedSlots },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Doctor availability slots updated successfully',
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};
