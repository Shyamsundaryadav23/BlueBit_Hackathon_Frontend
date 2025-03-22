
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
  userId: string;
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

// Mock data
export const mockUsers: AuthUser[] = [
  {
    id: '1',
    name: 'Alex Smith',
    email: 'alex@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Smith&background=0D8ABC&color=fff',
  },
  {
    id: '2',
    name: 'Jamie Lee',
    email: 'jamie@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jamie+Lee&background=FF5733&color=fff',
  },
  {
    id: '3',
    name: 'Taylor Kim',
    email: 'taylor@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Taylor+Kim&background=27AE60&color=fff',
  },
  {
    id: '4',
    name: 'Jordan Patel',
    email: 'jordan@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jordan+Patel&background=8E44AD&color=fff',
  }
];

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Summer Vacation 2023',
    description: 'Trip to Hawaii with friends',
    members: [
      { 
        id: '1', 
        userId: '1', 
        name: 'Alex Smith', 
        email: 'alex@example.com', 
        avatar: 'https://ui-avatars.com/api/?name=Alex+Smith&background=0D8ABC&color=fff',
        joined: new Date('2023-05-10')
      },
      { 
        id: '2', 
        userId: '2', 
        name: 'Jamie Lee', 
        email: 'jamie@example.com', 
        avatar: 'https://ui-avatars.com/api/?name=Jamie+Lee&background=FF5733&color=fff',
        joined: new Date('2023-05-11')
      },
      { 
        id: '3', 
        userId: '3', 
        name: 'Taylor Kim', 
        email: 'taylor@example.com', 
        avatar: 'https://ui-avatars.com/api/?name=Taylor+Kim&background=27AE60&color=fff',
        joined: new Date('2023-05-12')
      }
    ],
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-10')
  },
  {
    id: '2',
    name: 'Apartment Expenses',
    description: 'Monthly bills and groceries',
    members: [
      { 
        id: '1', 
        userId: '1', 
        name: 'Alex Smith', 
        email: 'alex@example.com', 
        avatar: 'https://ui-avatars.com/api/?name=Alex+Smith&background=0D8ABC&color=fff',
        joined: new Date('2023-01-15')
      },
      { 
        id: '4', 
        userId: '4', 
        name: 'Jordan Patel', 
        email: 'jordan@example.com', 
        avatar: 'https://ui-avatars.com/api/?name=Jordan+Patel&background=8E44AD&color=fff',
        joined: new Date('2023-01-15')
      }
    ],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    groupId: '1',
    name: 'Hotel Booking',
    description: 'Beachfront resort for 3 nights',
    amount: 900,
    currency: 'USD',
    paidBy: '1', // Alex paid
    date: new Date('2023-06-10'),
    category: 'travel',
    splits: [
      { memberId: '1', amount: 300, paid: true },
      { memberId: '2', amount: 300, paid: false },
      { memberId: '3', amount: 300, paid: false }
    ],
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15')
  },
  {
    id: '2',
    groupId: '1',
    name: 'Dinner at Seafood Place',
    amount: 180,
    currency: 'USD',
    paidBy: '2', // Jamie paid
    date: new Date('2023-06-11'),
    category: 'food',
    splits: [
      { memberId: '1', amount: 60, paid: false },
      { memberId: '2', amount: 60, paid: true },
      { memberId: '3', amount: 60, paid: false }
    ],
    createdAt: new Date('2023-06-11'),
    updatedAt: new Date('2023-06-11')
  },
  {
    id: '3',
    groupId: '2',
    name: 'Internet Bill - June',
    amount: 80,
    currency: 'USD',
    paidBy: '1', // Alex paid
    date: new Date('2023-06-05'),
    category: 'utilities',
    splits: [
      { memberId: '1', amount: 40, paid: true },
      { memberId: '4', amount: 40, paid: false }
    ],
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-05')
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    groupId: '1',
    fromMemberId: '2', // Jamie
    toMemberId: '1', // Alex
    amount: 300,
    currency: 'USD',
    date: new Date('2023-06-15'),
    status: 'completed',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15')
  },
  {
    id: '2',
    groupId: '1',
    fromMemberId: '3', // Taylor
    toMemberId: '1', // Alex
    amount: 300,
    currency: 'USD',
    date: new Date('2023-06-16'),
    status: 'pending',
    createdAt: new Date('2023-06-16'),
    updatedAt: new Date('2023-06-16')
  }
];

// Helper functions to simulate API calls
export const getMockUser = (): Promise<AuthUser> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers[0]);
    }, 500);
  });
};

export const getMockGroups = (): Promise<Group[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockGroups]);
    }, 700);
  });
};

export const getMockExpenses = (groupId?: string): Promise<Expense[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (groupId) {
        resolve(mockExpenses.filter(expense => expense.groupId === groupId));
      } else {
        resolve([...mockExpenses]);
      }
    }, 800);
  });
};

export const getMockTransactions = (groupId?: string): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (groupId) {
        resolve(mockTransactions.filter(transaction => transaction.groupId === groupId));
      } else {
        resolve([...mockTransactions]);
      }
    }, 600);
  });
};

export const getBalances = (groupId: string): Record<string, number> => {
  const balances: Record<string, number> = {};
  const groupExpenses = mockExpenses.filter(expense => expense.groupId === groupId);
  
  // Initialize balances for all members
  const group = mockGroups.find(g => g.id === groupId);
  if (group) {
    group.members.forEach(member => {
      balances[member.id] = 0;
    });
  }
  
  // Calculate balances based on expenses
  groupExpenses.forEach(expense => {
    // Credit the payer
    balances[expense.paidBy] += expense.amount;
    
    // Debit each participant
    expense.splits.forEach(split => {
      balances[split.memberId] -= split.amount;
    });
  });
  
  return balances;
};

// Generate a function to create new expenses
export const createMockExpense = (
  expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Expense> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newExpense: Expense = {
        ...expense,
        id: getRandomId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // In a real app, this would add to the database
      mockExpenses.push(newExpense);
      
      resolve(newExpense);
    }, 800);
  });
};

// Generate a function to create new groups
export const createMockGroup = (
  group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Group> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newGroup: Group = {
        ...group,
        id: getRandomId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // In a real app, this would add to the database
      mockGroups.push(newGroup);
      
      resolve(newGroup);
    }, 800);
  });
};