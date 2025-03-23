// src/components/dashboard/DashboardView.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardViewProps {
  totalExpenses: number;
  expensesPaid: number;
  expensesOwed: number;
  groups: { id: string; name: string; memberCount: number }[];
  groupBalances: { groupId: string; balance: number }[];
  recentActivity: { id: string; description: string; date: string }[];
  userBalances: {
    userId: string;
    name: string;
    avatarUrl?: string;
    balance: number;
  }[];
}

const DashboardView: React.FC<DashboardViewProps> = ({
  totalExpenses,
  expensesPaid,
  expensesOwed,
  groups,
  groupBalances,
  recentActivity,
}) => {
  const expensesPaidPercentage = (expensesPaid / totalExpenses) * 100;
  const expensesOwedPercentage = (expensesOwed / totalExpenses) * 100;

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
      {/* Overview Section - full width */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-white hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {[
            { label: "Total Expenses", value: totalExpenses },
            { label: "Expenses Paid", value: expensesPaid },
            { label: "Expenses Owed", value: expensesOwed },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 shadow-sm bg-gray-50"
            >
              <div className="text-3xl font-bold text-gray-800">
                {item.value}
              </div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Expenses Breakdown Section */}
      <Card className="bg-white hover:shadow-xl transition-shadow duration-300 col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Expenses Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Paid</span>
            <span className="text-sm text-gray-500">
              {expensesPaidPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={expensesPaidPercentage}
            className="h-2 rounded bg-green-200"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Owed</span>
            <span className="text-sm text-gray-500">
              {expensesOwedPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={expensesOwedPercentage}
            className="h-2 rounded bg-red-200"
          />
        </CardContent>
      </Card>

      {/* Group Balances Section */}
      <Card className="bg-white hover:shadow-xl transition-shadow duration-300 col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Group Balances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[220px] w-full rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] text-sm font-medium text-gray-700">
                    Group
                  </TableHead>
                  <TableHead className="text-sm font-medium text-gray-700">
                    Balance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupBalances.map((groupBalance) => {
                  const group = groups.find(
                    (g) => g.id === groupBalance.groupId
                  );
                  return (
                    <TableRow
                      key={groupBalance.groupId}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <TableCell className="font-medium text-sm text-gray-800">
                        {group?.name}
                      </TableCell>
                      <TableCell className="text-sm text-gray-800">
                        {groupBalance.balance}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Latest Image Section */}
      <CardContent className="p-0 h-full flex items-center justify-center rounded-lg overflow-hidden border-none shadow-none col-span-full md:col-span-full lg:col-span-1 min-h-[220px]">
        <img
          src="src/assets/Cup.gif"
          alt="Bill Splitting Animation"
          className="w-full h-full object-cover rounded-2xl"
        />
      </CardContent>

      {/* Recent Activity Section - full width */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-white hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[220px] w-full rounded-md border border-gray-200">
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="py-3 px-4 hover:bg-gray-50 transition-colors rounded"
                >
                  <p className="text-sm text-gray-800">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
