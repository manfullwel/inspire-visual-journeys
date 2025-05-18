
import React, { forwardRef } from 'react';
import { galleryItems } from '@/data/gallery';
import GalleryItem from './GalleryItem';
import { GalleryItem as GalleryItemType } from '@/data/gallery';

interface GalleryProps {
  id?: string;
  onItemClick: (item: GalleryItemType) => void;
}

const Gallery = forwardRef<HTMLElement, GalleryProps>(({ id, onItemClick }, ref) => {
  return (
    <section ref={ref} id={id} className="py-20 bg-white">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-event-dark">
          Galeria de Momentos
        </h2>
        
        <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Cada imagem conta uma história de superação, amizade e a alegria de pedalar juntos 
          nas noites de Manaus. Clique para ver mais detalhes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map(item => (
            <GalleryItem 
              key={item.id} 
              item={item} 
              onClick={onItemClick} 
            />
          ))}
        </div>
      </div>
    </section>
  );
});

Gallery.displayName = 'Gallery';

export default Gallery;
