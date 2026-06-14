import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get(`/employees/${user.id}`);
            setProfile(res.data);
            setForm(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/employees/${user.id}`, form);
            fetchProfile();
            setEditing(false);
        } catch (err) {
            alert('Error updating profile!');
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

                {loading ? <p>Loading...</p> : (
                    <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
                        {/* Profile Header */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {profile?.name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{profile?.name}</h2>
                                <p className="text-gray-500">{profile?.email}</p>
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                    {profile?.department || 'No Department'}
                                </span>
                            </div>
                        </div>

                        {!editing ? (
                            <>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-gray-500 text-sm">Phone</p>
                                        <p className="font-medium">{profile?.phone || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Joining Date</p>
                                        <p className="font-medium">{profile?.joining_date?.split('T')[0] || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Emergency Contact</p>
                                        <p className="font-medium">{profile?.emergency_contact || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Department</p>
                                        <p className="font-medium">{profile?.department || 'Not set'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Edit Profile
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                                <input
                                    className="border rounded-lg px-4 py-2"
                                    placeholder="Full Name"
                                    value={form.name || ''}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                />
                                <input
                                    className="border rounded-lg px-4 py-2"
                                    placeholder="Email"
                                    value={form.email || ''}
                                    onChange={e => setForm({...form, email: e.target.value})}
                                />
                                <input
                                    className="border rounded-lg px-4 py-2"
                                    placeholder="Phone"
                                    value={form.phone || ''}
                                    onChange={e => setForm({...form, phone: e.target.value})}
                                />
                                <input
                                    className="border rounded-lg px-4 py-2"
                                    placeholder="Emergency Contact"
                                    value={form.emergency_contact || ''}
                                    onChange={e => setForm({...form, emergency_contact: e.target.value})}
                                />
                                <div className="col-span-2 flex gap-3">
                                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                        Save Changes
                                    </button>
                                    <button type="button" onClick={() => setEditing(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;