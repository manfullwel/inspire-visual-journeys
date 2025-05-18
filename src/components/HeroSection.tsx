
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
          className="absolute inset-0 bg-black opacity-50 z-10"
          aria-hidden="true"
        ></div>
        <img
          src="https://images.unsplash.com/photo-1468818438311-4bab781ab9b8"
          alt="Ciclistas em uma paisagem montanhosa"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container relative z-20 text-white text-center px-4">
        <div className="animate-fade-in">
          <Bike className="mx-auto h-20 w-20 mb-6 text-event-orange" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
            Celebre Cada Passo: Sua Jornada de Inspiração Começa Aqui
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-100">
            Explore momentos que transformam, motivam e relembram o poder que reside em cada um de nós.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onDiscoverClick}
              className="bg-event-orange hover:bg-orange-600 text-white px-8 py-6 text-lg transition-transform hover:scale-105"
            >
              Descubra Histórias
            </Button>
            <Button 
              onClick={onPurposeClick}
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg transition-transform hover:scale-105"
            >
              Conheça o Propósito
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
