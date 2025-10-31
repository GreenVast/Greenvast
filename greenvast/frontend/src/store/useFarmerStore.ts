import { create } from 'zustand';

interface Farmer {
  name: string;
  phone: string;
  county: string;
  language: string;
  farmingType: string;
  email: string;
}

interface Loan {
  id: string;
  amount: number;
  repaid: number;
  createdAt: string;
}

interface FarmerStore {
  farmer: Farmer | null;
  setFarmer: (farmer: Farmer) => void;
  logout: () => void;
  loans: Loan[];
  addLoan: (amount: number) => void;
  repayLoan: (id: string, amount: number) => void;
  totalBorrowed: () => number;
  totalRepaid: () => number;
}

export const useFarmerStore = create<FarmerStore>((set, get) => ({
  farmer: null,
  setFarmer: (farmer) => set({ farmer }),
  logout: () => set({ farmer: null }),
  loans: [],
  addLoan: (amount: number) => {
    const id = `${Date.now()}`;
    const loan: Loan = { id, amount, repaid: 0, createdAt: new Date().toISOString() };
    set((s: any) => ({ loans: [...s.loans, loan] }));
  },
  repayLoan: (id: string, amount: number) => {
    set((s: any) => ({ loans: s.loans.map((l: any) => (l.id === id ? { ...l, repaid: Math.min(l.amount, l.repaid + amount) } : l)) }));
  },
  totalBorrowed: () => {
    const l = get().loans || [];
    return l.reduce((sum: number, cur: any) => sum + (cur.amount || 0), 0);
  },
  totalRepaid: () => {
    const l = get().loans || [];
    return l.reduce((sum: number, cur: any) => sum + (cur.repaid || 0), 0);
  },
}));
