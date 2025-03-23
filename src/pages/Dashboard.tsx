// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardView from '@/components/dashboard/DashboardView';

// Define an interface for an Expense
interface Expense {
  amount: string | number;
  paidBy: string;
  // You can add additional properties as needed
}

const Dashboard = () => {
  // State for dashboard stats and related data
  const [dashboardStats, setDashboardStats] = useState({
    totalExpenses: 0,
    expensesPaid: 0,
    expensesOwed: 0,
  });
  const [groups, setGroups] = useState<any[]>([]);
  const [groupBalances, setGroupBalances] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userBalances, setUserBalances] = useState<any[]>([]);

  // Define mock data for groups and group balances
  const mockGroups = [
    { GroupID: '1', name: 'Trip to Goa', memberCount: 5 },
    { GroupID: '2', name: 'Roommates', memberCount: 3 },
    { GroupID: '3', name: 'Office Lunch', memberCount: 8 }
  ];
  const mockGroupBalances = [
    { groupId: '1', name: 'Trip to Goa', balance: 2500 },
    { groupId: '2', name: 'Roommates', balance: -800 },
    { groupId: '3', name: 'Office Lunch', balance: 1200 }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }
      try {
        // 1. Fetch user details from /api/dashboard
        const dashboardRes = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/dashboard`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!dashboardRes.ok) {
          console.error("Failed to fetch dashboard data", dashboardRes.status);
          return;
        }
        const dashboardData = await dashboardRes.json();
        const currentUserEmail = dashboardData.user.Email;

        // 2. Fetch groups using /api/groups
        const groupsRes = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/groups`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let groupsData;
        if (!groupsRes.ok) {
          console.error("Failed to fetch groups", groupsRes.status);
          // Fall back to mock groups if fetching fails
          groupsData = mockGroups;
        } else {
          groupsData = await groupsRes.json();
          // If API returns an empty array, also use mock groups
          if (!groupsData || groupsData.length === 0) {
            groupsData = mockGroups;
          }
        }
        setGroups(groupsData);

        // Initialize aggregates
        let totalExpenses = 0;
        let expensesPaid = 0;
        let expensesOwed = 0;
        let computedGroupBalances: any[] = [];
        let computedUserBalances: { [key: string]: number } = {};
        let computedRecentActivity: any[] = [];

        // 3. For each group, fetch expenses and transactions
        for (const group of groupsData) {
          // Fetch expenses for the group using /api/expenses/group/<group_id>
          const expensesRes = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/api/expenses/group/${group.GroupID}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (expensesRes.ok) {
            // Type the fetched data as an array of Expense
            const expenses: Expense[] = await expensesRes.json();
            let groupBalance = 0;
            expenses.forEach((exp: Expense) => {
              const amount = parseFloat(exp.amount as string) || 0;
              totalExpenses += amount;
              if (exp.paidBy === currentUserEmail) {
                expensesPaid += amount;
                groupBalance += amount;
              } else {
                expensesOwed += amount;
                groupBalance -= amount;
              }
              // Update per-user balances
              if (exp.paidBy) {
                computedUserBalances[exp.paidBy] =
                  (computedUserBalances[exp.paidBy] || 0) + amount;
                if (exp.paidBy !== currentUserEmail) {
                  computedUserBalances[currentUserEmail] =
                    (computedUserBalances[currentUserEmail] || 0) - amount;
                }
              }
            });
            // Use the group's name if available; otherwise, use a dummy name.
            computedGroupBalances.push({ 
              groupId: group.GroupID, 
              name: group.name || "Dummy Group", 
              balance: groupBalance 
            });

            // Fetch transactions for the group using /api/transactions/group/<group_id>
            const transactionsRes = await fetch(
              `${import.meta.env.VITE_APP_API_URL}/api/transactions/group/${group.GroupID}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (transactionsRes.ok) {
              const transData = await transactionsRes.json();
              if (transData.transactions) {
                computedRecentActivity = computedRecentActivity.concat(transData.transactions);
              }
            }
          }
        }

        // If no group balances computed, assign dummy data from mockGroupBalances
        if (computedGroupBalances.length === 0) {
          computedGroupBalances = mockGroupBalances;
        }

        // If no recent activity was computed from transactions, use mock data
        if (computedRecentActivity.length === 0) {
          computedRecentActivity = [
            { id: '1', description: 'Rahul added a new expense of ₹850 for dinner', date: '2 hours ago' },
            { id: '2', description: 'You settled ₹1200 with Priya', date: 'Yesterday' },
            { id: '3', description: 'Amit added you to group "Weekend Trip"', date: '2 days ago' },
            { id: '4', description: 'You added a new expense of ₹350 for groceries', date: '3 days ago' },
            { id: '5', description: 'Neha settled ₹650 with you', date: '1 week ago' },
          ];
        }

        // Transform computedUserBalances from an object to an array format
        const userBalancesArray = Object.keys(computedUserBalances).map(email => ({
          userId: email,
          name: email, // Adjust if you have more user info
          balance: computedUserBalances[email],
        }));

        // Update state with computed values
        setDashboardStats({ totalExpenses, expensesPaid, expensesOwed });
        setGroupBalances(computedGroupBalances);
        setUserBalances(userBalancesArray);
        setRecentActivity(computedRecentActivity);

        // Store user details in localStorage
        localStorage.setItem("email", dashboardData.user.Email);
        localStorage.setItem("name", dashboardData.user.name);
        localStorage.setItem("picture", dashboardData.user.picture);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AppLayout>
      <DashboardView 
        totalExpenses={dashboardStats.totalExpenses}
        expensesPaid={dashboardStats.expensesPaid}
        expensesOwed={dashboardStats.expensesOwed}
        groups={groups}
        groupBalances={groupBalances}
        recentActivity={recentActivity}
        userBalances={userBalances}
      />
    </AppLayout>
  );
};

export default Dashboard;
