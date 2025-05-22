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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AccessDenied from './AccessDenied';
import { Json } from '@/integrations/supabase/types';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity: string;
  entity_id?: string;
  details: any;
  ip_address?: string;
  created_at: string;
  user_email?: string;
}

interface UserData {
  id: string;
  email: string;
  last_sign_in_at?: string;
}

const AdminAuditView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const { isSuperAdmin } = useAuth();
  
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let query = supabase
          .from('audit_logs')
          .select('*', { count: 'exact' })
          .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
          .order('created_at', { ascending: false });
        
        if (search) {
          query = query.or(`entity_id.ilike.%${search}%,details.ilike.%${search}%`);
        }
        
        if (actionFilter) {
          query = query.eq('action', actionFilter);
        }
        
        if (entityFilter) {
          query = query.eq('entity', entityFilter);
        }
        
        const { data, error, count } = await query;
        
        if (error) {
          throw error;
        }
        
        // Get user emails for each audit log
        const userIds = Array.from(new Set(data?.map(log => log.user_id) || []));
        const userEmails: Record<string, string> = {};
        
        // Get user emails using RPC function
        for (const userId of userIds) {
          const { data: userData, error: userError } = await supabase
            .rpc('get_user_by_id', { user_id: userId });
          
          if (userError) {
            console.error('Error fetching user:', userError);
            continue;
          }
          
          // Fix: Properly handle the JSON data from the RPC function
          if (userData) {
            // Cast to any first to access the JSON properties safely
            const jsonData = userData as any;
            if (jsonData.email) {
              userEmails[userId] = jsonData.email;
            } else {
              userEmails[userId] = userId; // Fallback to user ID if email not available
            }
          }
        }
        
        // Merge the user emails into the audit logs
        const formattedData = data?.map(log => ({
          ...log,
          user_email: userEmails[log.user_id] || log.user_id
        })) || [];
        
        setLogs(formattedData);
        
        if (count !== null) {
          setTotalPages(Math.ceil(count / PAGE_SIZE));
        }
      } catch (error: any) {
        setError(error.message || 'Erro ao carregar logs de auditoria');
      } finally {
        setLoading(false);
      }
    };
    
    if (isSuperAdmin) {
      fetchLogs();
    }
  }, [isSuperAdmin, page, search, actionFilter, entityFilter]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const handleClearFilters = () => {
    setSearch('');
    setActionFilter('');
    setEntityFilter('');
    setPage(1);
  };

  if (!isSuperAdmin) {
    return <AccessDenied />;
  }
  
  const getBadgeColor = (action: string) => {
    switch (action) {
      case 'insert':
        return 'bg-green-500';
      case 'update':
        return 'bg-blue-500';
      case 'delete':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-event-dark mb-6">
        Logs de Auditoria
      </h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex">
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-r-none"
            />
            <Button 
              type="submit" 
              variant="secondary" 
              className="rounded-l-none"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas ações</SelectItem>
              <SelectItem value="insert">Inserção</SelectItem>
              <SelectItem value="update">Atualização</SelectItem>
              <SelectItem value="delete">Exclusão</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por entidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas entidades</SelectItem>
              <SelectItem value="gallery_items">Galeria</SelectItem>
              <SelectItem value="admin_profiles">Perfis de Admin</SelectItem>
              <SelectItem value="comments">Comentários</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClearFilters}
          >
            Limpar Filtros
          </Button>
        </form>
        
        {loading ? (
          <div className="text-center py-12">Carregando logs...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>{log.user_email}</TableCell>
                    <TableCell>
                      <Badge className={getBadgeColor(log.action)}>
                        {log.action === 'insert' && 'Inserção'}
                        {log.action === 'update' && 'Atualização'}
                        {log.action === 'delete' && 'Exclusão'}
                        {!['insert', 'update', 'delete'].includes(log.action) && log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.entity === 'gallery_items' && 'Galeria'}
                      {log.entity === 'admin_profiles' && 'Perfis de Admin'}
                      {log.entity === 'comments' && 'Comentários'}
                      {!['gallery_items', 'admin_profiles', 'comments'].includes(log.entity) && log.entity}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.ip_address || 'N/A'}</TableCell>
                  </TableRow>
                ))}
                
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum log encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAuditView;
