const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllAppointments,
  createDoctor,
  deleteDoctor,
  createSpecialization,
  createSymptom,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/appointments', getAllAppointments);
router.post('/doctors', createDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.post('/specializations', createSpecialization);
router.post('/symptoms', createSymptom);

module.exports = router;
