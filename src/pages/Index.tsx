
import React, { useRef, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import PurposeSection from '@/components/PurposeSection';
import Gallery from '@/components/Gallery';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import ImageModal from '@/components/ImageModal';
import HistorySection from '@/components/HistorySection';
import ParticipationForm from '@/components/ParticipationForm';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { useToast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const purposeRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
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

  return (
    <div className="min-h-screen">
      <HeroSection 
        onDiscoverClick={() => scrollToRef(galleryRef)} 
        onPurposeClick={() => scrollToRef(purposeRef)} 
      />
      
      <PurposeSection ref={purposeRef} />
      
      <HistorySection />
      
      <Gallery 
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
      />
    </div>
  );
};

export default Index;
