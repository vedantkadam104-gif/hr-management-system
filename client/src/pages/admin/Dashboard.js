import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ employees: 0, pendingLeaves: 0, attendanceToday: 0, departments: 0 });
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const [empRes, leaveRes, attendRes] = await Promise.all([
                API.get('/employees'),
                API.get('/leaves'),
                API.get('/attendance')
            ]);
            const pendingLeaves = leaveRes.data.filter(l => l.status === 'pending');
            const today = new Date().toISOString().split('T')[0];
            const todayAttendance = attendRes.data.filter(a => a.date?.split('T')[0] === today);
            setStats({
                employees: empRes.data.length,
                pendingLeaves: pendingLeaves.length,
                attendanceToday: todayAttendance.length,
                departments: 3
            });
            setRecentLeaves(leaveRes.data.slice(0, 5));
            setRecentEmployees(empRes.data.slice(0, 5));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const cards = [
        { label: 'Total Employees', value: stats.employees, gradient: 'from-violet-500 to-purple-600', icon: '👥', change: '+2 this month' },
        { label: 'Pending Leaves', value: stats.pendingLeaves, gradient: 'from-amber-400 to-orange-500', icon: '🏖️', change: 'Needs attention' },
        { label: "Today's Attendance", value: stats.attendanceToday, gradient: 'from-emerald-400 to-teal-500', icon: '📅', change: 'Updated today' },
        { label: 'Departments', value: stats.departments, gradient: 'from-pink-500 to-rose-500', icon: '🏢', change: 'Active' },
    ];

    const getStatusStyle = (status) => {
        if (status === 'approved') return 'bg-emerald-100 text-emerald-700';
        if (status === 'rejected') return 'bg-red-100 text-red-700';
        return 'bg-amber-100 text-amber-700';
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Good morning, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Here's what's happening today</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-4xl animate-spin">⚙️</div>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {cards.map((card) => (
                                <div key={card.label} className={`bg-gradient-to-br ${card.gradient} text-white p-6 rounded-2xl shadow-lg`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-3xl">{card.icon}</div>
                                        <div className="bg-white bg-opacity-20 rounded-lg px-2 py-1">
                                            <span className="text-xs font-medium">{card.change}</span>
                                        </div>
                                    </div>
                                    <div className="text-4xl font-bold mb-1">{card.value}</div>
                                    <div className="text-sm opacity-80">{card.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Leave Requests */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Recent Leave Requests</h2>
                                    <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                                        {recentLeaves.length} total
                                    </span>
                                </div>
                                {recentLeaves.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <div className="text-4xl mb-2">🏖️</div>
                                        <p>No leave requests yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {recentLeaves.map((leave) => (
                                            <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-main rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                                        {leave.employee_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{leave.employee_name}</p>
                                                        <p className="text-xs text-gray-500 capitalize">{leave.leave_type} leave</p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(leave.status)}`}>
                                                    {leave.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Recent Employees */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Employees</h2>
                                    <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                                        {recentEmployees.length} members
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {recentEmployees.map((emp) => (
                                        <div key={emp.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                                {emp.name?.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">{emp.name}</p>
                                                <p className="text-xs text-gray-500">{emp.department || 'No Department'}</p>
                                            </div>
                                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                                {emp.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;