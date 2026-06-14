const db = require('../config/db');

// Get all leave requests (Admin)
const getAllLeaves = (req, res) => {
    const query = `
        SELECT l.id, l.leave_type, l.from_date, l.to_date, 
               l.reason, l.status, l.created_at,
               u.name as employee_name, u.email
        FROM leave_requests l
        JOIN users u ON l.user_id = u.id
        ORDER BY l.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json(results);
    });
};

// Get leaves by employee
const getLeavesByEmployee = (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT * FROM leave_requests 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    `;
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json(results);
    });
};

// Apply for leave
const applyLeave = (req, res) => {
    const { user_id, leave_type, from_date, to_date, reason } = req.body;
    if (!user_id || !leave_type || !from_date || !to_date) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const query = 'INSERT INTO leave_requests (user_id, leave_type, from_date, to_date, reason) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [user_id, leave_type, from_date, to_date, reason], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.status(201).json({ message: 'Leave applied successfully!', id: results.insertId });
    });
};

// Approve or Reject leave (Admin)
const updateLeaveStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Status must be approved or rejected.' });
    }
    db.query('UPDATE leave_requests SET status = ? WHERE id = ?', [status, id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json({ message: `Leave ${status} successfully!` });
    });
};

module.exports = { getAllLeaves, getLeavesByEmployee, applyLeave, updateLeaveStatus };