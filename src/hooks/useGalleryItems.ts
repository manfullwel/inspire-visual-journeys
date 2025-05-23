
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { useToast } from '@/hooks/use-toast';

interface UseGalleryItemsProps {
  pageSize?: number;
  initialPage?: number;
}

const useGalleryItems = ({ 
  pageSize = 6, 
  initialPage = 0 
}: UseGalleryItemsProps = {}) => {
  const [items, setItems] = useState<GalleryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { toast } = useToast();

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

  const fetchItems = async (showToast = false, page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      if (showToast) setRefreshing(true);

      // First get the count of all items
      const countResult = await supabase
        .from('gallery_items')
        .select('id', { count: 'exact', head: true });
      
      if (countResult.error) throw countResult.error;
      setTotalItems(countResult.count || 0);

      // Then get the paginated items
      const startIndex = page * pageSize;
      
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + pageSize - 1);
      
      if (error) throw error;
      
      setItems(data || []);
      setCurrentPage(page);
      
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
          setTotalItems(galleryItems.length);
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

  const goToNextPage = () => {
    if (hasNextPage) {
      fetchItems(false, currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      fetchItems(false, currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      fetchItems(false, page);
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
    handleImageError,
    pagination: {
      currentPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage,
      goToPage,
      pageSize,
      totalItems
    }
  };
};

export default useGalleryItems;
