import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import Home from "./components/LoginBox";
import AdminDashboard from "./pages/adminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminComplaints from "./pages/AdminComplaints";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerComplaints from "./pages/CustomerComplaints";
import Notifications from "./pages/Notifications";
import ProfilePage from "./pages/ProfilePage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminNotifications from "./pages/AdminNotifications";
import AdminProfile from "./pages/AdminProfile";
import { ToastContainer, useToast } from './components/Toast';

function App() {
  const { toasts, removeToast, toast } = useToast();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home toast={toast} />} />
        <Route path="/register" element={<RegisterPage toast={toast} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard toast={toast} />} />
        <Route path="/admin/users" element={<AdminUsers toast={toast} />} />
        <Route path="/admin/complaints" element={<AdminComplaints toast={toast} />} />
        <Route path="/admin/alerts" element={<AdminNotifications />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/complaints" element={<CustomerComplaints toast={toast} />} />
        <Route path="/customer/alerts" element={<Notifications />} />
        <Route path="/customer/profile" element={<ProfilePage />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      </Routes>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Router>
  );
}

export default App;
