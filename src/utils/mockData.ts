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
  // Now, paidBy stores the email of the payer (creator of the expense)
  paidBy: string;
  date: Date;
  category: ExpenseCategory;
  splits: ExpenseSplit[];
  receipt?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Transaction Types
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface Transaction {
  TransactionID: string;
  GroupID: string;
  // These now hold the emails of the payer and payee respectively.
  From: string;
  To: string;
  Amount: string;
  Date: string;
  Status: TransactionStatus;
  CreatedBy: string;
}

// Helper functions for API calls

export const getUser = async (): Promise<AuthUser> => {
  const r = await fetch('/api/user', {
    headers: { 'Content-Type': 'application/json' }
  });
  return await r.json();
};

export const getGroups = async (): Promise<Group[]> => {
  const r = await fetch('/api/groups', {
    headers: { 'Content-Type': 'application/json' }
  });
  return await r.json();
};

export const getExpenses = async (groupId?: string): Promise<Expense[]> => {
  let url = '/api/expenses';
  if (groupId) {
    url = `/api/expenses/group/${groupId}`;
  }
  const r = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }
  });
  return await r.json();
};

export const getTransactions = async (groupId?: string): Promise<Transaction[]> => {
  let url = '/api/transactions';
  if (groupId) {
    url = `/api/transactions/group/${groupId}`;
  }
  const r = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }
  });
  return await r.json();
};

export const createExpense = async (
  expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Expense> => {
  // Note: When creating an expense, the backend should store the creator's email in "paidBy".
  const r = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  return await r.json();
};

export const createGroup = async (
  group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Group> => {
  const r = await fetch('/api/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group),
  });
  return await r.json();
};
