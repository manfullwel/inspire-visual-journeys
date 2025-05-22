
import React from 'react';
import { useAuth } from './AuthProvider';
import { Bike, LogOut, BarChart2, Image, MessageSquare, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AdminHeader: React.FC = () => {
  const { user, isSuperAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin-login');
  };

  return (
    <header className="bg-event-dark text-white py-4 px-6">
      <div className="flex items-center justify-between mb-4">
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
      </div>

      <nav className="flex overflow-x-auto pb-3">
        <Link 
          to="/admin"
          className={cn(
            "px-4 py-2 rounded-lg mx-1 flex items-center whitespace-nowrap",
            "text-gray-300 hover:text-white hover:bg-gray-700"
          )}
        >
          <Image className="h-4 w-4 mr-2" />
          Galeria
        </Link>
        
        <Link 
          to="/admin/comments"
          className={cn(
            "px-4 py-2 rounded-lg mx-1 flex items-center whitespace-nowrap",
            "text-gray-300 hover:text-white hover:bg-gray-700"
          )}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Comentários
        </Link>
        
        {isSuperAdmin && (
          <>
            <Link 
              to="/admin/users"
              className={cn(
                "px-4 py-2 rounded-lg mx-1 flex items-center whitespace-nowrap",
                "text-gray-300 hover:text-white hover:bg-gray-700"
              )}
            >
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </Link>
            
            <Link 
              to="/admin/stats"
              className={cn(
                "px-4 py-2 rounded-lg mx-1 flex items-center whitespace-nowrap",
                "text-gray-300 hover:text-white hover:bg-gray-700"
              )}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Estatísticas
            </Link>
            
            <Link 
              to="/admin/audit"
              className={cn(
                "px-4 py-2 rounded-lg mx-1 flex items-center whitespace-nowrap",
                "text-gray-300 hover:text-white hover:bg-gray-700"
              )}
            >
              <FileText className="h-4 w-4 mr-2" />
              Logs de Auditoria
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default AdminHeader;
