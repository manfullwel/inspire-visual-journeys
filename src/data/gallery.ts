
// This file provides the type definition and local data for gallery items
// When fetching from Supabase, we'll convert the response to match this interface

export interface GalleryItem {
  id: number;
  image: string;
  title: string;
  description: string;
  motivation: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182",
    title: "Subida da Montanha Verde",
    description: "Grupo superando a difícil subida da Montanha Verde após 3 horas de pedalada intensa.",
    motivation: "Superando limites físicos e mentais juntos, provando que a união faz a força!"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    title: "Primeira Pedalada de Maria",
    description: "Maria completou seu primeiro trajeto de 30km após recuperação de um acidente.",
    motivation: "A resiliência é o combustível que nos move além das nossas limitações."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1501147830916-ce44a6359892",
    title: "Equipe Superação no Pico do Horizonte",
    description: "Após 6 meses de treinamento, todos os 12 membros da equipe atingiram o Pico do Horizonte.",
    motivation: "Planejamento, dedicação e persistência transformam sonhos em conquistas."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1519583272095-6433daf26b6e",
    title: "Amanhecer na Trilha das Águias",
    description: "Pedalada ao amanhecer após acampamento noturno na trilha mais difícil da região.",
    motivation: "As maiores recompensas vêm depois dos maiores desafios."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1541625810516-44f1ce894bcd",
    title: "Pedro e sua Primeira Maratona de Mountain Bike",
    description: "Aos 58 anos, Pedro completou seus primeiros 80km em terreno acidentado.",
    motivation: "Nunca é tarde para começar uma nova jornada e superar seus próprios limites."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
    title: "Travessia do Vale das Nuvens",
    description: "Grupo percorreu 120km em dois dias, atravessando o lendário Vale das Nuvens.",
    motivation: "A verdadeira jornada não é sobre a distância, mas sobre as transformações no caminho."
  }
];
