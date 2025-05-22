
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, MessageSquare, Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Comment {
  id: string;
  author_name: string;
  gallery_item_id: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  gallery_title?: string;
  gallery_image?: string;
}

const AdminCommentsView: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { isAdmin } = useAuth();
  
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Build the query
        let isPending = tab === 'pending';
        
        let query = supabase
          .from('comments')
          .select(`
            *,
            gallery_title:gallery_items(title),
            gallery_image:gallery_items(image)
          `, { count: 'exact' })
          .eq('is_approved', !isPending)
          .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
          .order('created_at', { ascending: false });
        
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        // Format the results
        const formattedComments = data?.map(comment => {
          const { gallery_title, gallery_image, ...rest } = comment;
          return {
            ...rest,
            gallery_title: typeof gallery_title === 'object' ? gallery_title.title : null,
            gallery_image: typeof gallery_image === 'object' ? gallery_image.image : null
          };
        }) || [];
        
        setComments(formattedComments);
        
        if (count !== null) {
          setTotalPages(Math.ceil(count / PAGE_SIZE));
        }
      } catch (error: any) {
        setError(error.message || 'Erro ao carregar comentários');
      } finally {
        setLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchComments();
    }
  }, [isAdmin, tab, page]);

  const handleApproveComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_approved: true })
        .eq('id', commentId);
      
      if (error) throw error;
      
      toast({
        title: 'Comentário aprovado',
        description: 'O comentário foi aprovado e está disponível para visualização'
      });
      
      // Update local state
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error: any) {
      toast({
        title: 'Erro ao aprovar comentário',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleRejectComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      
      toast({
        title: 'Comentário rejeitado',
        description: 'O comentário foi excluído com sucesso'
      });
      
      // Update local state
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error: any) {
      toast({
        title: 'Erro ao rejeitar comentário',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const openViewDialog = (comment: Comment) => {
    setSelectedComment(comment);
    setIsViewDialogOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-event-dark mb-6">
        Gerenciar Comentários
      </h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-event-dark" />
            <h2 className="text-xl font-semibold">Comentários</h2>
          </div>
          
          <TabsList>
            <TabsTrigger value="pending" onClick={() => { setTab('pending'); setPage(1); }}>
              <Badge className="mr-2 bg-amber-500">Pendentes</Badge>
              Aguardando Aprovação
            </TabsTrigger>
            <TabsTrigger value="approved" onClick={() => { setTab('approved'); setPage(1); }}>
              <Badge className="mr-2 bg-green-500">Aprovados</Badge>
              Comentários Publicados
            </TabsTrigger>
          </TabsList>
        </div>
        
        <Card>
          {loading ? (
            <div className="text-center py-12">Carregando comentários...</div>
          ) : (
            <TabsContent value={tab} className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Comentário</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell>{comment.author_name}</TableCell>
                      <TableCell>{comment.gallery_title}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{comment.content}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline" 
                          size="sm"
                          className="mr-2"
                          onClick={() => openViewDialog(comment)}
                        >
                          Ver
                        </Button>
                        
                        {tab === 'pending' ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 mr-2"
                              onClick={() => handleApproveComment(comment.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                              onClick={() => handleRejectComment(comment.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRejectComment(comment.id)}
                          >
                            Excluir
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {comments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        {tab === 'pending' 
                          ? 'Não há comentários pendentes de aprovação.' 
                          : 'Não há comentários aprovados.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(Math.max(1, page - 1))}
                        className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show max 5 page buttons, centered around current page
                      let pageNum = page;
                      if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink 
                              onClick={() => setPage(pageNum)}
                              isActive={page === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </TabsContent>
          )}
        </Card>
      </Tabs>
      
      {/* View Comment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Visualizar Comentário</DialogTitle>
          </DialogHeader>
          
          {selectedComment && (
            <div className="space-y-4">
              <div className="flex space-x-4 items-start">
                <div className="w-1/3">
                  <img 
                    src={selectedComment.gallery_image || '/placeholder.svg'} 
                    alt={selectedComment.gallery_title || 'Imagem da galeria'} 
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {selectedComment.gallery_title}
                  </p>
                </div>
                
                <div className="w-2/3 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Autor</h3>
                    <p className="text-base">{selectedComment.author_name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data</h3>
                    <p className="text-base">
                      {new Date(selectedComment.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <Badge className={selectedComment.is_approved ? "bg-green-500" : "bg-amber-500"}>
                      {selectedComment.is_approved ? 'Aprovado' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Comentário</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {selectedComment.content}
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0 mt-4">
                {!selectedComment.is_approved ? (
                  <>
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Fechar
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApproveComment(selectedComment.id);
                        setIsViewDialogOpen(false);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        handleRejectComment(selectedComment.id);
                        setIsViewDialogOpen(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Fechar
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        handleRejectComment(selectedComment.id);
                        setIsViewDialogOpen(false);
                      }}
                    >
                      Excluir
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCommentsView;
