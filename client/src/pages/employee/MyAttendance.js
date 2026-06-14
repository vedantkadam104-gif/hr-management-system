import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function MyAttendance() {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 });

    useEffect(() => { fetchAttendance(); }, []);

    const fetchAttendance = async () => {
        try {
            const res = await API.get(`/attendance/${user.id}`);
            setAttendance(res.data);
            const present = res.data.filter(a => a.status === 'present').length;
            const absent = res.data.filter(a => a.status === 'absent').length;
            const late = res.data.filter(a => a.status === 'late').length;
            setStats({ present, absent, late });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'present') return 'bg-green-100 text-green-600';
        if (status === 'absent') return 'bg-red-100 text-red-600';
        return 'bg-yellow-100 text-yellow-600';
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Attendance</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-green-500 text-white p-6 rounded-xl shadow">
                        <div className="text-3xl font-bold">{stats.present}</div>
                        <div className="text-sm opacity-80 mt-1">Present Days</div>
                    </div>
                    <div className="bg-red-500 text-white p-6 rounded-xl shadow">
                        <div className="text-3xl font-bold">{stats.absent}</div>
                        <div className="text-sm opacity-80 mt-1">Absent Days</div>
                    </div>
                    <div className="bg-yellow-500 text-white p-6 rounded-xl shadow">
                        <div className="text-3xl font-bold">{stats.late}</div>
                        <div className="text-sm opacity-80 mt-1">Late Days</div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-xl shadow p-6">
                    {loading ? <p>Loading...</p> : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map(record => (
                                    <tr key={record.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3">{record.date?.split('T')[0]}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
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

export default MyAttendance;