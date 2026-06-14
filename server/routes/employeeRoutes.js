const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllEmployees);
router.get('/:id', verifyToken, getEmployeeById);
router.post('/', verifyAdmin, addEmployee);
router.put('/:id', verifyAdmin, updateEmployee);
router.delete('/:id', verifyAdmin, deleteEmployee);

module.exports = router;