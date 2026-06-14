const express = require('express');
const router = express.Router();
const { getAllPayroll, getPayrollByEmployee, addPayroll, updatePayroll } = require('../controllers/payrollController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyAdmin, getAllPayroll);
router.get('/:id', verifyToken, getPayrollByEmployee);
router.post('/', verifyAdmin, addPayroll);
router.put('/:id', verifyAdmin, updatePayroll);

module.exports = router;