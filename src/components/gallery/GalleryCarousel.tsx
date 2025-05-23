
import React from 'react';
import GalleryItem from '@/components/GalleryItem';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GalleryCarouselProps {
  items: GalleryItemType[];
  onItemClick: (item: GalleryItemType, index: number) => void;
  onImageError: (index: number) => void;
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ items, onItemClick, onImageError }) => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={String(item.id)} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <GalleryItem 
                item={item} 
                onClick={(item) => onItemClick(item, index)} 
                onImageError={() => onImageError(index)}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1" />
      <CarouselNext className="right-1" />
    </Carousel>
  );
};

export default GalleryCarousel;
