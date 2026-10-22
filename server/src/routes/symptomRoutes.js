const express = require('express');
const router = express.Router();
const {
  getSymptoms,
  getSpecializations,
  checkSymptoms,
} = require('../controllers/symptomController');

router.get('/', getSymptoms);
router.get('/specializations', getSpecializations);
router.post('/check', checkSymptoms);

module.exports = router;
