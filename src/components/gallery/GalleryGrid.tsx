
import React from 'react';
import GalleryItem from '@/components/GalleryItem';
import { GalleryItem as GalleryItemType } from '@/data/gallery';

interface GalleryGridProps {
  items: GalleryItemType[];
  onItemClick: (item: GalleryItemType, index: number) => void;
  onImageError: (index: number) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onItemClick, onImageError }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
      {items.map((item, index) => (
        <div 
          key={String(item.id)} 
          className={`${
            index % 3 === 0 ? 'lg:col-span-1' : 
            index % 3 === 1 ? 'lg:col-span-1' : 
            'lg:col-span-1'
          } ${
            index % 6 === 2 || index % 6 === 5 ? 'row-span-1' : 'row-span-1'
          }`}
        >
          <GalleryItem 
            item={item} 
            onClick={(item) => onItemClick(item, index)} 
            onImageError={() => onImageError(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
