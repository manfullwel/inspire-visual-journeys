
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { GalleryItem } from '@/data/gallery';
import { Button } from '@/components/ui/button';

interface ImageModalProps {
  item?: GalleryItem;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ item, isOpen, onClose }) => {
  if (!item) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-event-dark">
            {item.title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 overflow-hidden rounded-lg">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-auto object-cover"
          />
        </div>

        <DialogDescription className="pt-4">
          <div className="text-base text-gray-700">{item.description}</div>
          
          <div className="mt-4 bg-event-orange/10 p-4 rounded-lg border-l-4 border-event-orange">
            <h4 className="font-bold text-event-dark mb-2">Motivação:</h4>
            <p className="text-gray-700 italic">&ldquo;{item.motivation}&rdquo;</p>
          </div>
        </DialogDescription>

        <DialogFooter>
          <Button 
            className="w-full sm:w-auto bg-event-green hover:bg-green-600" 
            onClick={onClose}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
