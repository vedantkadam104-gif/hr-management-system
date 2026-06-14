const db = require('../config/db');

// Get all employees
const getAllEmployees = (req, res) => {
    const query = `
        SELECT u.id, u.name, u.email, u.role, u.phone, 
               u.joining_date, d.name as department 
        FROM users u 
        LEFT JOIN departments d ON u.department_id = d.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json(results);
    });
};

// Get single employee
const getEmployeeById = (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT u.id, u.name, u.email, u.role, u.phone, 
               u.joining_date, u.emergency_contact, d.name as department 
        FROM users u 
        LEFT JOIN departments d ON u.department_id = d.id 
        WHERE u.id = ?
    `;
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Employee not found.' });
        res.json(results[0]);
    });
};

// Add new employee
const addEmployee = (req, res) => {
    const { name, email, password, role, department_id, phone, joining_date } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    const query = 'INSERT INTO users (name, email, password, role, department_id, phone, joining_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, password, role || 'employee', department_id, phone, joining_date], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.status(201).json({ message: 'Employee added successfully!', id: results.insertId });
    });
};

// Update employee
const updateEmployee = (req, res) => {
    const { id } = req.params;
    const { name, email, phone, department_id, joining_date, emergency_contact } = req.body;
    const query = 'UPDATE users SET name=?, email=?, phone=?, department_id=?, joining_date=?, emergency_contact=? WHERE id=?';
    db.query(query, [name, email, phone, department_id, joining_date, emergency_contact, id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json({ message: 'Employee updated successfully!' });
    });
};

// Delete employee
const deleteEmployee = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json({ message: 'Employee deleted successfully!' });
    });
};

module.exports = { getAllEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee };