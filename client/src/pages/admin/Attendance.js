import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';

function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ user_id: '', date: '', status: 'present' });
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAttendance();
        fetchEmployees();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await API.get('/attendance');
            setAttendance(res.data);
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
            await API.post('/attendance', form);
            fetchAttendance();
            setShowForm(false);
            setForm({ user_id: '', date: '', status: 'present' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error!');
        }
    };

    const filtered = filter === 'all' ? attendance : attendance.filter(a => a.status === filter);

    const stats = {
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        late: attendance.filter(a => a.status === 'late').length,
    };

    const getStatusStyle = (status) => {
        if (status === 'present') return 'bg-emerald-100 text-emerald-700';
        if (status === 'absent') return 'bg-red-100 text-red-700';
        return 'bg-amber-100 text-amber-700';
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
                        <p className="text-gray-500 mt-1">Track employee attendance</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-gradient-main text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2"
                    >
                        ➕ Mark Attendance
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-5 rounded-2xl">
                        <div className="text-3xl font-bold">{stats.present}</div>
                        <div className="text-sm opacity-80 mt-1">✅ Present</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-400 to-rose-500 text-white p-5 rounded-2xl">
                        <div className="text-3xl font-bold">{stats.absent}</div>
                        <div className="text-sm opacity-80 mt-1">❌ Absent</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-5 rounded-2xl">
                        <div className="text-3xl font-bold">{stats.late}</div>
                        <div className="text-sm opacity-80 mt-1">⏰ Late</div>
                    </div>
                </div>

                {/* Mark Attendance Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-l-4 border-purple-500">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 Mark Attendance</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Employee</label>
                                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400" value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})} required>
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Date</label>
                                <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Status</label>
                                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                                    <option value="present">✅ Present</option>
                                    <option value="absent">❌ Absent</option>
                                    <option value="late">⏰ Late</option>
                                </select>
                            </div>
                            <div className="col-span-3 flex gap-3">
                                <button type="submit" className="bg-gradient-main text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition">
                                    ✅ Mark Attendance
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filter */}
                <div className="flex gap-2 mb-4">
                    {['all', 'present', 'absent', 'late'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${filter === f ? 'bg-gradient-main text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-4xl animate-spin">⚙️</div>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Employee</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Date</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(record => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                                    {record.employee_name?.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">{record.employee_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{record.date?.split('T')[0]}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(record.status)}`}>
                                                {record.status}
                                            </span>
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

export default Attendance;