import React, { forwardRef, useState, useEffect, useImperativeHandle } from 'react';
import GalleryItem from './GalleryItem';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

interface GalleryProps {
  id?: string;
  onItemClick: (item: GalleryItemType) => void;
}

// Use forwardRef with explicit typings for the ref
const Gallery = forwardRef<GalleryRef, GalleryProps>(({ id, onItemClick }, ref) => {
  const [items, setItems] = useState<GalleryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const fetchGalleryItems = async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      if (showToast) setRefreshing(true);

      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setItems(data || []);
      
      if (showToast) {
        toast({
          title: 'Galeria atualizada',
          description: 'As imagens foram carregadas com sucesso.',
        });
      }
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
      
      // Se não conseguir carregar do Supabase, usar dados locais
      if (error.message?.includes("recursion")) {
        try {
          // Importar os dados fallback
          const { galleryItems } = await import('@/data/gallery');
          setItems(galleryItems);
          setError('Usando dados locais devido a um erro no servidor. Tente fazer login para ver a galeria completa.');
        } catch (fallbackError) {
          setError('Não foi possível carregar as imagens da galeria.');
        }
      } else {
        setError('Não foi possível carregar as imagens da galeria.');
        
        toast({
          title: 'Erro ao carregar galeria',
          description: 'Não foi possível carregar as imagens da galeria.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
      if (showToast) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleRetry = () => {
    fetchGalleryItems(true);
  };

  const handleImageError = (index: number) => {
    setItems(current => {
      // Substituir a URL da imagem com problema por uma imagem de fallback
      const updated = [...current];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          image: "/placeholder.svg" // Imagem de placeholder
        };
      }
      return updated;
    });
  };

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

  const renderMasonryGrid = () => (
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
            onClick={(item) => {
              setSelectedIndex(index);
              onItemClick(item);
            }} 
            onImageError={() => handleImageError(index)}
          />
        </div>
      ))}
    </div>
  );

  const renderCarousel = () => (
    <Carousel className="w-full">
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={String(item.id)} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <GalleryItem 
                item={item} 
                onClick={(item) => {
                  setSelectedIndex(index);
                  onItemClick(item);
                }} 
                onImageError={() => handleImageError(index)}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1" />
      <CarouselNext className="right-1" />
    </Carousel>
  );

  return (
    <section id={id} className="py-20 bg-white">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-event-dark">
            Sinta a Energia do Pedal
          </h2>
          
          <div className="flex items-center space-x-2">
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as 'grid' | 'carousel')}
              className="mr-2"
            >
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="grid">Grade</TabsTrigger>
                <TabsTrigger value="carousel">Carrossel</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {!loading && (
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Atualizar
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Cada imagem conta uma história de superação, amizade e a alegria de pedalar juntos 
          nas noites de Manaus. Clique para ver mais detalhes.
        </p>
        
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-event-orange animate-spin mb-4" />
            <p className="text-xl text-gray-500">Carregando galeria...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={handleRetry}
                className="px-4 py-2 bg-event-orange text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">Nenhuma imagem encontrada na galeria.</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {viewMode === 'grid' ? renderMasonryGrid() : renderCarousel()}
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

Gallery.displayName = 'Gallery';

export default Gallery;
