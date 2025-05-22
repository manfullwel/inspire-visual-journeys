
import React from 'react';
import { useAuth } from './AuthProvider';
import { Outlet } from 'react-router-dom';
import AdminHeader from '@/components/AdminHeader';
import { toast } from '@/hooks/use-toast';
import AccessDenied from '@/components/AccessDenied';

const AdminDashboard: React.FC = () => {
  const { isAdmin, isSuperAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <div className="container px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
