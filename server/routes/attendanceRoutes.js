const express = require('express');
const router = express.Router();
const { getAllAttendance, getAttendanceByEmployee, markAttendance, updateAttendance } = require('../controllers/attendanceController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyAdmin, getAllAttendance);
router.get('/:id', verifyToken, getAttendanceByEmployee);
router.post('/', verifyAdmin, markAttendance);
router.put('/:id', verifyAdmin, updateAttendance);

module.exports = router;