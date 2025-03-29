import { getRandomId } from '@/lib/utils';

// Types
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
};

export type Member = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  avatar?: string;
  joined: Date;
};

export type ExpenseCategory = 
  | 'food' 
  | 'transportation' 
  | 'entertainment' 
  | 'housing' 
  | 'utilities' 
  | 'travel' 
  | 'shopping' 
  | 'health' 
  | 'other';

export type ExpenseSplit = {
  memberId: string;
  amount: number;
  paid: boolean;
};

export type Expense = {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  paidBy: string; // memberId
  date: Date;
  category: ExpenseCategory;
  splits: ExpenseSplit[];
  receipt?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  id: string;
  groupId: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  currency: string;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
};

// Helper functions for API calls (adjust URLs as needed)

export const getUser = (): Promise<AuthUser> => {
  return fetch('/api/user', {
    headers: { 'Content-Type': 'application/json' }
  }).then((r) => r.json());
};

export const getGroups = (): Promise<Group[]> => {
  return fetch('/api/groups', {
    headers: { 'Content-Type': 'application/json' }
  }).then((r) => r.json());
};

export const getExpenses = (groupId?: string): Promise<Expense[]> => {
  let url = '/api/expenses';
  if (groupId) {
    url = `/api/expenses/group/${groupId}`;
  }
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' }
  }).then((r) => r.json());
};

export const getTransactions = (groupId?: string): Promise<Transaction[]> => {
  let url = '/api/transactions';
  if (groupId) {
    url = `/api/transactions/group/${groupId}`;
  }
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' }
  }).then((r) => r.json());
};

export const createExpense = (
  expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Expense> => {
  return fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  }).then((r) => r.json());
};

export const createGroup = (
  group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Group> => {
  return fetch('/api/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group),
  }).then((r) => r.json());
};
