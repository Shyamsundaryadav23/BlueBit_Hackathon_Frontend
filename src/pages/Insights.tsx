
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, BarChart4, PieChart, LineChart } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart as RechartsLineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const mockCategoryData = [
  { name: 'Food', value: 4800 },
  { name: 'Travel', value: 7200 },
  { name: 'Entertainment', value: 2500 },
  { name: 'Shopping', value: 1800 },
  { name: 'Others', value: 3200 }
];

const mockMonthlyData = [
  { month: 'Jan', spent: 5500 },
  { month: 'Feb', spent: 4200 },
  { month: 'Mar', spent: 6800 },
  { month: 'Apr', spent: 7200 },
  { month: 'May', spent: 4900 },
  { month: 'Jun', spent: 5800 }
];

const mockDailyData = [
  { date: '1', spent: 280 },
  { date: '2', spent: 190 },
  { date: '3', spent: 350 },
  { date: '4', spent: 420 },
  { date: '5', spent: 280 },
  { date: '6', spent: 190 },
  { date: '7', spent: 100 },
  { date: '8', spent: 320 },
  { date: '9', spent: 180 },
  { date: '10', spent: 300 }
];

const Insights = () => {
  const [activeTab, setActiveTab] = useState('spending');
  const [activeChart, setActiveChart] = useState('pie');
  const [timeRange, setTimeRange] = useState('This Month');

  const renderActiveChart = () => {
    switch(activeChart) {
      case 'pie':
        return (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'bar':
        return (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                <Bar dataKey="spent" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'line':
        return (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={mockDailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
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

      <Tabs defaultValue="spending" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="trends">Payment Trends</TabsTrigger>
          <TabsTrigger value="groups">Group Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Expense Categories</CardTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={activeChart === 'pie' ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setActiveChart('pie')}
                >
                  <PieChart className="h-4 w-4 mr-1" />
                  Pie
                </Button>
                <Button 
                  variant={activeChart === 'bar' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveChart('bar')}
                >
                  <BarChart4 className="h-4 w-4 mr-1" />
                  Bar
                </Button>
                <Button 
                  variant={activeChart === 'line' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveChart('line')}
                >
                  <LineChart className="h-4 w-4 mr-1" />
                  Line
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {renderActiveChart()}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹19,500</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Daily</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹650</div>
                <p className="text-xs text-muted-foreground">-5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Highest Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Travel</div>
                <p className="text-xs text-muted-foreground">₹7,200 (37% of total)</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Payment Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[350px]">
                <p className="text-muted-foreground">Select a different time range to analyze your payment trends over time.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Group Spending Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[350px]">
                <p className="text-muted-foreground">Select a group to see detailed spending analysis.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Insights;