import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';

function Leaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchLeaves(); }, []);

    const fetchLeaves = async () => {
        try {
            const res = await API.get('/leaves');
            setLeaves(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, status) => {
        try {
            await API.patch(`/leaves/${id}`, { status });
            fetchLeaves();
        } catch (err) {
            alert('Error updating leave status!');
        }
    };

    const filteredLeaves = filter === 'all' 
        ? leaves 
        : leaves.filter(l => l.status === filter);

    const getStatusColor = (status) => {
        if (status === 'approved') return 'bg-green-100 text-green-600';
        if (status === 'rejected') return 'bg-red-100 text-red-600';
        return 'bg-yellow-100 text-yellow-600';
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave Requests</h1>

                {/* Filter Buttons */}
                <div className="flex gap-3 mb-6">
                    {['all', 'pending', 'approved', 'rejected'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize font-medium ${
                                filter === f 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Leaves Table */}
                <div className="bg-white rounded-xl shadow p-6">
                    {loading ? <p>Loading...</p> : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-3">Employee</th>
                                    <th className="pb-3">Type</th>
                                    <th className="pb-3">From</th>
                                    <th className="pb-3">To</th>
                                    <th className="pb-3">Reason</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map(leave => (
                                    <tr key={leave.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3">{leave.employee_name}</td>
                                        <td className="py-3 capitalize">{leave.leave_type}</td>
                                        <td className="py-3">{leave.from_date?.split('T')[0]}</td>
                                        <td className="py-3">{leave.to_date?.split('T')[0]}</td>
                                        <td className="py-3">{leave.reason || 'N/A'}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            {leave.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatus(leave.id, 'approved')}
                                                        className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatus(leave.id, 'rejected')}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
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

export default Leaves;