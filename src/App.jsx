import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Student Pages
import Login from './pages/student/Login';
import StudentLayout from './components/student/StudentLayout';
import Dashboard from './pages/student/Dashboard';
import Units from './pages/student/Units';
import PdfView from './pages/student/PdfView';
import Notices from './pages/student/Notices';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddSubject from './pages/admin/AddSubject';
import UploadPdf from './pages/admin/UploadPdf';
import ManageContent from './pages/admin/ManageContent';
import ManageNotices from './pages/admin/ManageNotices';
import AddStudent from './pages/admin/AddStudent';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Student Routes with Sidebar */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/units/:subjectId" element={<Units />} />
          <Route path="/pdf/:unitId" element={<PdfView />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-subject" element={<AddSubject />} />
          <Route path="upload-pdf" element={<UploadPdf />} />
          <Route path="manage-content" element={<ManageContent />} />
          <Route path="manage-notices" element={<ManageNotices />} />
          <Route path="add-student" element={<AddStudent />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
