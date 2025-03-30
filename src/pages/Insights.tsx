import { useState, useEffect, useCallback, useMemo } from "react";
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
  RefreshCw,
  AlertTriangle,
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

// Optional Spinner component for better loading UX
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" aria-label="Loading spinner"></div>
  </div>
);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface ChartRendererProps {
  activeChart: string;
  pieData: any[];
  monthlyData: any[];
  dailyData: any[];
  loading: boolean;
}

const ChartRenderer = ({ activeChart, pieData, monthlyData, dailyData, loading }: ChartRendererProps) => {
  if (loading) return <Spinner />;

  if (activeChart === "pie" && pieData.length === 0)
    return <p className="text-center text-muted-foreground">No expense data available.</p>;
  if (activeChart === "bar" && monthlyData.length === 0)
    return <p className="text-center text-muted-foreground">No expense data available.</p>;
  if (activeChart === "line" && dailyData.every((d) => d.spent === 0))
    return <p className="text-center text-muted-foreground">No expense data available for the current month.</p>;

  switch (activeChart) {
    case "pie":
      return (
        <div className="w-full h-[350px] transition-all duration-300">
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
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
              >
                {pieData.map((index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value: number) => [`₹${value.toFixed(2)}`, "Amount"]} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      );
    case "bar":
      return (
        <div className="w-full h-[350px] transition-all duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip formatter={(value: number) => [`₹${value.toFixed(2)}`, "Amount"]} />
              <Bar dataKey="spent" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    case "line":
      return (
        <div className="w-full h-[350px] transition-all duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip formatter={(value: number) => [`₹${value.toFixed(2)}`, "Amount"]} />
              <Line type="monotone" dataKey="spent" stroke="#8884d8" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      );
    default:
      return null;
  }
};

const Insights = () => {
  const [, setActiveTab] = useState("spending");
  const [activeChart, setActiveChart] = useState("pie");
  const [timeRange, setTimeRange] = useState("This Month");
  const [pieData, setPieData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }
      // Fetch groups
      const groupsRes = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/groups`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!groupsRes.ok) {
        setError(`Failed to fetch groups: ${groupsRes.status}`);
        setLoading(false);
        return;
      }
      let groups = await groupsRes.json();

      // Aggregator maps
      const categoryMap: Record<string, number> = {};
      const monthlyMap: Record<string, number> = {};
      const dailyMap: Record<string, number> = {};

      // For each group, fetch expenses
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
          const expenses = await expensesRes.json();
          expenses.forEach((exp: any) => {
            const numericAmount =
              typeof exp.amount === "number" ? exp.amount : parseFloat(exp.amount);
            // Aggregate by category
            categoryMap[exp.category] = (categoryMap[exp.category] || 0) + numericAmount;
            // Aggregate by month (YYYY-MM)
            const d = new Date(exp.date);
            const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
            monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + numericAmount;
            // Aggregate daily if in current month
            const today = new Date();
            if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth()) {
              const dayKey = d.getDate().toString();
              dailyMap[dayKey] = (dailyMap[dayKey] || 0) + numericAmount;
            }
          });
        }
      }

      // Convert aggregator maps to arrays
      const pieArray = Object.keys(categoryMap).map((category) => ({
        name: category,
        value: categoryMap[category],
      }));
      const monthlyArray = Object.keys(monthlyMap)
        .sort()
        .map((month) => ({
          month,
          spent: monthlyMap[month],
        }));
      const dailyArray = [];
      for (let i = 1; i <= 31; i++) {
        dailyArray.push({
          date: i.toString(),
          spent: dailyMap[i.toString()] || 0,
        });
      }

      setPieData(pieArray);
      setMonthlyData(monthlyArray);
      setDailyData(dailyArray);
    } catch (error) {
      console.error("Error fetching insights data:", error);
      setError("An error occurred while fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Re-fetch data on mount and when timeRange changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const metrics = useMemo(() => {
    if (pieData.length === 0) return { totalSpent: 0, averageMonthly: 0, highestDaily: 0 };
    // Total spent from pieData aggregation
    const totalSpent = pieData.reduce((sum, item) => sum + item.value, 0);
    // Average monthly: average from monthly data (sum / months count)
    const totalMonthly = monthlyData.reduce((sum, item) => sum + item.spent, 0);
    const averageMonthly = totalMonthly / (monthlyData.length || 1);
    // Highest daily spending: max of daily spent
    const highestDaily = Math.max(...dailyData.map((d) => d.spent), 0);
    return { totalSpent, averageMonthly, highestDaily };
  }, [pieData, monthlyData, dailyData]);

  const { totalSpent, averageMonthly, highestDaily } = metrics;

  return (
    <AppLayout>
      {/* Top Controls - Inline buttons for a consistent horizontal layout */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight mb-2 md:mb-0">Insights</h1>
        <div className="flex flex-row space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("Previous Month")}
            aria-label="Show previous month"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="sm" className="px-3" aria-label="Current month">
            <Calendar className="h-4 w-4 mr-2" />
            {timeRange}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("Next Month")}
            aria-label="Show next month"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Metrics Section */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-2">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-medium">Total Spent</div>
            <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Based on all expenses</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium">Average Monthly</div>
            <div className="text-2xl font-bold">₹{averageMonthly.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Average spending per month</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium">Highest Daily</div>
            <div className="text-2xl font-bold">₹{highestDaily.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Highest spending in a day</p>
          </div>
        </div>
      </div>

      {/* Tabs for Charts */}
      <Tabs defaultValue="spending" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="trends">Payment Trends</TabsTrigger>
          <TabsTrigger value="groups">Group Insights</TabsTrigger>
        </TabsList>

        {/* Spending Analysis */}
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Expense Categories</CardTitle>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Button
                  variant={activeChart === "pie" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveChart("pie")}
                  aria-label="Show pie chart"
                >
                  <PieChartIcon className="h-4 w-4 mr-1" />
                  Pie
                </Button>
                <Button
                  variant={activeChart === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveChart("bar")}
                  aria-label="Show bar chart"
                >
                  <BarChart4 className="h-4 w-4 mr-1" />
                  Bar
                </Button>
                <Button
                  variant={activeChart === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveChart("line")}
                  aria-label="Show line chart"
                >
                  <LineChartIcon className="h-4 w-4 mr-1" />
                  Line
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ChartRenderer
                activeChart={activeChart}
                pieData={pieData}
                monthlyData={monthlyData}
                dailyData={dailyData}
                loading={loading}
              />
            </CardContent>
          </Card>
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

      {/* Refresh Button at Bottom */}
      <div className="mb-6 flex justify-end">
        <Button variant="outline" size="sm" onClick={fetchData} aria-label="Refresh data">
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh Data
        </Button>
      </div>
    </AppLayout>
  );
};

export default Insights;
