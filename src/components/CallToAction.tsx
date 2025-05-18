
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Route, Users, Heart } from 'lucide-react';

interface CallToActionProps {
  onDiscoverClick: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onDiscoverClick }) => {
  return (
    <section className="py-20 bg-gradient-to-r from-event-blue/80 to-event-green/80 text-white">
      <div className="container px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Por que participar do BIKE NIGHT AMAZONAS?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="font-bold text-xl mb-2 flex items-center justify-center">
              <Calendar className="mr-2 h-5 w-5" /> Detalhes do Evento
            </h3>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <MapPin className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                <span>Ponto de Encontro: Praça da Saudade, Centro Histórico</span>
              </li>
              <li className="flex items-start">
                <Calendar className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                <span>Data & Horário: Sexta-feira, 20h</span>
              </li>
              <li className="flex items-start">
                <Route className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                <span>Trajeto: 10 km de passeio noturno com apoio e escolta</span>
              </li>
              <li className="flex items-start">
                <Users className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                <span>Para quem: Ciclistas de todos os níveis</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="font-bold text-xl mb-2 flex items-center justify-center">
              <Heart className="mr-2 h-5 w-5" /> Benefícios
            </h3>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>Visual Único: A cidade sob iluminação urbana</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>Comunidade: Faça novas amizades entre ciclistas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>Saúde & Bem-estar: Movimento ao ar livre</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>Inspiração: Cenários encantadores para fotos e vídeos</span>
              </li>
            </ul>
          </div>
        </div>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto italic">
          "Prepare sua bike, ajuste o farol e junte‑se ao Bike Night Amazonas para pedalar, 
          sorrir e celebrar juntos a liberdade sobre duas rodas!"
        </p>
        
        <Button 
          onClick={onDiscoverClick}
          className="bg-white text-event-green hover:bg-white/90 px-8 py-6 text-lg transition-transform hover:scale-105"
        >
          Participar do Próximo Evento
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
