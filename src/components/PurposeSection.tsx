
import React, { forwardRef } from 'react';

interface PurposeSectionProps {
  id?: string;
}

const PurposeSection = forwardRef<HTMLElement, PurposeSectionProps>(({ id }, ref) => {
  return (
    <section ref={ref} id={id} className="py-20 bg-gray-50">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-event-dark">
            Por Que Compartilhamos Estas Conquistas?
          </h2>
          
          <div className="bg-white p-8 rounded-xl shadow-lg animate-slide-up">
            <p className="text-lg text-gray-700 leading-relaxed">
              Acreditamos que cada desafio superado, cada meta alcançada e cada sorriso de vitória merecem ser vistos. 
              Este espaço é um tributo à resiliência humana, um farol de esperança e um lembrete de que, juntos ou 
              individualmente, somos capazes de feitos extraordinários.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Seja um projeto concluído, um objetivo pessoal atingido ou a celebração de um novo começo, 
              o 'Palco de Conquistas' é onde a inspiração ganha vida.
            </p>
          </div>
          
          <div className="mt-12 flex justify-center space-x-8">
            <div className="p-6 bg-event-green/10 rounded-xl w-[180px]">
              <h3 className="font-bold text-event-green text-xl">Superação</h3>
              <p className="mt-2 text-gray-600">Vencendo limites a cada pedalada</p>
            </div>
            <div className="p-6 bg-event-blue/10 rounded-xl w-[180px]">
              <h3 className="font-bold text-event-blue text-xl">Comunidade</h3>
              <p className="mt-2 text-gray-600">Unidos por uma paixão em comum</p>
            </div>
            <div className="p-6 bg-event-orange/10 rounded-xl w-[180px]">
              <h3 className="font-bold text-event-orange text-xl">Inspiração</h3>
              <p className="mt-2 text-gray-600">Histórias que motivam novas jornadas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

PurposeSection.displayName = 'PurposeSection';

export default PurposeSection;
