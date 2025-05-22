
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import AccessDenied from './AccessDenied';

interface SystemStats {
  id: string;
  stat_date: string;
  visits: number;
  signups: number;
  content_created: number;
}

const AdminStatsView: React.FC = () => {
  const [stats, setStats] = useState<SystemStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('system_stats')
          .select('*')
          .order('stat_date', { ascending: false })
          .limit(10);
        
        if (error) {
          throw error;
        }
        
        setStats(data || []);
      } catch (error: any) {
        setError(error.message || 'Erro ao carregar estatísticas');
      } finally {
        setLoading(false);
      }
    };
    
    if (isSuperAdmin) {
      fetchStats();
    }
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return <AccessDenied />;
  }

  const formatChartData = (data: SystemStats[]) => {
    return [...data].reverse().map(item => ({
      date: new Date(item.stat_date).toLocaleDateString('pt-BR'),
      Visitas: item.visits,
      'Novos Cadastros': item.signups,
      'Conteúdo Criado': item.content_created
    }));
  };
  
  const totalVisits = stats.reduce((sum, stat) => sum + stat.visits, 0);
  const totalSignups = stats.reduce((sum, stat) => sum + stat.signups, 0);
  const totalContent = stats.reduce((sum, stat) => sum + stat.content_created, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-event-dark mb-6">
        Estatísticas do Sistema
      </h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center py-12">Carregando estatísticas...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total de Visitas</CardTitle>
                <CardDescription>Últimos 10 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-event-blue">{totalVisits}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Novos Cadastros</CardTitle>
                <CardDescription>Últimos 10 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-event-orange">{totalSignups}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Conteúdo Criado</CardTitle>
                <CardDescription>Últimos 10 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-event-green">{totalContent}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Últimos 10 dias
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formatChartData(stats)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Visitas" fill="#3b82f6" />
                    <Bar dataKey="Novos Cadastros" fill="#f97316" />
                    <Bar dataKey="Conteúdo Criado" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminStatsView;
