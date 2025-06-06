
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryItem } from '@/data/gallery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Edit, Trash, Image, Plus, Camera, RefreshCw, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GalleryItemFormData {
  title: string;
  image: string;
  description: string;
  motivation: string;
}

const AdminGalleryManager: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const form = useForm<GalleryItemFormData>({
    defaultValues: {
      title: '',
      image: '',
      description: '',
      motivation: '',
    },
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    if (selectedItem && isEditModalOpen) {
      form.reset({
        title: selectedItem.title,
        image: selectedItem.image,
        description: selectedItem.description || '',
        motivation: selectedItem.motivation || '',
      });
    } else if (isAddModalOpen) {
      form.reset({
        title: '',
        image: '',
        description: '',
        motivation: '',
      });
    }
  }, [selectedItem, isEditModalOpen, isAddModalOpen, form]);

  const fetchGalleryItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setItems(data || []);
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
      setError(error.message || 'Erro ao carregar imagens da galeria');
      toast({
        title: 'Erro ao carregar imagens',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshGallery = async () => {
    setIsRefreshing(true);
    try {
      await fetchGalleryItems();
      toast({
        title: 'Galeria atualizada',
        description: 'As imagens foram atualizadas com sucesso.',
      });
    } catch (error) {
      // Erros já são tratados em fetchGalleryItems
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddItem = async (data: GalleryItemFormData) => {
    try {
      const { error } = await supabase.from('gallery_items').insert([
        {
          title: data.title,
          image: data.image,
          description: data.description,
          motivation: data.motivation,
        },
      ]);
      
      if (error) throw error;
      
      toast({
        title: 'Imagem adicionada',
        description: 'A imagem foi adicionada com sucesso.',
      });
      
      setIsAddModalOpen(false);
      fetchGalleryItems();
    } catch (error: any) {
      console.error('Error adding gallery item:', error);
      toast({
        title: 'Erro ao adicionar imagem',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEditItem = async (data: GalleryItemFormData) => {
    if (!selectedItem) return;
    
    try {
      const { error } = await supabase
        .from('gallery_items')
        .update({
          title: data.title,
          image: data.image,
          description: data.description,
          motivation: data.motivation,
        })
        .eq('id', String(selectedItem.id)); // Convert id to string
      
      if (error) throw error;
      
      toast({
        title: 'Imagem atualizada',
        description: 'A imagem foi atualizada com sucesso.',
      });
      
      setIsEditModalOpen(false);
      fetchGalleryItems();
    } catch (error: any) {
      console.error('Error updating gallery item:', error);
      toast({
        title: 'Erro ao atualizar imagem',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    
    try {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', String(selectedItem.id)); // Convert id to string
      
      if (error) throw error;
      
      toast({
        title: 'Imagem excluída',
        description: 'A imagem foi excluída com sucesso.',
      });
      
      setIsDeleteModalOpen(false);
      fetchGalleryItems();
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: 'Erro ao excluir imagem',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 my-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-event-dark">Gerenciar Galeria</h2>
        <div className="flex gap-2">
          <Button 
            onClick={refreshGallery}
            variant="outline"
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Atualizar
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-event-green hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nova Imagem
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Erro ao carregar imagens</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <Loader2 className="w-10 h-10 text-event-orange animate-spin mb-4" />
          <div className="text-center">Carregando imagens da galeria...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma imagem encontrada</h3>
          <p className="text-gray-500 mb-4">Adicione imagens à galeria para que elas apareçam aqui.</p>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-event-green hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Imagem
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={String(item.id)} className="border rounded-lg overflow-hidden bg-gray-50">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 h-10">
                  {item.description}
                </p>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Imagem</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditItem)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da imagem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                        <Button 
                          type="button"
                          variant="outline"
                          className="ml-2"
                          onClick={() => {
                            toast({
                              title: "Upload de imagem",
                              description: "Em um ambiente de produção, isso abriria um seletor de arquivos.",
                            });
                          }}
                        >
                          <Image className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição da imagem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivação</FormLabel>
                    <FormControl>
                      <Input placeholder="Motivação ou mensagem inspiradora" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-event-blue hover:bg-blue-600">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Imagem</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da imagem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                        <Button 
                          type="button"
                          variant="outline"
                          className="ml-2"
                          onClick={() => {
                            toast({
                              title: "Upload de imagem",
                              description: "Em um ambiente de produção, isso abriria um seletor de arquivos.",
                            });
                          }}
                        >
                          <Image className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição da imagem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivação</FormLabel>
                    <FormControl>
                      <Input placeholder="Motivação ou mensagem inspiradora" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-event-green hover:bg-green-600">
                  Adicionar Imagem
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          
          <p>
            Tem certeza que deseja excluir a imagem "{selectedItem?.title}"? Esta ação não pode ser desfeita.
          </p>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteItem}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGalleryManager;
