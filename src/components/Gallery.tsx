
import React, { forwardRef, useState, useEffect } from 'react';
import GalleryItem from './GalleryItem';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryProps {
  id?: string;
  onItemClick: (item: GalleryItemType) => void;
}

const Gallery = forwardRef<HTMLElement, GalleryProps>(({ id, onItemClick }, ref) => {
  const [items, setItems] = useState<GalleryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <section ref={ref} id={id} className="py-20 bg-white">
      <div className="container px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-event-dark">
            Nossas Noites Inesquecíveis
          </h2>
          
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <GalleryItem 
                key={String(item.id)} 
                item={item} 
                onClick={onItemClick} 
                onImageError={() => handleImageError(index)}
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
