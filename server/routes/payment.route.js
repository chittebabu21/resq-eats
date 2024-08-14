const { payment } = require('../controllers/payment.controller');
const router = require('express').Router();

// routes 
router.post('/', payment);

module.exports = router;