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
  groups: any[];  // You can replace 'any' with a more specific type
  groupBalances: any[]; // You can replace 'any' with a more specific type
  recentActivity: any[]; // You can replace 'any' with a more specific type
  userBalances: { userId: string; name: string; balance: number }[];  // ✅ Add this line
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
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch p-6 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
      {/* Overview Section */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-white shadow-xl rounded-xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-blue-800">
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {[
            { label: "Total Expenses", value: totalExpenses },
            { label: "Expenses Paid", value: expensesPaid },
            { label: "Expenses Owed", value: expensesOwed },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-r from-blue-300 to-purple-300 text-white shadow-lg"
            >
              <div className="text-4xl font-extrabold">
                {Number(item.value).toFixed(2)}
              </div>
              <div className="text-lg">{item.label}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Expenses Breakdown Section */}
      <Card className="bg-white shadow-xl rounded-xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Expenses Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-md font-medium text-gray-700">Paid</span>
            <span className="text-md font-bold text-green-600">
              {expensesPaidPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={expensesPaidPercentage}
            className="h-3 rounded-lg bg-green-300"
          />
          <div className="flex items-center justify-between">
            <span className="text-md font-medium text-gray-700">Owed</span>
            <span className="text-md font-bold text-red-600">
              {expensesOwedPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={expensesOwedPercentage}
            className="h-3 rounded-lg bg-red-300"
          />
        </CardContent>
      </Card>

      {/* Group Balances Section */}
      <Card className="bg-white shadow-xl rounded-xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Group Balances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[220px] w-full rounded-lg border border-gray-300">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] text-lg font-medium text-gray-700">
                    Group
                  </TableHead>
                  <TableHead className="text-lg font-medium text-gray-700">
                    Balance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupBalances.map((groupBalance) => {
                  const group = groups.find((g) => g.id === groupBalance.groupId);
                  return (
                    <TableRow
                      key={groupBalance.groupId}
                      className="hover:bg-gray-200 transition-all"
                    >
                      <TableCell className="font-bold text-md text-gray-900">
                        {group?.name}
                      </TableCell>
                      <TableCell className="text-md font-bold text-gray-700">
                        {Number(groupBalance.balance).toFixed(2)}
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
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
      </CardContent>

      {/* Recent Activity Section */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-white shadow-2xl rounded-xl hover:shadow-3xl transition-all">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[220px] w-full rounded-lg border border-gray-300">
            <div className="divide-y divide-gray-300">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="py-4 px-5 hover:bg-gray-100 transition-all rounded-lg"
                >
                  <p className="text-md font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-600">{activity.date}</p>
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
