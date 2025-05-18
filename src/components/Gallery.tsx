
import React, { forwardRef, useState, useEffect } from 'react';
import GalleryItem from './GalleryItem';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface GalleryProps {
  id?: string;
  onItemClick: (item: GalleryItemType) => void;
}

const Gallery = forwardRef<HTMLElement, GalleryProps>(({ id, onItemClick }, ref) => {
  const [items, setItems] = useState<GalleryItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setItems(data || []);
      } catch (error: any) {
        console.error('Error fetching gallery items:', error);
        toast({
          title: 'Erro ao carregar galeria',
          description: 'Não foi possível carregar as imagens da galeria.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  return (
    <section ref={ref} id={id} className="py-20 bg-white">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-event-dark">
          Nossas Noites Inesquecíveis
        </h2>
        
        <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Cada imagem conta uma história de superação, amizade e a alegria de pedalar juntos 
          nas noites de Manaus. Clique para ver mais detalhes.
        </p>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">Carregando galeria...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <GalleryItem 
                key={String(item.id)} 
                item={item} 
                onClick={onItemClick} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

Gallery.displayName = 'Gallery';

export default Gallery;
