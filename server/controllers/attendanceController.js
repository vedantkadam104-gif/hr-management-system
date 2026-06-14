const db = require('../config/db');

// Get all attendance records
const getAllAttendance = (req, res) => {
    const query = `
        SELECT a.id, a.date, a.status, 
               u.name as employee_name, u.email
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        ORDER BY a.date DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json(results);
    });
};

// Get attendance by employee
const getAttendanceByEmployee = (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT * FROM attendance 
        WHERE user_id = ? 
        ORDER BY date DESC
    `;
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json(results);
    });
};

// Mark attendance
const markAttendance = (req, res) => {
    const { user_id, date, status } = req.body;
    if (!user_id || !date || !status) {
        return res.status(400).json({ message: 'user_id, date and status are required.' });
    }
    const query = 'INSERT INTO attendance (user_id, date, status) VALUES (?, ?, ?)';
    db.query(query, [user_id, date, status], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.status(201).json({ message: 'Attendance marked successfully!', id: results.insertId });
    });
};

// Update attendance
const updateAttendance = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query('UPDATE attendance SET status = ? WHERE id = ?', [status, id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json({ message: 'Attendance updated successfully!' });
    });
};

module.exports = { getAllAttendance, getAttendanceByEmployee, markAttendance, updateAttendance };