import { Property } from '../types';

export interface Transaction {
  id: string;
  type: 'sale' | 'rent';
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyImage: string;
  userId: string; // For now we'll just use 'logged-user' or email if we had it
  userEmail: string;
  userName: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  value: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  totalRentals: number;
  activeUsers: number;
}

const STORAGE_KEY = 'lxw_transactions_v2';

const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const db = {
  checkPermission: (email: string): 'MASTER' | 'USER' => {
    return email === 'master@je.com' ? 'MASTER' : 'USER';
  },

  saveTransaction: (
    property: Property,
    type: 'sale' | 'rent',
    userData: { name: string; email: string },
    status: 'pending' | 'completed' = 'completed'
  ) => {
    const transactions = getTransactions();
    const newTransaction: Transaction = {
      id: generateId(),
      type,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyPrice: property.price,
      propertyImage: property.images[0],
      userId: userData.email,
      userEmail: userData.email,
      userName: userData.name,
      date: new Date().toISOString(),
      status: status,
      value: type === 'sale' ? property.price : property.price
    };

    transactions.unshift(newTransaction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return newTransaction;
  },

  updateTransactionStatus: (id: string, status: 'completed' | 'cancelled') => {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      return true;
    }
    return false;
  },

  getAllTransactions: (): Transaction[] => {
    return getTransactions();
  },

  getUserTransactions: (email: string): Transaction[] => {
    return getTransactions().filter(t => t.userEmail === email);
  },

  deleteUserTransactions: (email: string): void => {
    const transactions = getTransactions().filter(t => t.userEmail !== email);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },

  getSoldPropertyIds: (): string[] => {
    return getTransactions()
      .filter(t => t.status === 'completed')
      .map(t => t.propertyId);
  },

  getStats: (): DashboardStats => {
    const txs = getTransactions();
    return {
      totalRevenue: txs.reduce((acc, curr) => acc + curr.value, 0),
      totalSales: txs.filter(t => t.type === 'sale').length,
      totalRentals: txs.filter(t => t.type === 'rent').length,
      activeUsers: new Set(txs.map(t => t.userEmail)).size
    };
  }
};
