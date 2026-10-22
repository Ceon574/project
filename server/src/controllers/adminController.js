const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Specialization = require('../models/Specialization');
const Symptom = require('../models/Symptom');

// @desc    Get system overview statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const totalSpecializations = await Specialization.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    // Calculate revenue from completed & confirmed appointments
    const revenueData = await Appointment.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$consultationFee' } } },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Recent 5 appointments
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email phone')
      .populate({
        path: 'doctor',
        populate: [
          { path: 'user', select: 'name' },
          { path: 'specialization', select: 'name' },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalSpecializations,
        totalAppointments,
        statusBreakdown: {
          confirmed: confirmedAppointments,
          pending: pendingAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
        },
        totalRevenue,
        recentAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments with filtering for Admin
// @route   GET /api/admin/appointments
// @access  Private (Admin)
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    let query = {};
    if (status) query.status = status;
    if (date) query.date = date;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone age gender address')
      .populate({
        path: 'doctor',
        populate: [
          { path: 'user', select: 'name email phone' },
          { path: 'specialization', select: 'name icon' },
        ],
      })
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin creates a new Doctor account & Doctor Profile
// @route   POST /api/admin/doctors
// @access  Private (Admin)
exports.createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      specializationId,
      experienceYears,
      consultationFee,
      qualifications,
      about,
      phone,
    } = req.body;

    if (!name || !email || !password || !specializationId) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and specialization are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // 1. Create User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'doctor',
      phone: phone || '',
    });

    // 2. Create Doctor Profile
    const doctor = await Doctor.create({
      user: user._id,
      specialization: specializationId,
      experienceYears: Number(experienceYears) || 3,
      consultationFee: Number(consultationFee) || 500,
      qualifications: qualifications || 'MBBS, MD',
      about: about || 'Experienced healthcare specialist.',
      hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    });

    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('user', 'name email phone')
      .populate('specialization', 'name icon');

    res.status(201).json({
      success: true,
      message: 'Doctor account and profile created successfully',
      data: populatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Private (Admin)
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await User.findByIdAndDelete(doctor.user);
    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Doctor and associated user account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Specialization
// @route   POST /api/admin/specializations
// @access  Private (Admin)
exports.createSpecialization = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Specialization name is required' });
    }

    const spec = await Specialization.create({ name, description, icon });
    res.status(201).json({ success: true, data: spec });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Symptom rule
// @route   POST /api/admin/symptoms
// @access  Private (Admin)
exports.createSymptom = async (req, res, next) => {
  try {
    const { name, specializationId, guidanceText, urgencyLevel, warningSigns } = req.body;
    if (!name || !specializationId || !guidanceText) {
      return res.status(400).json({
        success: false,
        message: 'Name, specializationId, and guidanceText are required',
      });
    }

    const symptom = await Symptom.create({
      name,
      specialization: specializationId,
      guidanceText,
      urgencyLevel: urgencyLevel || 'MEDIUM',
      warningSigns: warningSigns || [],
    });

    res.status(201).json({ success: true, data: symptom });
  } catch (error) {
    next(error);
  }
};
