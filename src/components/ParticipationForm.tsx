
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(8, { message: 'Telefone inválido' }),
  testimony: z.string().optional(),
  joinRide: z.boolean().default(false),
  donationType: z.enum(['none', 'money', 'parts', 'both']).default('none'),
  parts: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ParticipationForm: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      testimony: '',
      joinRide: false,
      donationType: 'none',
      parts: '',
    },
  });
  
  const donationType = form.watch('donationType');

  const onSubmit = (data: FormValues) => {
    console.log('Form data:', data);
    // Aqui você poderia enviar os dados para uma API
    
    toast({
      title: 'Formulário enviado!',
      description: 'Obrigado por compartilhar seu interesse. Entraremos em contato em breve.',
      duration: 5000,
    });
    
    form.reset();
  };

  return (
    <section className="py-16 bg-white" id="participate">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Participe do Bike Night</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compartilhe sua experiência, inscreva-se para o próximo passeio ou contribua para nossa comunidade
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(92) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="testimony"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu testemunho (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Conte sua experiência com o Bike Night Amazonas..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Compartilhe conosco o que o Bike Night significa para você
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="joinRide"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Quero participar do próximo passeio</FormLabel>
                      <FormDescription>
                        Receba informações sobre o próximo evento
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="donationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gostaria de contribuir com o projeto?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Não, apenas quero participar</SelectItem>
                        <SelectItem value="money">Sim, com uma contribuição financeira</SelectItem>
                        <SelectItem value="parts">Sim, doando peças de bicicleta</SelectItem>
                        <SelectItem value="both">Sim, com dinheiro e peças</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Sua contribuição nos ajuda a manter o projeto funcionando
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {(donationType === 'parts' || donationType === 'both') && (
                <FormField
                  control={form.control}
                  name="parts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quais peças você gostaria de doar?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva as peças que você gostaria de doar..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Exemplo: câmaras de ar, pneus, freios, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-event-orange hover:bg-orange-600 text-white"
              >
                Enviar
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ParticipationForm;
