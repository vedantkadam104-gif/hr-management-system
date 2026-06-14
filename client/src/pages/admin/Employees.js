import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: '', department_id: '', joining_date: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchEmployees(); }, []);

    const fetchEmployees = async () => {
        try {
            const res = await API.get('/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editEmployee) {
                await API.put(`/employees/${editEmployee.id}`, form);
            } else {
                await API.post('/employees', { ...form, role: 'employee' });
            }
            fetchEmployees();
            setShowForm(false);
            setEditEmployee(null);
            setForm({ name: '', email: '', password: '', phone: '', department_id: '', joining_date: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error!');
        }
    };

    const handleEdit = (emp) => {
        setEditEmployee(emp);
        setForm({ name: emp.name, email: emp.email, password: '', phone: emp.phone || '', department_id: emp.department_id || '', joining_date: emp.joining_date?.split('T')[0] || '' });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await API.delete(`/employees/${id}`);
                fetchEmployees();
            } catch (err) {
                alert('Error deleting employee!');
            }
        }
    };

    const filtered = employees.filter(emp =>
        emp.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase())
    );

    const departments = ['Engineering', 'HR', 'Finance'];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
                        <p className="text-gray-500 mt-1">{employees.length} total employees</p>
                    </div>
                    <button
                        onClick={() => { setShowForm(true); setEditEmployee(null); setForm({ name: '', email: '', password: '', phone: '', department_id: '', joining_date: '' }); }}
                        className="bg-gradient-main text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2"
                    >
                        ➕ Add Employee
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                    <input
                        className="w-full outline-none text-gray-700 placeholder-gray-400"
                        placeholder="🔍 Search employees by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-l-4 border-purple-500">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {editEmployee ? '✏️ Edit Employee' : '➕ Add New Employee'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Full Name</label>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="john@company.com" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="••••••••" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Phone</label>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="+91 9999999999" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Department</label>
                                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400" value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})}>
                                    <option value="">Select Department</option>
                                    <option value="1">Engineering</option>
                                    <option value="2">HR</option>
                                    <option value="3">Finance</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Joining Date</label>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400" type="date" value={form.joining_date} onChange={e => setForm({...form, joining_date: e.target.value})} />
                            </div>
                            <div className="col-span-2 flex gap-3 mt-2">
                                <button type="submit" className="bg-gradient-main text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition">
                                    {editEmployee ? '✅ Update Employee' : '➕ Add Employee'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Employees Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-4xl animate-spin">⚙️</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(emp => (
                            <div key={emp.id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                            {emp.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{emp.name}</p>
                                            <p className="text-xs text-gray-500">{emp.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>🏢</span>
                                        <span>{emp.department || 'No Department'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>📱</span>
                                        <span>{emp.phone || 'No Phone'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>📅</span>
                                        <span>{emp.joining_date?.split('T')[0] || 'Not set'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                    <button onClick={() => handleEdit(emp)} className="flex-1 bg-purple-50 text-purple-600 py-2 rounded-xl text-sm font-medium hover:bg-purple-100 transition">
                                        ✏️ Edit
                                    </button>
                                    <button onClick={() => handleDelete(emp.id)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition">
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Employees;