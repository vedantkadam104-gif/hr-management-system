import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Employees from './pages/admin/Employees';
import Attendance from './pages/admin/Attendance';
import Leaves from './pages/admin/Leaves';
import Payroll from './pages/admin/Payroll';
import Profile from './pages/employee/Profile';
import MyAttendance from './pages/employee/MyAttendance';
import MyLeaves from './pages/employee/MyLeaves';
import MyPayroll from './pages/employee/MyPayroll';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute role="admin"><Employees /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute role="admin"><Attendance /></ProtectedRoute>} />
      <Route path="/admin/leaves" element={<ProtectedRoute role="admin"><Leaves /></ProtectedRoute>} />
      <Route path="/admin/payroll" element={<ProtectedRoute role="admin"><Payroll /></ProtectedRoute>} />
      <Route path="/employee/profile" element={<ProtectedRoute role="employee"><Profile /></ProtectedRoute>} />
      <Route path="/employee/attendance" element={<ProtectedRoute role="employee"><MyAttendance /></ProtectedRoute>} />
      <Route path="/employee/leaves" element={<ProtectedRoute role="employee"><MyLeaves /></ProtectedRoute>} />
      <Route path="/employee/payroll" element={<ProtectedRoute role="employee"><MyPayroll /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;