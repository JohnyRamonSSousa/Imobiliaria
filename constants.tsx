
import { Property, Consultant } from './types';

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Mansão Contemporânea Alpha',
    type: 'Casa',
    listingType: 'venda',
    price: 4500000,
    location: { state: 'SP', city: 'Barueri', neighborhood: 'Alphaville' },
    size: 450,
    bedrooms: 5,
    bathrooms: 6,
    garage: 4,
    description: 'Uma obra-prima da arquitetura moderna, com acabamentos em mármore e sistema de automação completo.',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60'],
    featured: true
  },
  {
    id: '2',
    title: 'Apartamento Vista Mar',
    type: 'Apartamento',
    listingType: 'venda',
    price: 2800000,
    location: { state: 'RJ', city: 'Rio de Janeiro', neighborhood: 'Ipanema' },
    size: 180,
    bedrooms: 3,
    bathrooms: 4,
    garage: 2,
    description: 'Vista panorâmica para o mar de Ipanema, totalmente reformado com design minimalista.',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60'],
    featured: true
  },
  {
    id: 'r1',
    title: 'Loft Moderno Vila Olímpia',
    type: 'Apartamento',
    listingType: 'aluguel',
    price: 8500,
    location: { state: 'SP', city: 'São Paulo', neighborhood: 'Vila Olímpia' },
    size: 65,
    bedrooms: 1,
    bathrooms: 1,
    garage: 1,
    description: 'Totalmente mobiliado e decorado, pronto para morar. Localização privilegiada próxima a centros empresariais.',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=60'],
    featured: true
  },
  {
    id: 'r2',
    title: 'Casa em Condomínio Fechado',
    type: 'Casa',
    listingType: 'aluguel',
    price: 15000,
    location: { state: 'SP', city: 'Campinas', neighborhood: 'Gramado' },
    size: 300,
    bedrooms: 4,
    bathrooms: 5,
    garage: 3,
    description: 'Ampla casa com piscina e área gourmet em condomínio com segurança 24h.',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=60']
  },
  {
    id: 'r3',
    title: 'Studio Design Batel',
    type: 'Apartamento',
    listingType: 'aluguel',
    price: 4200,
    location: { state: 'PR', city: 'Curitiba', neighborhood: 'Batel' },
    size: 45,
    bedrooms: 1,
    bathrooms: 1,
    garage: 1,
    description: 'Studio compacto e funcional no bairro mais charmoso de Curitiba.',
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=60']
  },
  {
    id: '3',
    title: 'Cobertura Duplex Garden',
    type: 'Cobertura',
    listingType: 'venda',
    price: 3200000,
    location: { state: 'PR', city: 'Curitiba', neighborhood: 'Batel' },
    size: 320,
    bedrooms: 4,
    bathrooms: 5,
    garage: 3,
    description: 'Amplo espaço gourmet privativo com piscina e deck de madeira, localizado no coração do Batel.',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=60'],
    featured: true
  },
  {
    id: '4',
    title: 'Casa de Campo Toscana',
    type: 'Casa',
    listingType: 'venda',
    price: 1500000,
    location: { state: 'MG', city: 'Nova Lima', neighborhood: 'Vale do Sereno' },
    size: 600,
    bedrooms: 4,
    bathrooms: 4,
    garage: 6,
    description: 'Estilo rústico elegante com adega subterrânea e pomar produzindo.',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=60']
  },
  {
    id: 'c-1',
    title: 'Chácara Recanto dos Sonhos',
    type: 'Chácara',
    listingType: 'venda',
    price: 850000,
    location: { state: 'SP', city: 'Atibaia', neighborhood: 'Laranjal' },
    size: 5000,
    bedrooms: 3,
    bathrooms: 2,
    garage: 10,
    description: 'Lindo refúgio em Atibaia com pomar formado, piscina e área gourmet completa para lazer em família.',
    images: ['https://images.unsplash.com/photo-1592591544551-49a05b630713?auto=format&fit=crop&w=800&q=60']
  },
  {
    id: 'r-t1',
    title: 'Terreno Comercial Centro',
    type: 'Terreno',
    listingType: 'aluguel',
    price: 3500,
    location: { state: 'SP', city: 'São Paulo', neighborhood: 'Centro' },
    size: 500,
    bedrooms: 0,
    bathrooms: 0,
    garage: 0,
    description: 'Terreno plano excelente para estacionamento ou comércio, localização estratégica.',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=60']
  },
  {
    id: 'r-sit1',
    title: 'Sítio Recanto Verde',
    type: 'Chácara',
    listingType: 'aluguel',
    price: 12000,
    location: { state: 'SP', city: 'Mairiporã', neighborhood: 'Serra' },
    size: 10000,
    bedrooms: 5,
    bathrooms: 4,
    garage: 10,
    description: 'Sítio completo para temporadas ou eventos, com lago, piscina e campo de futebol.',
    images: ['https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=800&q=60']
  },
  {
    id: 't-2',
    title: 'Terreno Alpha Residencial',
    type: 'Terreno',
    listingType: 'venda',
    price: 1200000,
    location: { state: 'SP', city: 'Barueri', neighborhood: 'Alphaville' },
    size: 600,
    bedrooms: 0,
    bathrooms: 0,
    garage: 0,
    description: 'Terreno totalmente plano em um dos condomínios mais luxuosos de Alphaville.',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=60']
  },
  {
    id: 'c-2',
    title: 'Chácara Vila Real',
    type: 'Chácara',
    listingType: 'venda',
    price: 2100000,
    location: { state: 'SP', city: 'Itu', neighborhood: 'Vila Real' },
    size: 3000,
    bedrooms: 4,
    bathrooms: 5,
    garage: 6,
    description: 'Luxuosa chácara em Itu com acabamento de alto padrão e lazer completo.',
    images: ['https://images.unsplash.com/photo-1592591544551-49a05b630713?auto=format&fit=crop&w=800&q=60']
  }
];

export const CONSULTANTS: Consultant[] = [
  {
    id: 'c1',
    name: 'Roberto Silva',
    role: 'Especialista em Mansões',
    region: 'Alphaville & Tamboré',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    phone: '5511999999999'
  },
  {
    id: 'c2',
    name: 'Ana Martins',
    role: 'Consultora de Luxo',
    region: 'Ipanema & Leblon',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    phone: '5521988888888'
  },
  {
    id: 'c3',
    name: 'Carlos Mendes',
    role: 'Especialista em Investimentos',
    region: 'Curitiba Central',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    phone: '5541977777777'
  }
];

export const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const CITIES_BY_STATE: Record<string, string[]> = {
  'SP': ['São Paulo', 'Barueri', 'Campinas'],
  'RJ': ['Rio de Janeiro', 'Niterói', 'Búzios'],
  'PR': ['Curitiba', 'Londrina', 'Maringá'],
  'MG': ['Belo Horizonte', 'Nova Lima', 'Uberlândia'],
  'SC': ['Florianópolis', 'Balneário Camboriú', 'Joinville']
};
