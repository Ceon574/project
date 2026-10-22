const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  getMyDoctorProfile,
  getDoctorAvailability,
  setDoctorAvailability,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/profile/me', protect, authorize('doctor'), getMyDoctorProfile);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);
router.post('/availability', protect, authorize('doctor', 'admin'), setDoctorAvailability);

module.exports = router;
