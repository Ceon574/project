const mongoose = require('mongoose');
const Symptom = require('../models/Symptom');
const Specialization = require('../models/Specialization');
const Doctor = require('../models/Doctor');
const mockStore = require('../data/mockStore');

// @desc    Get all symptoms
// @route   GET /api/symptoms
// @access  Public
exports.getSymptoms = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: mockStore.symptoms.length,
        data: mockStore.getSymptoms(),
      });
    }

    const symptoms = await Symptom.find()
      .populate('specialization', 'name description icon')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: symptoms.length,
      data: symptoms,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: mockStore.symptoms.length,
      data: mockStore.getSymptoms(),
    });
  }
};

// @desc    Get all medical specializations
// @route   GET /api/symptoms/specializations
// @access  Public
exports.getSpecializations = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: mockStore.specializations.length,
        data: mockStore.getSpecializations(),
      });
    }

    const specializations = await Specialization.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: specializations.length,
      data: specializations,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: mockStore.specializations.length,
      data: mockStore.getSpecializations(),
    });
  }
};

// @desc    Analyze symptoms and recommend medical specializations & doctors
// @route   POST /api/symptoms/check
// @access  Public
exports.checkSymptoms = async (req, res, next) => {
  try {
    const { symptomIds } = req.body;

    if (!symptomIds || !Array.isArray(symptomIds) || symptomIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of selected symptom IDs',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const result = mockStore.checkSymptoms(symptomIds);
      return res.status(200).json({
        success: true,
        data: result,
      });
    }

    const matchedSymptoms = await Symptom.find({ _id: { $in: symptomIds } })
      .populate('specialization', 'name description icon');

    if (matchedSymptoms.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No matching symptom records found',
      });
    }

    let highestUrgency = 'LOW';
    const urgencyRanks = { LOW: 1, MEDIUM: 2, HIGH: 3 };

    let allWarningSigns = [];
    let specializationIds = new Set();
    let specializations = [];

    matchedSymptoms.forEach((sym) => {
      if (urgencyRanks[sym.urgencyLevel] > urgencyRanks[highestUrgency]) {
        highestUrgency = sym.urgencyLevel;
      }
      if (sym.warningSigns && sym.warningSigns.length > 0) {
        allWarningSigns.push(...sym.warningSigns);
      }
      if (sym.specialization) {
        if (!specializationIds.has(sym.specialization._id.toString())) {
          specializationIds.add(sym.specialization._id.toString());
          specializations.push(sym.specialization);
        }
      }
    });

    allWarningSigns = [...new Set(allWarningSigns)];

    const doctors = await Doctor.find({
      specialization: { $in: Array.from(specializationIds) },
      isAvailable: true,
    })
      .populate('user', 'name email phone')
      .populate('specialization', 'name icon')
      .sort({ rating: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        analyzedSymptomsCount: matchedSymptoms.length,
        urgencyLevel: highestUrgency,
        guidanceSummary:
          highestUrgency === 'HIGH'
            ? 'CRITICAL NOTICE: One or more selected symptoms indicate severe medical risk. Seek immediate emergency medical care or visit the nearest emergency department right away.'
            : highestUrgency === 'MEDIUM'
            ? 'CLINICAL NOTICE: Moderate symptoms detected. Schedule a formal consultation with the recommended medical specialist within 24 to 48 hours.'
            : 'MILD NOTICE: Mild symptoms observed. Monitor closely and consult a primary care physician if symptoms persist or worsen.',
        symptoms: matchedSymptoms,
        warningSigns: allWarningSigns,
        recommendedSpecializations: specializations,
        recommendedDoctors: doctors,
      },
    });
  } catch (error) {
    const result = mockStore.checkSymptoms(req.body.symptomIds);
    res.status(200).json({ success: true, data: result });
  }
};
