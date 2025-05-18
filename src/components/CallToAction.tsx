
import React from 'react';
import { Button } from '@/components/ui/button';

interface CallToActionProps {
  onDiscoverClick: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onDiscoverClick }) => {
  return (
    <section className="py-20 bg-gradient-to-r from-event-blue/80 to-event-green/80 text-white">
      <div className="container px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Qual Conquista Você Celebrará Hoje?
        </h2>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Inspire-se, defina seus próprios objetivos e lembre-se: a jornada é tão importante quanto o destino. 
          Que estas imagens sirvam como combustível para suas próprias vitórias.
        </p>
        
        <Button 
          onClick={onDiscoverClick}
          className="bg-white text-event-blue hover:bg-white/90 px-8 py-6 text-lg transition-transform hover:scale-105"
        >
          Participe do Próximo Evento
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
