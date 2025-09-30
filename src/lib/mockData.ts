import { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Брелок "Дракон"',
    description: 'Детально проработаний брелок у формі дракона. Надрукований з високоякісного PLA пластику.',
    price: 150,
    images: ['/api/placeholder/300/300'],
    material: 'PLA',
    color: 'Червоний',
    inStock: 25,
    category: 'fantasy',
    isNew: true,
    isPopular: true,
    isPromotion: false,
    reviews: [
      {
        id: '1',
        customerName: 'Олександр',
        rating: 5,
        comment: 'Чудовий брелок, дуже якісно зроблений!',
        date: '2024-01-15'
      }
    ]
  },
  {
    id: '2',
    name: 'Брелок "Серце"',
    description: 'Романтичний брелок у формі серця. Ідеальний подарунок для коханої людини.',
    price: 100,
    images: ['/api/placeholder/300/300'],
    material: 'PETG',
    color: 'Рожевий',
    inStock: 40,
    category: 'romantic',
    isNew: false,
    isPopular: true,
    isPromotion: true,
    reviews: []
  },
  {
    id: '3',
    name: 'Брелок "Автомобіль"',
    description: 'Стильний брелок у формі спортивного автомобіля. Для справжніх автолюбителів.',
    price: 120,
    images: ['/api/placeholder/300/300'],
    material: 'ABS',
    color: 'Синій',
    inStock: 15,
    category: 'automotive',
    isNew: true,
    isPopular: false,
    isPromotion: false,
    reviews: [
      {
        id: '2',
        customerName: 'Марія',
        rating: 4,
        comment: 'Гарний брелок, але трохи великий.',
        date: '2024-01-10'
      }
    ]
  },
  {
    id: '4',
    name: 'Брелок "Зірка"',
    description: 'Яскравий брелок у формі зірки з LED підсвіткою.',
    price: 200,
    images: ['/api/placeholder/300/300'],
    material: 'PLA',
    color: 'Жовтий',
    inStock: 30,
    category: 'led',
    isNew: false,
    isPopular: true,
    isPromotion: true,
    reviews: []
  },
  {
    id: '5',
    name: 'Брелок "Котик"',
    description: 'Милий брелок у формі котика. Ідеальний для любителів тварин.',
    price: 90,
    images: ['/api/placeholder/300/300'],
    material: 'PLA',
    color: 'Білий',
    inStock: 50,
    category: 'animals',
    isNew: false,
    isPopular: true,
    isPromotion: false,
    reviews: [
      {
        id: '3',
        customerName: 'Анна',
        rating: 5,
        comment: 'Дуже милий котик, дочка в захваті!',
        date: '2024-01-12'
      }
    ]
  },
  {
    id: '6',
    name: 'Брелок "Логотип"',
    description: 'Персоналізований брелок з вашим логотипом або ініціалами.',
    price: 180,
    images: ['/api/placeholder/300/300'],
    material: 'PETG',
    color: 'Чорний',
    inStock: 20,
    category: 'custom',
    isNew: true,
    isPopular: false,
    isPromotion: false,
    reviews: []
  }
];

export const materials = ['PLA', 'ABS', 'PETG', 'TPU'];
export const colors = ['Червоний', 'Синій', 'Зелений', 'Жовтий', 'Білий', 'Чорний', 'Рожевий', 'Фіолетовий'];
export const categories = ['fantasy', 'romantic', 'automotive', 'led', 'animals', 'custom'];