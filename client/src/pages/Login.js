import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/auth/login', { email, password });
            login(res.data.user, res.data.token);
            if (res.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/employee/profile');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side */}
            <div className="hidden lg:flex w-1/2 bg-gradient-main flex-col justify-center items-center text-white p-12">
                <div className="text-6xl mb-6">👥</div>
                <h1 className="text-4xl font-bold mb-4">HR System</h1>
                <p className="text-purple-200 text-center text-lg max-w-md">
                    Manage your workforce efficiently with our modern HR platform
                </p>
                <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
                    {[
                        { icon: '📊', label: 'Analytics' },
                        { icon: '👤', label: 'Employee Management' },
                        { icon: '📅', label: 'Attendance' },
                        { icon: '💰', label: 'Payroll' },
                    ].map(item => (
                        <div key={item.label} className="bg-white bg-opacity-20 rounded-xl p-4 text-center backdrop-blur">
                            <div className="text-2xl mb-1">{item.icon}</div>
                            <div className="text-sm font-medium">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-main rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                                👥
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
                            <p className="text-gray-500 mt-1">Sign in to your account</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                                ❌ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                                    placeholder="admin@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-main text-white py-3 rounded-xl font-semibold hover:opacity-90 transition duration-200 mt-2"
                            >
                                {loading ? '⏳ Signing in...' : '🚀 Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                            <p className="text-xs text-purple-600 font-medium mb-2">Demo Credentials:</p>
                            <p className="text-xs text-gray-600">👨‍💼 Admin: admin@company.com / admin123</p>
                            <p className="text-xs text-gray-600">👤 Employee: john@company.com / emp123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;