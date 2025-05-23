
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface GalleryHeaderProps {
  viewMode: 'grid' | 'carousel';
  setViewMode: (mode: 'grid' | 'carousel') => void;
  refreshing: boolean;
  loading: boolean;
  onRefresh: () => void;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({ 
  viewMode, 
  setViewMode, 
  refreshing, 
  loading, 
  onRefresh 
}) => {
  return (
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
            onClick={onRefresh}
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
  );
};

export default GalleryHeader;
