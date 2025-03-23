// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardView from '@/components/dashboard/DashboardView';

const Dashboard = () => {
  // State for expense statistics fetched from API
  const [dashboardStats, setDashboardStats] = useState({
    totalExpenses: 0,
    expensesPaid: 0,
    expensesOwed: 0,
  });

  // Fetch expense stats from API on mount
  useEffect(() => {
    const fetchDashboardStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/dashboard`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched dashboard stats:", data);
          setDashboardStats(data);
        } else {
          console.error("Failed to fetch dashboard stats", response.status);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  // Other dashboard mock data remains (for groups, recent activity, etc.)
  const dashboardData = {
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
        totalExpenses={dashboardStats.totalExpenses}
        expensesPaid={dashboardStats.expensesPaid}
        expensesOwed={dashboardStats.expensesOwed}
        groups={dashboardData.groups}
        groupBalances={dashboardData.groupBalances}
        recentActivity={dashboardData.recentActivity}
        userBalances={dashboardData.userBalances}
      />
    </AppLayout>
  );
};

export default Dashboard;
