import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function MyLeaves() {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        leave_type: 'sick', from_date: '', to_date: '', reason: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchLeaves(); }, []);

    const fetchLeaves = async () => {
        try {
            const res = await API.get(`/leaves/${user.id}`);
            setLeaves(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/leaves', { ...form, user_id: user.id });
            fetchLeaves();
            setShowForm(false);
            setForm({ leave_type: 'sick', from_date: '', to_date: '', reason: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error!');
        }
    };

    const getStatusColor = (status) => {
        if (status === 'approved') return 'bg-green-100 text-green-600';
        if (status === 'rejected') return 'bg-red-100 text-red-600';
        return 'bg-yellow-100 text-yellow-600';
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Leaves</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Apply Leave
                    </button>
                </div>

                {/* Apply Leave Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Apply for Leave</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <select
                                className="border rounded-lg px-4 py-2"
                                value={form.leave_type}
                                onChange={e => setForm({...form, leave_type: e.target.value})}
                            >
                                <option value="sick">Sick Leave</option>
                                <option value="casual">Casual Leave</option>
                                <option value="annual">Annual Leave</option>
                            </select>
                            <input
                                type="date"
                                className="border rounded-lg px-4 py-2"
                                value={form.from_date}
                                onChange={e => setForm({...form, from_date: e.target.value})}
                                required
                            />
                            <input
                                type="date"
                                className="border rounded-lg px-4 py-2"
                                value={form.to_date}
                                onChange={e => setForm({...form, to_date: e.target.value})}
                                required
                            />
                            <input
                                className="border rounded-lg px-4 py-2"
                                placeholder="Reason"
                                value={form.reason}
                                onChange={e => setForm({...form, reason: e.target.value})}
                            />
                            <div className="col-span-2 flex gap-3">
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                    Submit
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Leaves Table */}
                <div className="bg-white rounded-xl shadow p-6">
                    {loading ? <p>Loading...</p> : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-3">Type</th>
                                    <th className="pb-3">From</th>
                                    <th className="pb-3">To</th>
                                    <th className="pb-3">Reason</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map(leave => (
                                    <tr key={leave.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 capitalize">{leave.leave_type}</td>
                                        <td className="py-3">{leave.from_date?.split('T')[0]}</td>
                                        <td className="py-3">{leave.to_date?.split('T')[0]}</td>
                                        <td className="py-3">{leave.reason || 'N/A'}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                                                {leave.status}
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

export default MyLeaves;