export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    material: string;
    color: string;
    inStock: number;
    category: string;
    isNew: boolean;
    isPopular: boolean;
    isPromotion: boolean;
    reviews: Review[];
  }
  
  export interface Review {
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
  }
  
  export interface CartItem {
    productId: string;
    quantity: number;
  }
  
  export interface Order {
    id: string;
    items: CartItem[];
    customerInfo: {
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
      isDifferentRecipient: boolean;
      recipientInfo?: {
        firstName: string;
        lastName: string;
        phone: string;
      };
    };
    delivery: {
      method: 'nova_poshta' | 'pickup';
      novaPoshtaOption?: 'branch' | 'postomat' | 'courier';
      novaPoshtaCity?: string;
      novaPoshtaBranch?: string;
      pickupLocation?: string;
      pickupContact?: string;
    };
    paymentMethod: 'cash' | 'card';
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    date: string;
  }
  
  export interface AdminUser {
    username: string;
    password: string;
  }