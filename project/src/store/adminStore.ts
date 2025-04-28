import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  image: string;
  stock: number;
  discount?: number;
  isDiscounted?: boolean;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscriptionDate: Date;
}

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  bounceRate: number;
}

interface AdminStore {
  products: Product[];
  subscribers: NewsletterSubscriber[];
  analytics: AnalyticsData;
  currentView: 'dashboard' | 'products' | 'customers' | 'analytics' | 'settings' | 'orders';
  setCurrentView: (view: 'dashboard' | 'products' | 'customers' | 'analytics' | 'settings' | 'orders') => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  updateStock: (id: number, quantity: number) => void;
  addSubscriber: (email: string) => void;
  removeSubscriber: (id: number) => void;
  updateAnalytics: (data: Partial<AnalyticsData>) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  products: [
    {
      id: 1,
      name: "Huile d'Olive AOP d'Aix-en-Provence",
      description: "Notre huile signature, fruitée et délicate.",
      price: 24.90,
      size: "500ml",
      image: "/products/huile-aop.png",
      stock: 50,
      isDiscounted: false
    },
    {
      id: 2,
      name: "Huile d'Olive Vierge Extra Bio",
      description: "Une huile biologique d'exception.",
      price: 27.90,
      size: "500ml",
      image: "/products/huile-noire.png",
      stock: 35,
      isDiscounted: true,
      discount: 10
    }
  ],
  subscribers: [
    { id: 1, email: "test@example.com", subscriptionDate: new Date() }
  ],
  analytics: {
    pageViews: 1250,
    uniqueVisitors: 850,
    averageTimeOnSite: 180,
    bounceRate: 45.5
  },
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: Math.max(...state.products.map(p => p.id)) + 1 }]
  })),
  updateProduct: (id, product) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...product } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  updateStock: (id, quantity) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, stock: quantity } : p)
  })),
  addSubscriber: (email) => set((state) => ({
    subscribers: [...state.subscribers, {
      id: Math.max(...state.subscribers.map(s => s.id)) + 1,
      email,
      subscriptionDate: new Date()
    }]
  })),
  removeSubscriber: (id) => set((state) => ({
    subscribers: state.subscribers.filter(s => s.id !== id)
  })),
  updateAnalytics: (data) => set((state) => ({
    analytics: { ...state.analytics, ...data }
  }))
}));