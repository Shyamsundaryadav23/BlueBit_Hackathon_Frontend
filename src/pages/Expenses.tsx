import { useState, useRef } from "react";
import {
  PlusCircle,
  Filter,
  Mail,
  Image,
  CreditCard,
  UserPlus,
  Smartphone,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { mockExpenses, mockGroups } from "@/utils/mockData";
import Loader from "@/components/ui/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseCard from "@/components/expenses/ExpenseCard";

const Expenses = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState(mockExpenses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [selectedTab, setSelectedTab] = useState("expenses");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openForm = () => {
    console.log("Opening expense form");
    setIsFormOpen(true);
  };
  const closeForm = () => {
    console.log("Closing expense form");
    setIsFormOpen(false);
  };

  const handleCreateExpense = (receiptImage?: string) => {
    console.log("handleCreateExpense called with receiptImage:", receiptImage);
    closeForm();
    setIsLoading(true);
    setTimeout(() => {
      const newExpense = {
        ...mockExpenses[0],
        id: `exp-${Date.now()}`,
        date: new Date(),
        receiptImage: receiptImage || null,
      };

      console.log("New expense created:", newExpense);
      setExpenses([newExpense, ...expenses]);
      applyFilters(searchTerm, groupFilter);
      setIsLoading(false);

      setSuccessMessage("Expense added successfully");
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);

      if (newExpense.groupId !== "personal") {
        const group = mockGroups.find((g) => g.id === newExpense.groupId);
        if (group) {
          simulateSendNotifications(group, newExpense);
        }
      }
    }, 800);
  };

  const simulateSendNotifications = (group: any, expense: any) => {
    console.log("Simulating notifications for group:", group, "and expense:", expense);
    const memberCount = group.members.length;
    toast.success(`Sending expense notifications to ${memberCount} members`, {
      duration: 3000,
    });

    let delay = 1500;
    group.members.forEach((member: any) => {
      if (member.id !== expense.paidBy) {
        setTimeout(() => {
          console.log(`Notification sent to ${member.name}`);
          toast.success(`Email notification sent to ${member.name}`, {
            description: `For ${expense.name} expense of $${expense.amount}`,
            duration: 3000,
          });
        }, delay);
        delay += 800;
      }
    });
  };

  const handleFilterChange = (groupId: string) => {
    console.log("Filter changed to group:", groupId);
    setGroupFilter(groupId);
    applyFilters(searchTerm, groupId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Search term changed to:", value);
    setSearchTerm(value);
    applyFilters(value, groupFilter);
  };

  const applyFilters = (search: string, group: string) => {
    console.log("Applying filters with search:", search, "and group:", group);
    let filtered = [...expenses];

    if (group !== "all") {
      filtered = filtered.filter((expense) => expense.groupId === group);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (expense) =>
          expense.name.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower)
      );
    }

    console.log("Filtered expenses:", filtered);
    setFilteredExpenses(filtered);
  };

  const handleUploadReceipt = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log("Receipt image selected:", imageUrl);
      // Optionally update parent's state if needed.
      toast.success("Receipt uploaded successfully", {
        description: "Your receipt image has been attached to the expense",
      });
    }
  };

  const handleProceedToPayment = (expenseId: string) => {
    console.log("Proceeding to payment for expense:", expenseId);
    setSelectedExpenseId(expenseId);
    setPaymentModalOpen(true);
  };

  const processPayment = () => {
    console.log("Processing payment for expense:", selectedExpenseId);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setPaymentModalOpen(false);

      toast.success("Payment successful", {
        description: "Your payment has been processed successfully",
      });
    }, 2000);
  };

  const sendInvite = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }

    console.log("Sending invite to:", inviteEmail);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setInviteModalOpen(false);
      setInviteEmail("");

      toast.success("Invitation sent", {
        description: `An invitation has been sent to ${inviteEmail}`,
      });
    }, 1500);
  };

  return (
    <AppLayout>
      {/* Green Success Label */}
      {successMessage && (
        <div className="bg-green-500 text-white p-2 text-center mb-4">
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Expenses</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setInviteModalOpen(true)}
            className="rounded-md"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
          <Button onClick={openForm} className="rounded-md">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Expense
          </Button>
        </div>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={(val) => {
          console.log("Selected tab changed to:", val);
          setSelectedTab(val);
        }}
        className="w-full mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="mt-4">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={groupFilter} onValueChange={handleFilterChange}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {mockGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator className="mb-6" />
          {isLoading ? (
            <div className="h-40 flex-center">
              <Loader size="lg" />
            </div>
          ) : filteredExpenses.length > 0 ? (
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  members={
                    mockGroups.find((g) => g.id === expense.groupId)?.members ||
                    []
                  }
                  onPaymentClick={() => handleProceedToPayment(expense.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <h3 className="font-medium text-lg mb-2">No Expenses Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || groupFilter !== "all"
                  ? "Try changing your filters"
                  : "Add your first expense to get started"}
              </p>
              <Button onClick={openForm} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <div className="bg-muted/40 rounded-lg p-6 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium text-lg mb-2">Payment History</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              View and manage your expense payments. Your payment history will
              appear here.
            </p>
            <Button variant="outline" disabled>
              View All Transactions
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Expense Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
          <VisuallyHidden asChild>
            <DialogTitle>Add New Expense</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <DialogDescription>
              Fill out the form to add a new expense.
            </DialogDescription>
          </VisuallyHidden>
          <div className="p-6">
            <ExpenseForm
              group={mockGroups[0]}
              onSave={handleCreateExpense}
              onCancel={closeForm}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <VisuallyHidden asChild>
            <DialogTitle>Complete Payment</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <DialogDescription>
              Choose your preferred payment method.
            </DialogDescription>
          </VisuallyHidden>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
              <p className="text-muted-foreground">
                Choose your preferred payment method.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">$24.99</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Processing Fee:</span>
                <span className="font-medium">$0.50</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold">$25.49</span>
              </div>
            </div>
            <Tabs defaultValue="upi" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upi">UPI</TabsTrigger>
                <TabsTrigger value="card">Card</TabsTrigger>
              </TabsList>
              <TabsContent value="upi" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">UPI ID</label>
                  <div className="flex">
                    <Input
                      placeholder="yourname@upi"
                      className="rounded-r-none"
                    />
                    <Button className="rounded-l-none">Verify</Button>
                  </div>
                </div>
                <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Smartphone className="h-10 w-10 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Scan QR code with your UPI app
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={processPayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader size="sm" className="mr-2" />
                  ) : (
                    <Smartphone className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Processing..." : "Pay with UPI"}
                </Button>
              </TabsContent>
              <TabsContent value="card" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVC</label>
                    <Input placeholder="123" />
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={processPayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader size="sm" className="mr-2" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Processing..." : "Pay with Card"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <VisuallyHidden asChild>
            <DialogTitle>Invite Member</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <DialogDescription>
              Send an invitation to join your expense group.
            </DialogDescription>
          </VisuallyHidden>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Invite Member</h2>
              <p className="text-muted-foreground">
                Send an invitation to join your expense group.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  placeholder="friend@example.com"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Group</label>
                <Select defaultValue={mockGroups[0].id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message (Optional)</label>
                <Input placeholder="Join our expense group for the trip!" />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={sendInvite}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader size="sm" className="mr-2" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Expenses;
