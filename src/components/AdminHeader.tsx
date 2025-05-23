
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { LogOut, Image, MessageSquare, LineChart, Shield, Users } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const { signOut, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow">
      <div className="container px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-event-dark">
            Painel Administrativo
          </h1>
        </div>
        
        <nav className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <ul className="flex space-x-1 md:space-x-2">
            <li>
              <NavLink 
                to="/admin"
                end
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm flex items-center ${
                    isActive ? 'bg-event-orange text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Image className="w-4 h-4 mr-1" />
                <span>Galeria</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/comments"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm flex items-center ${
                    isActive ? 'bg-event-orange text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>Comentários</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/stats"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm flex items-center ${
                    isActive ? 'bg-event-orange text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <LineChart className="w-4 h-4 mr-1" />
                <span>Estatísticas</span>
              </NavLink>
            </li>
            {isSuperAdmin && (
              <>
                <li>
                  <NavLink 
                    to="/admin/audit"
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm flex items-center ${
                        isActive ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    <span>Auditoria</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/admin/users"
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm flex items-center ${
                        isActive ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <Users className="w-4 h-4 mr-1" />
                    <span>Usuários</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 mt-2 sm:mt-0"
        >
          <LogOut className="w-4 h-4 mr-1" />
          <span>Sair</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
