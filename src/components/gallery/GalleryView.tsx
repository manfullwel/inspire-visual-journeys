
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import useGalleryItems from '@/hooks/useGalleryItems';
import GalleryHeader from './GalleryHeader';
import GalleryGrid from './GalleryGrid';
import GalleryCarousel from './GalleryCarousel';
import GalleryLoading from './GalleryLoading';
import GalleryError from './GalleryError';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

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
  const { 
    items, 
    loading, 
    error, 
    fetchItems, 
    refreshing, 
    handleImageError,
    pagination 
  } = useGalleryItems({ pageSize: 6 });

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

  // Generate pagination links
  const renderPaginationItems = () => {
    const { currentPage, totalPages, goToPage } = pagination;
    const pageItems = [];
    
    // Always show first page
    pageItems.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 0} 
          onClick={() => goToPage(0)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if there are many pages and we're not at the beginning
    if (currentPage > 2) {
      pageItems.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show current page and surrounding pages
    for (let i = Math.max(1, currentPage); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
      if (i === 0) continue; // Skip first page as we already added it
      pageItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => goToPage(i)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if there are many pages and we're not at the end
    if (currentPage < totalPages - 3) {
      pageItems.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if not the same as first page
    if (totalPages > 1) {
      pageItems.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages - 1} 
            onClick={() => goToPage(totalPages - 1)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageItems;
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
            
            {pagination.totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={pagination.hasPreviousPage ? pagination.goToPreviousPage : undefined}
                      className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={pagination.hasNextPage ? pagination.goToNextPage : undefined}
                      className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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
