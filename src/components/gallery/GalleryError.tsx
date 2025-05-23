
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryErrorProps {
  error: string;
  onRetry: () => void;
}

const GalleryError: React.FC<GalleryErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          onClick={onRetry}
          className="px-4 py-2 bg-event-orange text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
};

export default GalleryError;
