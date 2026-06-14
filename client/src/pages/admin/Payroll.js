import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';

function Payroll() {
    const [payroll, setPayroll] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        user_id: '', month: '', basic_salary: '', allowances: '', deductions: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        fetchPayroll(); 
        fetchEmployees();
    }, []);

    const fetchPayroll = async () => {
        try {
            const res = await API.get('/payroll');
            setPayroll(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await API.get('/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/payroll', form);
            fetchPayroll();
            setShowForm(false);
            setForm({ user_id: '', month: '', basic_salary: '', allowances: '', deductions: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error!');
        }
    };

    const netPay = (basic, allowances, deductions) => {
        return parseFloat(basic || 0) + parseFloat(allowances || 0) - parseFloat(deductions || 0);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Payroll</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Add Payroll
                    </button>
                </div>

                {/* Add Payroll Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Add Payroll Record</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <select
                                className="border rounded-lg px-4 py-2"
                                value={form.user_id}
                                onChange={e => setForm({...form, user_id: e.target.value})}
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                            <input
                                className="border rounded-lg px-4 py-2"
                                placeholder="Month (e.g. June 2026)"
                                value={form.month}
                                onChange={e => setForm({...form, month: e.target.value})}
                                required
                            />
                            <input
                                className="border rounded-lg px-4 py-2"
                                placeholder="Basic Salary"
                                type="number"
                                value={form.basic_salary}
                                onChange={e => setForm({...form, basic_salary: e.target.value})}
                                required
                            />
                            <input
                                className="border rounded-lg px-4 py-2"
                                placeholder="Allowances"
                                type="number"
                                value={form.allowances}
                                onChange={e => setForm({...form, allowances: e.target.value})}
                            />
                            <input
                                className="border rounded-lg px-4 py-2"
                                placeholder="Deductions"
                                type="number"
                                value={form.deductions}
                                onChange={e => setForm({...form, deductions: e.target.value})}
                            />
                            <div className="border rounded-lg px-4 py-2 bg-gray-50 font-semibold text-green-600">
                                Net Pay: ₹{netPay(form.basic_salary, form.allowances, form.deductions)}
                            </div>
                            <div className="col-span-2 flex gap-3">
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                    Add Payroll
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Payroll Table */}
                <div className="bg-white rounded-xl shadow p-6">
                    {loading ? <p>Loading...</p> : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-3">Employee</th>
                                    <th className="pb-3">Month</th>
                                    <th className="pb-3">Basic</th>
                                    <th className="pb-3">Allowances</th>
                                    <th className="pb-3">Deductions</th>
                                    <th className="pb-3">Net Pay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payroll.map(record => (
                                    <tr key={record.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3">{record.employee_name}</td>
                                        <td className="py-3">{record.month}</td>
                                        <td className="py-3">₹{record.basic_salary}</td>
                                        <td className="py-3">₹{record.allowances}</td>
                                        <td className="py-3">₹{record.deductions}</td>
                                        <td className="py-3 font-semibold text-green-600">
                                            ₹{record.net_pay}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Payroll;