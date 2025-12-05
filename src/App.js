import React, { createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import Home from "./components/LoginBox";
import AdminDashboard from "./pages/adminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminComplaints from "./pages/AdminComplaints";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerComplaints from "./pages/CustomerComplaints";
import CustomerProfile from "./pages/CustomerProfile";
import Notifications from "./pages/Notifications";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeComplaints from './pages/EmployeeComplaints';
import EmployeeProfile from './pages/EmployeeProfile';

import AdminProfile from "./pages/AdminProfile";
import { ToastContainer, useToast } from './components/Toast';
import NavLayout from './components/NavLayout';

export const ToastContext = createContext();

function App() {
  const { toasts, removeToast, toast } = useToast();
  
  return (
    <ToastContext.Provider value={toast}>
      <Router>
        <Routes>
          <Route path="/" element={<Home toast={toast} />} />
          <Route path="/register" element={<RegisterPage toast={toast} />} />
          <Route element={<NavLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard toast={toast} />} />
            <Route path="/admin/users" element={<AdminUsers toast={toast} />} />
            <Route path="/admin/complaints" element={<AdminComplaints toast={toast} />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/complaints" element={<CustomerComplaints toast={toast} />} />
            <Route path="/customer/alerts" element={<Notifications />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/complaints" element={<EmployeeComplaints toast={toast} />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />
          </Route>
        </Routes>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </Router>
    </ToastContext.Provider>
  );
}

export default App;
