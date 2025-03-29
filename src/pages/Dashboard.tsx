import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardView from '@/components/dashboard/DashboardView';

interface Expense {
  amount: string | number;
  paidBy: string;
  createdAt?: string;
}

interface Group {
  GroupID: string;
  name?: string;
  createdBy?: string;
  createdAt?: string;
  members?: Array<{ email: string }>;
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

  // Fallback mock data
  const mockGroups = [
    { GroupID: '1', name: 'Trip to Goa', memberCount: 5 },
    { GroupID: '2', name: 'Roommates', memberCount: 3 },
    { GroupID: '3', name: 'Office Lunch', memberCount: 8 },
  ];
  const mockGroupBalances = [
    { groupId: '1', name: 'Trip to Goa', balance: 2500 },
    { groupId: '2', name: 'Roommates', balance: -800 },
    { groupId: '3', name: 'Office Lunch', balance: 1200 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. User might not be logged in.');
        return;
      }

      try {
        // 1. Fetch user details from /api/dashboard
        const dashboardRes = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/dashboard`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!dashboardRes.ok) {
          console.error('Failed to fetch dashboard data', dashboardRes.status);
          return;
        }
        const dashboardData = await dashboardRes.json();
        const currentUserEmail = dashboardData.user.email; 
        // ^^^ Use `.email` if your user object is { email: "...", name: "...", ... }

        // 2. Fetch groups using /api/groups
        const groupsRes = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/groups`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let groupsData: Group[];
        if (!groupsRes.ok) {
          console.error('Failed to fetch groups', groupsRes.status);
          groupsData = mockGroups; // fallback
        } else {
          groupsData = await groupsRes.json();
          if (!groupsData || groupsData.length === 0) {
            groupsData = mockGroups; // fallback if empty
          }
        }

        // Normalize the groups data
        const normalizedGroups = groupsData.map((group) => ({
          id: group.GroupID,
          name: group.name,
          memberCount: group.members?.length ?? 1,
        }));
        setGroups(normalizedGroups);

        // Initialize aggregates
        let totalExpenses = 0;
        let expensesPaid = 0;
        let expensesOwed = 0;
        let computedUserBalances: { [key: string]: number } = {};
        let computedGroupBalances: Array<{
          groupId: string;
          name: string;
          balance: number;
        }> = [];
        let computedRecentActivity: any[] = [];

        // ---------- NEW: Add group-creation events ----------
        for (const grp of groupsData) {
          // If the group has a createdAt date, let's use that; else fallback to "some date"
          const groupCreatedAt = grp.createdAt || 'Some time ago';
          if (grp.createdBy === currentUserEmail) {
            // Current user created the group
            computedRecentActivity.push({
              id: `group-create-${grp.GroupID}`,
              description: `You created the group "${grp.name || 'Unnamed Group'}"`,
              date: groupCreatedAt,
            });
          } else {
            // Another user created this group
            computedRecentActivity.push({
              id: `group-create-${grp.GroupID}`,
              description: `${grp.createdBy} created the group "${grp.name || 'Unnamed Group'}"`,
              date: groupCreatedAt,
            });
          }
        }
        // ----------------------------------------------------

        // 3. For each group, fetch expenses and transactions
        for (const group of groupsData) {
          // 3a. Fetch expenses
          const expensesRes = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/api/expenses/group/${group.GroupID}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (expensesRes.ok) {
            const expenses: Expense[] = await expensesRes.json();
            let groupBalance = 0;

            expenses.forEach((exp, i) => {
              const numericAmount = parseFloat(exp.amount as string) || 0;
              totalExpenses += numericAmount;

              // Paid by current user => user paid this expense
              if (exp.paidBy === currentUserEmail) {
                expensesPaid += numericAmount;
                groupBalance += numericAmount;
              } else {
                expensesOwed += numericAmount;
                groupBalance -= numericAmount;
              }

              // Update per-user balances
              if (exp.paidBy) {
                computedUserBalances[exp.paidBy] =
                  (computedUserBalances[exp.paidBy] || 0) + numericAmount;
                if (exp.paidBy !== currentUserEmail) {
                  computedUserBalances[currentUserEmail] =
                    (computedUserBalances[currentUserEmail] || 0) - numericAmount;
                }
              }

              // ---------- NEW: Add expense-creation events ----------
              const expenseCreatedAt = exp.createdAt || 'Some time ago';
              const eventId = `expense-${group.GroupID}-${i}`;
              if (exp.paidBy === currentUserEmail) {
                computedRecentActivity.push({
                  id: eventId,
                  description: `You added a new expense of ₹${numericAmount} in "${group.name}"`,
                  date: expenseCreatedAt,
                });
              } else {
                computedRecentActivity.push({
                  id: eventId,
                  description: `${exp.paidBy} added a new expense of ₹${numericAmount} in "${group.name}"`,
                  date: expenseCreatedAt,
                });
              }
              // -------------------------------------------------------
            });

            // Store groupBalance
            computedGroupBalances.push({
              groupId: group.GroupID,
              name: group.name || 'Dummy Group',
              balance: groupBalance,
            });

            // 3b. Fetch transactions for the group (if you still want them)
            const transactionsRes = await fetch(
              `${import.meta.env.VITE_APP_API_URL}/api/transactions/group/${group.GroupID}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (transactionsRes.ok) {
              const transData = await transactionsRes.json();
              if (transData.transactions) {
                // If you want to transform transaction data into more activity messages, do it here
                // e.g.:
                // transData.transactions.forEach((tx, idx) => {
                //   ...
                // });
                // Or ignore if you’re now capturing everything via group creation + expenses
              }
            }
          }
        }

        // If no group balances computed, assign dummy data from mockGroupBalances
        if (computedGroupBalances.length === 0) {
          computedGroupBalances = mockGroupBalances;
        }

        // If for some reason we ended up with no activity, you can remove or keep fallback
        if (computedRecentActivity.length === 0) {
          computedRecentActivity = [
            { id: '1', description: 'No real data found. Fallback #1', date: '1 hour ago' },
            { id: '2', description: 'No real data found. Fallback #2', date: '2 hours ago' },
          ];
        }

        // Transform computedUserBalances into array format
        const userBalancesArray = Object.keys(computedUserBalances).map((email) => ({
          userId: email,
          name: email,
          balance: computedUserBalances[email],
        }));

        // Update state
        setDashboardStats({
          totalExpenses,
          expensesPaid,
          expensesOwed,
        });
        setGroupBalances(computedGroupBalances);
        setUserBalances(userBalancesArray);
        setRecentActivity(computedRecentActivity);

        // Store user details in localStorage
        localStorage.setItem('email', dashboardData.user.email);
        localStorage.setItem('name', dashboardData.user.name);
        localStorage.setItem('picture', dashboardData.user.picture);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
