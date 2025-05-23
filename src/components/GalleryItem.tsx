
import React, { useState } from 'react';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { Camera, CalendarIcon, AlertTriangle } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface GalleryItemProps {
  item: GalleryItemType;
  onClick: (item: GalleryItemType) => void;
  onImageError?: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ item, onClick, onImageError }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver({
    rootMargin: '200px', // Start loading when image is 200px away from viewport
  });

  const handleImageError = () => {
    setHasError(true);
    if (onImageError) onImageError();
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={() => onClick(item)}
    >
      {hasError ? (
        <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
          <AlertTriangle className="w-10 h-10 mb-2" />
          <p>Imagem não disponível</p>
          <p className="text-xs">{item.title}</p>
        </div>
      ) : (
        <>
          <div className={`w-full h-64 bg-gray-200 flex items-center justify-center ${isLoaded ? 'hidden' : 'block'}`}>
            <div className="w-6 h-6 border-2 border-event-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
          {(hasIntersected || typeof window === 'undefined') && (
            <img
              src={item.image}
              alt={item.title}
              className={`w-full h-64 object-cover transition-all duration-500 ${isLoaded ? 'block' : 'hidden'} group-hover:brightness-95`}
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
        </>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white text-xl font-bold">{item.title}</h3>
          {item.date && (
            <div className="flex items-center text-white/80 text-xs mt-1">
              <CalendarIcon className="w-3 h-3 mr-1" />
              <span>{item.date}</span>
            </div>
          )}
          <div className="bg-event-orange text-white text-xs px-2 py-1 rounded-full inline-flex items-center mt-2">
            <Camera className="w-3 h-3 mr-1" />
            Ver história
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;
