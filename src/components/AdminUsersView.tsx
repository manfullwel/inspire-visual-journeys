
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, UserPlus, User, Users, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AccessDenied from './AccessDenied';

interface UserProfile {
  id: string;
  email: string;
  last_sign_in_at: string;
  is_admin: boolean;
  role: string | null;
}

const AdminUsersView: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [adminRole, setAdminRole] = useState<'content_admin' | 'super_admin'>('content_admin');
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get admin profiles first
        const { data: adminData, error: adminError } = await supabase
          .from('admin_profiles')
          .select('id, role');
        
        if (adminError) throw adminError;
        
        // Get users using a server function instead of direct query to auth.users
        const { data: usersData, error: usersError } = await supabase
          .rpc('get_all_users');
        
        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw new Error('Falha ao carregar usuários. Por favor, verifique se a função RPC "get_all_users" está criada.');
        }
        
        if (!usersData || !Array.isArray(usersData)) {
          throw new Error('Dados de usuários não disponíveis');
        }
        
        // Merge the data
        const mergedData = usersData.map((user: any) => {
          const adminProfile = adminData?.find(admin => admin.id === user.id);
          return {
            ...user,
            is_admin: !!adminProfile,
            role: adminProfile?.role || null
          };
        });
        
        setUsers(mergedData);
      } catch (error: any) {
        console.error('Error in fetchUsers:', error);
        setError(error.message || 'Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };
    
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  const handleAddAdmin = async () => {
    try {
      // Validate email
      if (!emailInput || !emailInput.includes('@')) {
        toast({
          title: 'Email inválido',
          description: 'Por favor, informe um email válido',
          variant: 'destructive'
        });
        return;
      }
      
      // Use RPC function to get user by email
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_by_email', { user_email: emailInput });
      
      if (userError || !userData) {
        toast({
          title: 'Usuário não encontrado',
          description: 'Não foi possível encontrar um usuário com este email',
          variant: 'destructive'
        });
        return;
      }
      
      // Add admin profile
      const { error: adminError } = await supabase
        .from('admin_profiles')
        .insert({
          id: userData.id,
          role: adminRole
        });
      
      if (adminError) {
        // Check if it's a duplicate error
        if (adminError.code === '23505') {
          // Unique constraint error (user is already an admin)
          toast({
            title: 'Usuário já é um administrador',
            description: 'Este usuário já possui permissões de administrador'
          });
        } else {
          throw adminError;
        }
      } else {
        toast({
          title: 'Administrador adicionado',
          description: `O usuário ${emailInput} agora tem permissões de ${adminRole === 'super_admin' ? 'Super Admin' : 'Content Admin'}`
        });
        
        // Refresh users list
        window.location.reload();
      }
      
      setIsDialogOpen(false);
      setEmailInput('');
      setAdminRole('content_admin');
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar administrador',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('admin_profiles')
        .update({
          role: adminRole
        })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      toast({
        title: 'Permissão atualizada',
        description: `O usuário ${selectedUser.email} agora tem permissões de ${adminRole === 'super_admin' ? 'Super Admin' : 'Content Admin'}`
      });
      
      // Refresh users list
      window.location.reload();
      
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar permissão',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleRemoveAdmin = async (userId: string, email: string) => {
    const confirmed = window.confirm(`Remover permissões de administrador de ${email}?`);
    
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('admin_profiles')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        
        toast({
          title: 'Permissão removida',
          description: `As permissões de administrador foram removidas de ${email}`
        });
        
        // Refresh users list
        window.location.reload();
      } catch (error: any) {
        toast({
          title: 'Erro ao remover permissão',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  };

  const openRoleDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setAdminRole(user.role as 'content_admin' | 'super_admin' || 'content_admin');
    setIsRoleDialogOpen(true);
  };

  if (!isSuperAdmin) {
    return <AccessDenied />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-event-dark mb-6">
        Gerenciar Usuários
      </h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-event-dark" />
          <h2 className="text-xl font-semibold">Administradores do Sistema</h2>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-event-green hover:bg-green-600"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Administrador
        </Button>
      </div>
      
      <Card>
        {loading ? (
          <div className="text-center py-12">Carregando usuários...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.filter(user => user.is_admin).map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    <Badge className={user.role === 'super_admin' ? 'bg-purple-600' : 'bg-blue-500'}>
                      {user.role === 'super_admin' ? 'Super Admin' : 'Content Admin'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline" 
                      size="sm"
                      className="mr-2"
                      onClick={() => openRoleDialog(user)}
                    >
                      <Shield className="h-3.5 w-3.5 mr-1" />
                      Alterar Permissão
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleRemoveAdmin(user.id, user.email)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {users.filter(user => user.is_admin).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum administrador encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
      
      {/* Add Admin Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Administrador</DialogTitle>
            <DialogDescription>
              Adicione um novo usuário como administrador do sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email do Usuário
              </label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@exemplo.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                O usuário já deve ter uma conta no sistema.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tipo de Permissão
              </label>
              <Select value={adminRole} onValueChange={(value) => setAdminRole(value as 'content_admin' | 'super_admin')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a permissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content_admin">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Content Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="super_admin">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Super Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-2">
                {adminRole === 'content_admin' ? (
                  <p className="text-sm text-gray-500">
                    Permissão para gerenciar conteúdo e comentários.
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Acesso total ao sistema, incluindo estatísticas e gerenciamento de usuários.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddAdmin}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Permissão</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>Alterar permissão para <strong>{selectedUser.email}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tipo de Permissão
              </label>
              <Select value={adminRole} onValueChange={(value) => setAdminRole(value as 'content_admin' | 'super_admin')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a permissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content_admin">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Content Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="super_admin">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Super Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-2">
                {adminRole === 'content_admin' ? (
                  <p className="text-sm text-gray-500">
                    Permissão para gerenciar conteúdo e comentários.
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Acesso total ao sistema, incluindo estatísticas e gerenciamento de usuários.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangeRole}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersView;
