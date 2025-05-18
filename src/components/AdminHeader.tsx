
import React from 'react';
import { useAuth } from './AuthProvider';
import { Bike, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';

const AdminHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin-login');
  };

  return (
    <header className="bg-event-dark text-white py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Bike className="h-8 w-8 text-event-orange mr-3" />
        <div>
          <h1 className="text-xl font-bold">Bike Night Admin</h1>
          <p className="text-sm text-gray-300">{user?.email}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-gray-300 hover:text-white transition">
          Ver site
        </Link>
        
        <Button 
          size="sm"
          variant="outline"
          className="border-gray-600 text-gray-200 hover:bg-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
