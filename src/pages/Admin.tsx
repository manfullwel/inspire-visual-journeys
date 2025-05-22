
import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import AdminDashboard from '@/components/AdminDashboard';
import AdminGalleryManager from '@/components/AdminGalleryManager';
import AdminCommentsView from '@/components/AdminCommentsView';
import AdminStatsView from '@/components/AdminStatsView';
import AdminAuditView from '@/components/AdminAuditView';
import AdminUsersView from '@/components/AdminUsersView';
import { useAuth } from '@/components/AuthProvider';

const Admin: React.FC = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />}>
        <Route index element={<AdminGalleryManager />} />
        <Route path="comments" element={<AdminCommentsView />} />
        <Route path="stats" element={<AdminStatsView />} />
        <Route path="audit" element={<AdminAuditView />} />
        <Route path="users" element={<AdminUsersView />} />
      </Route>
    </Routes>
  );
};

export default Admin;
