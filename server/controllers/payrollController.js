const db = require('../config/db');

// Get all payroll records (Admin)
const getAllPayroll = (req, res) => {
    const query = `
        SELECT p.id, p.month, p.basic_salary, 
               p.allowances, p.deductions, p.net_pay,
               u.name as employee_name, u.email
        FROM payroll p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json(results);
    });
};

// Get payroll by employee
const getPayrollByEmployee = (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT * FROM payroll 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    `;
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json(results);
    });
};

// Add payroll record (Admin)
const addPayroll = (req, res) => {
    const { user_id, month, basic_salary, allowances, deductions } = req.body;
    if (!user_id || !month || !basic_salary) {
        return res.status(400).json({ message: 'user_id, month and basic_salary are required.' });
    }
    const net_pay = parseFloat(basic_salary) + parseFloat(allowances || 0) - parseFloat(deductions || 0);
    const query = 'INSERT INTO payroll (user_id, month, basic_salary, allowances, deductions, net_pay) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [user_id, month, basic_salary, allowances || 0, deductions || 0, net_pay], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.status(201).json({ message: 'Payroll added successfully!', id: results.insertId });
    });
};

// Update payroll record (Admin)
const updatePayroll = (req, res) => {
    const { id } = req.params;
    const { basic_salary, allowances, deductions } = req.body;
    const net_pay = parseFloat(basic_salary) + parseFloat(allowances || 0) - parseFloat(deductions || 0);
    const query = 'UPDATE payroll SET basic_salary=?, allowances=?, deductions=?, net_pay=? WHERE id=?';
    db.query(query, [basic_salary, allowances || 0, deductions || 0, net_pay, id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });
        res.json({ message: 'Payroll updated successfully!' });
    });
};

module.exports = { getAllPayroll, getPayrollByEmployee, addPayroll, updatePayroll };