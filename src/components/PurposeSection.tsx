
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
            Prepare sua Bike: Nosso Próximo Encontro!
          </h2>
          
          <div className="bg-white p-8 rounded-xl shadow-lg animate-slide-up">
            <p className="text-lg text-gray-700 leading-relaxed">
              Junte-se a nós para 10 km de pura diversão noturna por vias seguras. Contamos com apoio mecânico 
              e escolta de trânsito para sua tranquilidade.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Curta uma trilha sonora animada, faça pausas para fotos em pontos icônicos de Manaus 
              e entre no clima de confraternização que só o Bike Night Amazonas oferece.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Ciclistas de todos os níveis são bem-vindos! Do iniciante ao veterano, o importante é compartilhar a 
              paixão pela bike e explorar nossa cidade de forma divertida e sustentável.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-event-green/10 rounded-xl">
              <h3 className="font-bold text-event-green text-xl">🌆 Visual Único</h3>
              <p className="mt-2 text-gray-600">Descubra Manaus sob uma nova luz, revelando belezas urbanas que só a noite mostra.</p>
            </div>
            <div className="p-6 bg-event-blue/10 rounded-xl">
              <h3 className="font-bold text-event-blue text-xl">🤝 Comunidade</h3>
              <p className="mt-2 text-gray-600">Faça novas amizades, fortaleça laços e conecte-se com outros apaixonados por bike.</p>
            </div>
            <div className="p-6 bg-event-orange/10 rounded-xl">
              <h3 className="font-bold text-event-orange text-xl">📸 Inspiração</h3>
              <p className="mt-2 text-gray-600">Cenários encantadores perfeitos para fotos e vídeos memoráveis. Crie suas próprias histórias!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

PurposeSection.displayName = 'PurposeSection';

export default PurposeSection;
