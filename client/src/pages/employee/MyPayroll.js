import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function MyPayroll() {
    const { user } = useAuth();
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchPayroll(); }, []);

    const fetchPayroll = async () => {
        try {
            const res = await API.get(`/payroll/${user.id}`);
            setPayroll(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Payroll</h1>

                {loading ? <p>Loading...</p> : (
                    <div className="grid gap-6">
                        {payroll.length === 0 ? (
                            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
                                No payroll records found.
                            </div>
                        ) : (
                            payroll.map(record => (
                                <div key={record.id} className="bg-white rounded-xl shadow p-6">
                                    {/* Payslip Header */}
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b">
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                Salary Slip — {record.month}
                                            </h2>
                                            <p className="text-gray-500 text-sm">HR System</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-green-600">
                                                ₹{record.net_pay}
                                            </p>
                                            <p className="text-gray-500 text-sm">Net Pay</p>
                                        </div>
                                    </div>

                                    {/* Salary Breakdown */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-gray-500 text-sm">Basic Salary</p>
                                            <p className="text-xl font-semibold text-blue-600">
                                                ₹{record.basic_salary}
                                            </p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-gray-500 text-sm">Allowances</p>
                                            <p className="text-xl font-semibold text-green-600">
                                                +₹{record.allowances}
                                            </p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <p className="text-gray-500 text-sm">Deductions</p>
                                            <p className="text-xl font-semibold text-red-600">
                                                -₹{record.deductions}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyPayroll;