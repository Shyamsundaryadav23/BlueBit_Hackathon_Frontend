// src/pages/Dashboard.tsx
import AppLayout from '@/components/layout/AppLayout';
import DashboardView from '@/components/dashboard/DashboardView';

const Dashboard = () => {
  // Mock data for the dashboard
  const dashboardData = {
    totalExpenses: 15800,
    expensesPaid: 9800,
    expensesOwed: 6000,
    groups: [
      { id: '1', name: 'Trip to Goa', memberCount: 5 },
      { id: '2', name: 'Roommates', memberCount: 3 },
      { id: '3', name: 'Office Lunch', memberCount: 8 }
    ],
    groupBalances: [
      { groupId: '1', balance: 2500 },
      { groupId: '2', balance: -800 },
      { groupId: '3', balance: 1200 }
    ],
    recentActivity: [
      { id: '1', description: 'Rahul added a new expense of ₹850 for dinner', date: '2 hours ago' },
      { id: '2', description: 'You settled ₹1200 with Priya', date: 'Yesterday' },
      { id: '3', description: 'Amit added you to group "Weekend Trip"', date: '2 days ago' },
      { id: '4', description: 'You added a new expense of ₹350 for groceries', date: '3 days ago' },
      { id: '5', description: 'Neha settled ₹650 with you', date: '1 week ago' }
    ],
    userBalances: [
      { userId: '1', name: 'Priya', balance: 1200 },
      { userId: '2', name: 'Rahul', balance: -850 },
      { userId: '3', name: 'Amit', balance: 300 },
      { userId: '4', name: 'Neha', balance: -650 }
    ]
  };

  return (
    <AppLayout>
      <DashboardView 
        totalExpenses={dashboardData.totalExpenses}
        expensesPaid={dashboardData.expensesPaid}
        expensesOwed={dashboardData.expensesOwed}
        groups={dashboardData.groups}
        groupBalances={dashboardData.groupBalances}
        recentActivity={dashboardData.recentActivity}
        userBalances={dashboardData.userBalances}
      />
    </AppLayout>
  );
};

export default Dashboard;
