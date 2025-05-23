
import React from 'react';
import { Loader2 } from 'lucide-react';

const GalleryLoading: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <Loader2 className="w-10 h-10 text-event-orange animate-spin mb-4" />
      <p className="text-xl text-gray-500">Carregando galeria...</p>
    </div>
  );
};

export default GalleryLoading;
