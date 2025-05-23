
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { GalleryItem } from '@/data/gallery';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Share2, Heart, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageModalProps {
  item?: GalleryItem;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  item, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false 
}) => {
  const { toast } = useToast();
  
  if (!item) return null;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      toast({
        title: "Link copiado",
        description: "O link foi copiado para a área de transferência",
      });
      
      try {
        navigator.clipboard.writeText(window.location.href);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black/90 border-gray-800">
        <div className="relative flex flex-col md:flex-row max-h-[80vh]">
          {/* Imagem Principal */}
          <div className="relative flex-1 min-h-[300px] md:min-h-0">
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <img 
                src={item.image} 
                alt={item.title}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
            
            {/* Botões de Navegação */}
            {hasPrevious && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            
            {hasNext && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
          </div>
          
          {/* Detalhes da Imagem */}
          <div className="w-full md:w-[320px] p-6 bg-white flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
            <DialogHeader className="pb-2 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-event-dark">{item.title}</h2>
            </DialogHeader>
            
            <div className="py-4 flex-1">
              <p className="text-gray-700 mb-4">{item.description}</p>
              
              {item.motivation && (
                <div className="bg-event-orange/10 p-4 rounded-lg border-l-4 border-event-orange mb-4">
                  <p className="text-gray-700 italic">&ldquo;{item.motivation}&rdquo;</p>
                </div>
              )}
              
              <div className="space-y-2 mt-4">
                {item.date && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2 h-5 w-5 text-event-blue" />
                    <span>{item.date}</span>
                  </div>
                )}
                
                {item.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2 h-5 w-5 text-event-orange" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex justify-between border-t border-gray-100 pt-3">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleShare}
                  className="h-9 w-9"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => toast({ title: "Favoritado", description: "Esta imagem foi adicionada aos seus favoritos." })}
                  className="h-9 w-9"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => toast({ title: "Download iniciado", description: "O download da imagem começará em breve." })}
                  className="h-9 w-9"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                className={cn("bg-event-green hover:bg-green-600")}
                onClick={onClose}
              >
                Fechar
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
