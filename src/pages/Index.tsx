
import React, { useRef, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import PurposeSection from '@/components/PurposeSection';
import Gallery, { GalleryRef } from '@/components/Gallery';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import ImageModal from '@/components/ImageModal';
import HistorySection from '@/components/HistorySection';
import ParticipationForm from '@/components/ParticipationForm';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const purposeRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<GalleryRef>(null);
  const participationRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [selectedItem, setSelectedItem] = useState<GalleryItemType | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToRef = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleItemClick = (item: GalleryItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleParticipateClick = () => {
    participationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNextImage = () => {
    if (galleryRef.current) {
      const nextItem = galleryRef.current.navigateToNext();
      if (nextItem) {
        setSelectedItem(nextItem);
      }
    }
  };

  const handlePreviousImage = () => {
    if (galleryRef.current) {
      const prevItem = galleryRef.current.navigateToPrevious();
      if (prevItem) {
        setSelectedItem(prevItem);
      }
    }
  };

  const hasNext = galleryRef.current?.hasNext() || false;
  const hasPrevious = galleryRef.current?.hasPrevious() || false;

  return (
    <div className="min-h-screen">
      <HeroSection 
        onDiscoverClick={() => {
          // Create a separate ref for scrolling
          const galleryElement = document.getElementById('gallery-section');
          if (galleryElement) {
            galleryElement.scrollIntoView({ behavior: 'smooth' });
          }
        }} 
        onPurposeClick={() => scrollToRef(purposeRef)} 
      />
      
      <PurposeSection ref={purposeRef} />
      
      <HistorySection />
      
      <Gallery 
        id="gallery-section"
        ref={galleryRef} 
        onItemClick={handleItemClick} 
      />
      
      <div ref={participationRef}>
        <ParticipationForm />
      </div>
      
      <CallToAction onDiscoverClick={handleParticipateClick} />
      
      <Footer />
      
      <ImageModal 
        item={selectedItem} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />
    </div>
  );
};

export default Index;
