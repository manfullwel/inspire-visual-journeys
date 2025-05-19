
import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistorySectionProps {
  className?: string;
}

const HistorySection: React.FC<HistorySectionProps> = ({ className }) => {
  return (
    <section className={cn("py-16 bg-gray-50", className)} id="history">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossa História</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Mais de 10 anos de história pedalando juntos pelas ruas de Manaus
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-full md:w-1/2 rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/lovable-uploads/74931d0c-9d05-4201-b56c-d99add7af63b.png"
              alt="Primeiro evento do Bike Night Amazonas em 2013" 
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="flex items-center mb-4 text-event-orange">
              <Calendar className="mr-2" />
              <span className="font-semibold">2013 - O Início</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Como Tudo Começou</h3>
            <p className="text-gray-700 mb-4">
              Em 2013, um pequeno grupo de entusiastas da bicicleta se reuniu com uma visão: transformar as noites de Manaus 
              em um espaço de comunidade, saúde e exploração urbana. O primeiro passeio contou com apenas 15 ciclistas, mas a 
              energia era contagiante.
            </p>
            <p className="text-gray-700 mb-4">
              Usando coletes improvisados e lanternas básicas, o grupo percorreu 8km pelo centro da cidade, descobrindo uma 
              Manaus diferente - mais silenciosa, mais íntima e cheia de possibilidades.
            </p>
            <p className="text-gray-700">
              Hoje, mais de uma década depois, o Bike Night Amazonas cresceu para centenas de participantes regulares, mas mantém 
              o mesmo espírito inclusivo e a paixão por unir pessoas através do ciclismo noturno.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
