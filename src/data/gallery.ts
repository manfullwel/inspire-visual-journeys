
// This file provides the type definition for gallery items
// We now fetch data from Supabase

export interface GalleryItem {
  id: number | string;  // Support both number from old data and UUID from Supabase
  image: string;
  title: string;
  description: string;
  motivation: string;
  created_at?: string;
}

// This is now just for fallback purposes if Supabase fails
export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: "/lovable-uploads/964ed381-d76b-4e70-9b4d-5d693e16b745.png",
    title: "Bike Night Amazonas",
    description: "Grupo de ciclistas explorando o centro histórico de Manaus em um passeio noturno cheio de energia.",
    motivation: "Pedalando juntos para descobrir um novo olhar sobre a cidade e promover um estilo de vida saudável e sustentável."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    title: "Encontro na Praça da Saudade",
    description: "Dezenas de ciclistas se reunindo para o início do passeio noturno de 10km.",
    motivation: "A comunidade se fortalece quando compartilhamos nossas paixões e experiências."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1501147830916-ce44a6359892",
    title: "Rota Iluminada",
    description: "Grupo atravessando as ruas iluminadas do centro de Manaus, criando um espetáculo visual único.",
    motivation: "As luzes da cidade ganham novo significado quando vistas de uma perspectiva diferente."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1519583272095-6433daf26b6e",
    title: "Pausa para Fotos",
    description: "Momento de descontração e registros fotográficos em um dos pontos mais emblemáticos do trajeto.",
    motivation: "Cada parada é uma oportunidade de fortalecer laços e criar memórias duradouras."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1541625810516-44f1ce894bcd",
    title: "Primeira Pedalada de Carlos",
    description: "Carlos completou sua primeira Bike Night aos 52 anos, inspirando muitos iniciantes.",
    motivation: "Nunca é tarde para começar uma nova jornada e se juntar a uma comunidade acolhedora."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
    title: "Final do Trajeto",
    description: "Celebração ao fim dos 10km de percurso, com música e confraternização entre todos os participantes.",
    motivation: "A verdadeira jornada não é sobre a distância percorrida, mas sobre as conexões que fazemos no caminho."
  }
];
