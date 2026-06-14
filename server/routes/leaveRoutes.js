const express = require('express');
const router = express.Router();
const { getAllLeaves, getLeavesByEmployee, applyLeave, updateLeaveStatus } = require('../controllers/leaveController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyAdmin, getAllLeaves);
router.get('/:id', verifyToken, getLeavesByEmployee);
router.post('/', verifyToken, applyLeave);
router.patch('/:id', verifyAdmin, updateLeaveStatus);

module.exports = router;