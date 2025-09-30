import { Product, CartItem, Order, AdminUser } from './types';
import { mockProducts } from './mockData';

export interface SocialMedia {
  id: string;
  name: string;
  url: string;
}

interface StoreData {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  admin: AdminUser;
  socialMedia: SocialMedia[];
}

class Store {
  private storageKey = '3d-keychain-store';

  // Get data from localStorage
  private getData(): StoreData {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {
      products: mockProducts,
      cart: [],
      orders: [],
      admin: { username: 'PrintVerse2025', password: 'Sviderskyi100' },
      socialMedia: [
        { id: '1', name: 'Facebook', url: 'https://facebook.com/printverse' },
        { id: '2', name: 'Instagram', url: 'https://instagram.com/printverse' },
        { id: '3', name: 'Telegram', url: 'https://t.me/printverse' }
      ]
    };
  }

  // Save data to localStorage
  private saveData(data: StoreData) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Products
  getProducts(): Product[] {
    return this.getData().products;
  }

  getProduct(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  addProduct(product: Product) {
    const data = this.getData();
    data.products.push(product);
    this.saveData(data);
  }

  updateProduct(id: string, product: Product) {
    const data = this.getData();
    const index = data.products.findIndex((p: Product) => p.id === id);
    if (index !== -1) {
      data.products[index] = product;
      this.saveData(data);
    }
  }

  deleteProduct(id: string) {
    const data = this.getData();
    data.products = data.products.filter((p: Product) => p.id !== id);
    this.saveData(data);
  }

  // Cart
  getCart(): CartItem[] {
    return this.getData().cart;
  }

  addToCart(productId: string, quantity: number = 1) {
    const data = this.getData();
    const existingItem = data.cart.find((item: CartItem) => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      data.cart.push({ productId, quantity });
    }
    
    this.saveData(data);
  }

  updateCartItem(productId: string, quantity: number) {
    const data = this.getData();
    const item = data.cart.find((item: CartItem) => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        data.cart = data.cart.filter((item: CartItem) => item.productId !== productId);
      } else {
        item.quantity = quantity;
      }
      this.saveData(data);
    }
  }

  removeFromCart(productId: string) {
    const data = this.getData();
    data.cart = data.cart.filter((item: CartItem) => item.productId !== productId);
    this.saveData(data);
  }

  clearCart() {
    const data = this.getData();
    data.cart = [];
    this.saveData(data);
  }

  // Orders
  getOrders(): Order[] {
    return this.getData().orders;
  }

  addOrder(order: Order) {
    const data = this.getData();
    data.orders.push(order);
    this.saveData(data);
  }

  updateOrderStatus(orderId: string, status: Order['status']) {
    const data = this.getData();
    const order = data.orders.find((o: Order) => o.id === orderId);
    if (order) {
      order.status = status;
      this.saveData(data);
    }
  }

  // Admin
  getAdmin(): AdminUser {
    return this.getData().admin;
  }

  validateAdmin(username: string, password: string): boolean {
    const admin = this.getAdmin();
    return admin.username === username && admin.password === password;
  }

  // Update admin credentials (for migration)
  updateAdminCredentials() {
    const data = this.getData();
    data.admin = { username: 'PrintVerse2025', password: 'Sviderskyi100' };
    this.saveData(data);
  }

  // Statistics
  getStatistics() {
    const data = this.getData();
    const orders = data.orders;
    const products = data.products;
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const pendingOrders = orders.filter((order: Order) => order.status === 'pending').length;
    const totalProducts = products.length;
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalProducts
    };
  }

  // Social Media
  getSocialMedia(): SocialMedia[] {
    return this.getData().socialMedia || [];
  }

  addSocialMedia(socialMedia: Omit<SocialMedia, 'id'>) {
    const data = this.getData();
    const newSocialMedia: SocialMedia = {
      ...socialMedia,
      id: Date.now().toString()
    };
    data.socialMedia.push(newSocialMedia);
    this.saveData(data);
  }

  updateSocialMedia(id: string, socialMedia: Omit<SocialMedia, 'id'>) {
    const data = this.getData();
    const index = data.socialMedia.findIndex(sm => sm.id === id);
    if (index !== -1) {
      data.socialMedia[index] = { ...socialMedia, id };
      this.saveData(data);
    }
  }

  deleteSocialMedia(id: string) {
    const data = this.getData();
    data.socialMedia = data.socialMedia.filter(sm => sm.id !== id);
    this.saveData(data);
  }
}

export const store = new Store();