
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bike } from 'lucide-react';

interface HeroSectionProps {
  onDiscoverClick: () => void;
  onPurposeClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onDiscoverClick, onPurposeClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-black opacity-60 z-10"
          aria-hidden="true"
        ></div>
        <img
          src="/lovable-uploads/866ebab1-6af1-45a7-8700-70b512305b2e.png"
          alt="BIKE NIGHT AMAZONAS, com ciclistas coloridos pedalando em um fundo urbano noturno"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="container relative z-20 text-white text-center px-4">
        <div className="animate-fade-in">
          <Bike className="mx-auto h-20 w-20 mb-6 text-event-orange" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
            BIKE NIGHT AMAZONAS
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto text-gray-100">
            Pedale, Sorria, Celebre a Liberdade Sobre Duas Rodas em Manaus!
          </p>
          
          <p className="text-lg mb-10 max-w-2xl mx-auto text-gray-200">
            Junte-se a nós para uma experiência única de ciclismo noturno pelas ruas de Manaus. 
            Energia, comunidade e a beleza da cidade sob um novo olhar esperam por você.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onDiscoverClick}
              className="bg-event-orange hover:bg-orange-600 text-white px-8 py-6 text-lg transition-transform hover:scale-105"
            >
              Ver Nossos Momentos
            </Button>
            <Button 
              onClick={onPurposeClick}
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg transition-transform hover:scale-105"
            >
              Próximo Pedal: Saiba Mais!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
