const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyPatientAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.patch('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;
