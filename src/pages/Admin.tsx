
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import AdminHeader from '@/components/AdminHeader';
import AdminGalleryManager from '@/components/AdminGalleryManager';

const Admin: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin-login');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold text-event-dark mb-6">
          Painel de Administração
        </h1>
        
        <AdminGalleryManager />
      </div>
    </div>
  );
};

export default Admin;
