
import React from 'react';
import { Bike } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-event-dark text-white py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center">
            <Bike className="h-8 w-8 mr-3 text-event-orange" />
            <span className="text-xl font-bold">Pedal & Superação</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">Contato</h3>
              <p className="text-gray-300">contato@pedalesuperacao.com</p>
              <p className="text-gray-300">(11) 99999-9999</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Siga-nos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-6 text-center md:text-right">
          <p className="text-gray-400 text-sm">© 2025 Pedal & Superação. Todos os direitos reservados.</p>
          <p className="text-gray-500 text-xs mt-2">
            <Link to="/admin-login" className="hover:text-gray-300 transition-colors">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
