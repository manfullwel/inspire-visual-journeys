
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Lock } from 'lucide-react';

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Shield className="h-16 w-16 text-gray-300" />
            <Lock className="h-8 w-8 text-event-orange absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso Negado</h1>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página ou seu acesso expirou.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button 
            className="w-full bg-event-orange hover:bg-orange-600"
            onClick={() => navigate('/admin-login')}
          >
            Voltar para Login
          </Button>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Ir para o Site Principal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
