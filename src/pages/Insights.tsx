
// import { useState } from 'react';
// import AppLayout from '@/components/layout/AppLayout';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Calendar, ChevronLeft, ChevronRight, BarChart4, PieChart, LineChart } from 'lucide-react';
// import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart as RechartsLineChart, Line } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// const mockCategoryData = [
//   { name: 'Food', value: 4800 },
//   { name: 'Travel', value: 7200 },
//   { name: 'Entertainment', value: 2500 },
//   { name: 'Shopping', value: 1800 },
//   { name: 'Others', value: 3200 }
// ];

// const mockMonthlyData = [
//   { month: 'Jan', spent: 5500 },
//   { month: 'Feb', spent: 4200 },
//   { month: 'Mar', spent: 6800 },
//   { month: 'Apr', spent: 7200 },
//   { month: 'May', spent: 4900 },
//   { month: 'Jun', spent: 5800 }
// ];

// const mockDailyData = [
//   { date: '1', spent: 280 },
//   { date: '2', spent: 190 },
//   { date: '3', spent: 350 },
//   { date: '4', spent: 420 },
//   { date: '5', spent: 280 },
//   { date: '6', spent: 190 },
//   { date: '7', spent: 100 },
//   { date: '8', spent: 320 },
//   { date: '9', spent: 180 },
//   { date: '10', spent: 300 }
// ];

// const Insights = () => {
//   const [activeTab, setActiveTab] = useState('spending');
//   const [activeChart, setActiveChart] = useState('pie');
//   const [timeRange, setTimeRange] = useState('This Month');

//   const renderActiveChart = () => {
//     switch(activeChart) {
//       case 'pie':
//         return (
//           <div className="w-full h-[350px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <RechartsPieChart>
//                 <Pie
//                   data={mockCategoryData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={120}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {mockCategoryData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
//               </RechartsPieChart>
//             </ResponsiveContainer>
//           </div>
//         );
      
//       case 'bar':
//         return (
//           <div className="w-full h-[350px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={mockMonthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
//                 <Bar dataKey="spent" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         );
      
//       case 'line':
//         return (
//           <div className="w-full h-[350px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <RechartsLineChart data={mockDailyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
//                 <Line type="monotone" dataKey="spent" stroke="#8884d8" />
//               </RechartsLineChart>
//             </ResponsiveContainer>
//           </div>
//         );
          
//       default:
//         return null;
//     }
//   };

//   return (
//     <AppLayout>
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
//         <div className="flex items-center space-x-2">
//           <Button variant="outline" size="sm">
//             <ChevronLeft className="h-4 w-4 mr-1" />
//             Previous
//           </Button>
//           <Button variant="outline" size="sm" className="px-3">
//             <Calendar className="h-4 w-4 mr-2" />
//             {timeRange}
//           </Button>
//           <Button variant="outline" size="sm">
//             Next
//             <ChevronRight className="h-4 w-4 ml-1" />
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="spending" className="space-y-4" onValueChange={setActiveTab}>
//         <TabsList>
//           <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
//           <TabsTrigger value="trends">Payment Trends</TabsTrigger>
//           <TabsTrigger value="groups">Group Insights</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="spending" className="space-y-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle>Expense Categories</CardTitle>
//               <div className="flex items-center space-x-2">
//                 <Button 
//                   variant={activeChart === 'pie' ? "default" : "outline"} 
//                   size="sm" 
//                   onClick={() => setActiveChart('pie')}
//                 >
//                   <PieChart className="h-4 w-4 mr-1" />
//                   Pie
//                 </Button>
//                 <Button 
//                   variant={activeChart === 'bar' ? "default" : "outline"} 
//                   size="sm"
//                   onClick={() => setActiveChart('bar')}
//                 >
//                   <BarChart4 className="h-4 w-4 mr-1" />
//                   Bar
//                 </Button>
//                 <Button 
//                   variant={activeChart === 'line' ? "default" : "outline"} 
//                   size="sm"
//                   onClick={() => setActiveChart('line')}
//                 >
//                   <LineChart className="h-4 w-4 mr-1" />
//                   Line
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {renderActiveChart()}
//             </CardContent>
//           </Card>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">₹19,500</div>
//                 <p className="text-xs text-muted-foreground">+12% from last month</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">Average Daily</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">₹650</div>
//                 <p className="text-xs text-muted-foreground">-5% from last month</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">Highest Category</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">Travel</div>
//                 <p className="text-xs text-muted-foreground">₹7,200 (37% of total)</p>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
        
//         <TabsContent value="trends">
//           <Card>
//             <CardHeader>
//               <CardTitle>Payment Trends</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-center h-[350px]">
//                 <p className="text-muted-foreground">Select a different time range to analyze your payment trends over time.</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
        
//         <TabsContent value="groups">
//           <Card>
//             <CardHeader>
//               <CardTitle>Group Spending Analysis</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-center h-[350px]">
//                 <p className="text-muted-foreground">Select a group to see detailed spending analysis.</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </AppLayout>
//   );
// };

// export default Insights;




import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  PieChart as PieChartIcon,
  BarChart4,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Type definitions (you can adjust these as needed)
interface Expense {
  amount: number | string; // Might be string from backend
  category: string;
  date: string;
}

interface Group {
  GroupID: string;
  name: string;
}

const Insights = () => {
  const [activeTab, setActiveTab] = useState("spending");
  const [activeChart, setActiveChart] = useState("pie");
  const [timeRange, setTimeRange] = useState("This Month");

  // Data for charts
  const [pieData, setPieData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. User might not be logged in.");
          return;
        }

        // 1. Fetch groups for the current user
        const groupsRes = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/groups`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!groupsRes.ok) {
          console.error("Failed to fetch groups:", groupsRes.status);
          setLoading(false);
          return;
        }

        let groups: Group[] = await groupsRes.json();

        // 2. Prepare aggregator maps
        const categoryMap: Record<string, number> = {};
        const monthlyMap: Record<string, number> = {};
        const dailyMap: Record<string, number> = {};

        // 3. For each group, fetch expenses
        for (const group of groups) {
          const groupId = group.GroupID;
          const expensesRes = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/api/expenses/group/${groupId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (expensesRes.ok) {
            const expenses: Expense[] = await expensesRes.json();
            expenses.forEach((exp) => {
              // Parse exp.amount to a number
              const numericAmount =
                typeof exp.amount === "number"
                  ? exp.amount
                  : parseFloat(exp.amount);

              // 3a. Aggregate by category
              categoryMap[exp.category] =
                (categoryMap[exp.category] || 0) + numericAmount;

              // 3b. Aggregate by month (YYYY-MM format)
              const d = new Date(exp.date);
              const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1)
                .toString()
                .padStart(2, "0")}`;
              monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + numericAmount;

              // 3c. If expense is in current month, also track daily
              const today = new Date();
              if (
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth()
              ) {
                const dayKey = d.getDate().toString();
                dailyMap[dayKey] = (dailyMap[dayKey] || 0) + numericAmount;
              }
            });
          }
        }

        // 4. Convert aggregator maps to arrays
        const pieArray = Object.keys(categoryMap).map((category) => ({
          name: category,
          value: categoryMap[category],
        }));

        // Sort months ascending (YYYY-MM) so the bar chart has a correct order
        const monthlyArray = Object.keys(monthlyMap)
          .sort()
          .map((month) => ({
            month,
            spent: monthlyMap[month],
          }));

        // For daily data, fill up days 1..31
        const dailyArray = [];
        for (let i = 1; i <= 31; i++) {
          dailyArray.push({
            date: i.toString(),
            spent: dailyMap[i.toString()] || 0,
          });
        }

        // 5. Update state
        setPieData(pieArray);
        setMonthlyData(monthlyArray);
        setDailyData(dailyArray);
      } catch (error) {
        console.error("Error fetching insights data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Renders the active chart
  const renderActiveChart = () => {
    if (loading) {
      return <p>Loading charts...</p>;
    }

    // If no data for the active chart, show a friendly message
    if (activeChart === "pie" && pieData.length === 0) {
      return <p className="text-center text-muted-foreground">No expense data available.</p>;
    }
    if (activeChart === "bar" && monthlyData.length === 0) {
      return <p className="text-center text-muted-foreground">No expense data available.</p>;
    }
    if (activeChart === "line" && dailyData.every((d) => d.spent === 0)) {
      return <p className="text-center text-muted-foreground">No expense data available for the current month.</p>;
    }

    // Switch between chart types
    switch (activeChart) {
      case "pie":
        return (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => [`₹${value}`, "Amount"]} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        );
      case "bar":
        return (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                <Bar dataKey="spent" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case "line":
        return (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                <Line type="monotone" dataKey="spent" stroke="#8884d8" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      {/* Top controls (title, date range) */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <Calendar className="h-4 w-4 mr-2" />
            {timeRange}
          </Button>
          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="spending"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="trends">Payment Trends</TabsTrigger>
          <TabsTrigger value="groups">Group Insights</TabsTrigger>
        </TabsList>

        {/* Spending Analysis */}
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Expense Categories</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={activeChart === "pie" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveChart("pie")}
                >
                  <PieChartIcon className="h-4 w-4 mr-1" />
                  Pie
                </Button>
                <Button
                  variant={activeChart === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveChart("bar")}
                >
                  <BarChart4 className="h-4 w-4 mr-1" />
                  Bar
                </Button>
                <Button
                  variant={activeChart === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveChart("line")}
                >
                  <LineChartIcon className="h-4 w-4 mr-1" />
                  Line
                </Button>
              </div>
            </CardHeader>
            <CardContent>{renderActiveChart()}</CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Spent */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pieData.reduce((sum, item) => sum + item.value, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Based on all expenses</p>
              </CardContent>
            </Card>

            {/* Average Monthly */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    monthlyData.reduce((sum, item) => sum + item.spent, 0) /
                      (monthlyData.length || 1)
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Average spending per month</p>
              </CardContent>
            </Card>

            {/* Highest Daily */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Highest Daily</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.max(...dailyData.map((d) => d.spent), 0)}
                </div>
                <p className="text-xs text-muted-foreground">Highest spending in a day</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Trends */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Payment Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[350px]">
                <p className="text-muted-foreground">
                  Select a different time range to analyze your payment trends over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Group Insights */}
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Group Spending Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[350px]">
                <p className="text-muted-foreground">
                  Select a group to see detailed spending analysis.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Insights;
