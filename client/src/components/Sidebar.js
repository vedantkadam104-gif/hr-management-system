import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/employees', label: 'Employees', icon: '👥' },
        { path: '/admin/attendance', label: 'Attendance', icon: '📅' },
        { path: '/admin/leaves', label: 'Leave Requests', icon: '🏖️' },
        { path: '/admin/payroll', label: 'Payroll', icon: '💰' },
    ];

    const employeeLinks = [
        { path: '/employee/profile', label: 'My Profile', icon: '👤' },
        { path: '/employee/attendance', label: 'My Attendance', icon: '📅' },
        { path: '/employee/leaves', label: 'My Leaves', icon: '🏖️' },
        { path: '/employee/payroll', label: 'My Payroll', icon: '💰' },
    ];

    const links = user?.role === 'admin' ? adminLinks : employeeLinks;

    return (
        <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Logo */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-main rounded-xl flex items-center justify-center text-xl">
                        👥
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">HR System</h2>
                        <p className="text-gray-400 text-xs">Management Portal</p>
                    </div>
                </div>

                {/* User Card */}
                <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-main rounded-lg flex items-center justify-center text-lg font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <span className="text-xs bg-purple-500 bg-opacity-30 text-purple-300 px-2 py-0.5 rounded-full">
                            {user?.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3 px-2">
                    Main Menu
                </p>
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 py-3 px-4 rounded-xl mb-1 transition duration-200 ${
                                isActive
                                    ? 'bg-gradient-main text-white shadow-lg'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <span className="text-lg">{link.icon}</span>
                            <span className="text-sm font-medium">{link.label}</span>
                            {isActive && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-red-400 hover:bg-red-500 hover:bg-opacity-10 transition duration-200"
                >
                    <span className="text-lg">🚪</span>
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;