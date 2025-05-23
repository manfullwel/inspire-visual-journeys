
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { useToast } from '@/hooks/use-toast';

const useGalleryItems = () => {
  const [items, setItems] = useState<GalleryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchItems = async (showToast = false) => {
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

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    refreshing,
    fetchItems,
    handleImageError
  };
};

export default useGalleryItems;
