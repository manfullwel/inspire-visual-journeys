
import React, { forwardRef } from 'react';
import GalleryView, { GalleryRef } from './gallery/GalleryView';
import { GalleryItem as GalleryItemType } from '@/data/gallery';

interface GalleryProps {
  id?: string;
  onItemClick: (item: GalleryItemType) => void;
}

// Use forwardRef with explicit typings for the ref
const Gallery = forwardRef<GalleryRef, GalleryProps>((props, ref) => {
  return <GalleryView {...props} ref={ref} />;
});

Gallery.displayName = 'Gallery';

// Re-export the GalleryRef type
export type { GalleryRef };
export default Gallery;
