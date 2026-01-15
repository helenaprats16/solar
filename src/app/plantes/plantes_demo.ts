import { Planta } from './planta'; //Ajusta la ruta según tu proyecto

export const PLANTES_DEMO: Planta[] = [
  {
    id: 1,
    created_at: 1735579200000, // 31 diciembre 2024
    nom: 'Central Solar Barcelona',
    ubicacio: { latitude: 41.3879, longitude: 2.1699 },
    capacitat: 150,
    user: 'admin@energia.cat',
    foto: 'image.jpeg',
  },
  {
    id: 2,
    created_at: 1735482800000, // 30 diciembre 2024
    nom: 'Parc Eòlic Girona',
    ubicacio: { latitude: 41.9818, longitude: 2.8237 },
    capacitat: 85,
    user: 'tecnic@energia.cat',
    foto: 'image2.webp',
  },
  {
    id: 3,
    created_at: 1735386400000, // 29 diciembre 2024
    nom: 'Planta Tarragona',
    ubicacio: { latitude: 41.1189, longitude: 1.2445 },
    capacitat: 200,
    user: 'gestor@energia.cat',
    foto: 'image3.webp',
  },
  {
    id: 4,
    created_at: 1735290000000, // 28 diciembre 2024
    nom: 'Solar Lleida',
    ubicacio: { latitude: 41.6142, longitude: 0.6258 },
    capacitat: 120,
    user: 'admin@energia.cat',
    foto: 'image4.jpg',
  },
  {
    id: 5,
    created_at: 1735193600000, // 27 diciembre 2024
    nom: 'Eòlica Costa Brava',
    ubicacio: { latitude: 41.7, longitude: 2.85 },
    capacitat: 95,
    user: 'tecnic@energia.cat',
    foto: '',
  },
  {
    id: 6,
    created_at: 1735097200000, // 26 diciembre 2024
    nom: 'Central Delta Ebre',
    ubicacio: { latitude: 40.7167, longitude: 0.8667 },
    capacitat: 180,
    user: 'gestor@energia.cat',
    foto: '',
  },
  {
    id: 7,
    created_at: 1735000800000, // 25 diciembre 2024
    nom: 'Solar Pirineu',
    ubicacio: { latitude: 42.5, longitude: 1.5167 },
    capacitat: 75,
    user: 'admin@energia.cat',
    foto: '',
  },
  {
    id: 8,
    created_at: 1734904400000, // 24 diciembre 2024
    nom: 'Planta Montseny',
    ubicacio: { latitude: 41.7667, longitude: 2.4 },
    capacitat: 110,
    user: 'tecnic@energia.cat',
    foto: '',
  },
  {
    id: 9,
    created_at: 1734808000000, // 23 diciembre 2024
    nom: 'Central Costa Daurada',
    ubicacio: { latitude: 41.0833, longitude: 1.1333 },
    capacitat: 160,
    user: 'gestor@energia.cat',
    foto: '',
  },
  {
    id: 10,
    created_at: 1734711600000, // 22 diciembre 2024
    nom: 'Eòlica Terres Ebre',
    ubicacio: { latitude: 40.8106, longitude: 0.5206 },
    capacitat: 130,
    user: 'admin@energia.cat',
    foto: '',
  },
  
];
