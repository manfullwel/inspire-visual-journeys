
import React, { useState } from 'react';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { Camera, AlertTriangle } from 'lucide-react';

interface GalleryItemProps {
  item: GalleryItemType;
  onClick: (item: GalleryItemType) => void;
  onImageError?: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ item, onClick, onImageError }) => {
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
    if (onImageError) onImageError();
  };

  return (
    <div 
      className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-xl"
      onClick={() => onClick(item)}
    >
      {hasError ? (
        <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
          <AlertTriangle className="w-10 h-10 mb-2" />
          <p>Imagem não disponível</p>
          <p className="text-xs">{item.title}</p>
        </div>
      ) : (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-64 object-cover transition-all group-hover:brightness-90"
          loading="lazy"
          onError={handleImageError}
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
        <div>
          <h3 className="text-white text-xl font-bold">{item.title}</h3>
          <div className="bg-event-orange text-white text-xs px-2 py-1 rounded-full inline-block mt-2 flex items-center">
            <Camera className="w-3 h-3 mr-1" />
            Ver história
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;
