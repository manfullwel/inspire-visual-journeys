
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import useGalleryItems from '@/hooks/useGalleryItems';
import GalleryHeader from './GalleryHeader';
import GalleryGrid from './GalleryGrid';
import GalleryCarousel from './GalleryCarousel';
import GalleryLoading from './GalleryLoading';
import GalleryError from './GalleryError';
import { Button } from '@/components/ui/button';

// Define the interface for functions exposed by the Gallery component
export interface GalleryRef {
  navigateToNext: () => GalleryItemType | null;
  navigateToPrevious: () => GalleryItemType | null;
  hasNext: () => boolean;
  hasPrevious: () => boolean;
  getCurrentIndex: () => number;
  getCurrentItem: () => GalleryItemType;
  getAllItems: () => GalleryItemType[];
}

interface GalleryViewProps {
  id?: string;
  onItemClick: (item: GalleryItemType) => void;
}

const GalleryView = forwardRef<GalleryRef, GalleryViewProps>(({ id, onItemClick }, ref) => {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { items, loading, error, fetchItems, refreshing, handleImageError } = useGalleryItems();

  // Expose functions via useImperativeHandle with the correct type
  useImperativeHandle(ref, (): GalleryRef => ({
    navigateToNext: () => {
      if (selectedIndex < items.length - 1) {
        setSelectedIndex(selectedIndex + 1);
        return items[selectedIndex + 1];
      }
      return null;
    },
    navigateToPrevious: () => {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
        return items[selectedIndex - 1];
      }
      return null;
    },
    hasNext: () => selectedIndex < items.length - 1,
    hasPrevious: () => selectedIndex > 0,
    getCurrentIndex: () => selectedIndex,
    getCurrentItem: () => items[selectedIndex],
    getAllItems: () => items
  }));

  const handleItemClick = (item: GalleryItemType, index: number) => {
    setSelectedIndex(index);
    onItemClick(item);
  };

  return (
    <section id={id} className="py-20 bg-white">
      <div className="container px-4">
        <GalleryHeader 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          refreshing={refreshing} 
          loading={loading} 
          onRefresh={() => fetchItems(true)} 
        />
        
        <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Cada imagem conta uma história de superação, amizade e a alegria de pedalar juntos 
          nas noites de Manaus. Clique para ver mais detalhes.
        </p>
        
        {loading ? (
          <GalleryLoading />
        ) : error ? (
          <GalleryError error={error} onRetry={() => fetchItems(true)} />
        ) : items.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">Nenhuma imagem encontrada na galeria.</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {viewMode === 'grid' ? (
              <GalleryGrid 
                items={items} 
                onItemClick={handleItemClick} 
                onImageError={handleImageError} 
              />
            ) : (
              <GalleryCarousel 
                items={items} 
                onItemClick={handleItemClick} 
                onImageError={handleImageError} 
              />
            )}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button 
            className="bg-event-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105"
          >
            Compartilhe Sua História
          </Button>
        </div>
      </div>
    </section>
  );
});

GalleryView.displayName = 'GalleryView';

export default GalleryView;
