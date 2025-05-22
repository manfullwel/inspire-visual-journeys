
// Importando a biblioteca de toast do shadcn/ui
import { useToast as useToastShadcn, toast as toastShadcn } from "@/components/ui/toast";

// Re-exportando para uso em toda a aplicação
export const useToast = useToastShadcn;
export const toast = toastShadcn;
