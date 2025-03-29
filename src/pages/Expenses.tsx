import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  PlusCircle,
  Filter,
  Mail,
  CreditCard,
  UserPlus,
  Smartphone,
  Camera,
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
import Loader from "@/components/ui/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import emailjs from "emailjs-com";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseCard from "@/components/expenses/ExpenseCard";
import axios from "axios";
import ARScanDialog from "@/components/arscan/ARScanDialogue";
import { SettleDebtsCard } from "@/components/settledebt/SettleDebtsCard";
import { Transaction } from "@/utils/mockData";

type ExpenseCategory =
  | "food"
  | "transportation"
  | "entertainment"
  | "housing"
  | "utilities"
  | "travel"
  | "shopping"
  | "health"
  | "other";

interface Expense {
  id: string;
  ExpenseID: string;
  name: string;
  description: string;
  groupId: string;
  amount: number;
  category: ExpenseCategory;
  receiptImage?: string;
  currency: string;
  paidBy: string;
  date: Date;
  splits: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface Group {
  id: string;
  name: string;
  members: any[];
  createdAt: Date;
  updatedAt: Date;
}

const Expenses: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  console.log("Expenses Page - groupId:", groupId);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [groupDetails, setGroupDetails] = useState<Group | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>(groupId ?? "all");
  const [selectedTab, setSelectedTab] = useState("expenses");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [isARScanOpen, setIsARScanOpen] = useState(false);
  const [settlementTransactions, setSettlementTransactions] = useState<Transaction[]>([]);
  const [isSettling, setIsSettling] = useState(false);
  const [currency] = useState({ symbol: "$" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = import.meta.env.VITE_APP_API_URL;

  // Fetch group details from API
  const fetchGroupDetails = async () => {
    if (!groupId) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axios.get(`${apiUrl}/api/groups/${groupId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setGroupDetails({
        id: res.data.GroupID,
        name: res.data.name,
        members: res.data.members || [],
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      });
    } catch (error) {
      console.error("Error fetching group details:", error);
      toast.error("Failed to fetch group details");
    }
  };

  // Fetch expenses for the group
  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !groupId) throw new Error("No token or group ID found");
      const response = await axios.get(`${apiUrl}/api/expenses/group/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const groupExpenses: Expense[] = response.data.map((expense: any) => ({
        id: expense.ExpenseID,
        ExpenseID: expense.ExpenseID,
        name: expense.name,
        description: expense.description,
        groupId: expense.groupId,
        amount: expense.amount,
        category: expense.category ?? "other",
        receiptImage: expense.receiptImage || "",
        currency: expense.currency || "USD",
        paidBy: expense.paidBy,
        date: new Date(expense.date),
        splits: expense.splits || [],
        createdAt: new Date(expense.createdAt),
        updatedAt: new Date(expense.updatedAt),
      }));
      setExpenses(groupExpenses);
      setFilteredExpenses(groupExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch settlement transactions for the group
  const fetchSettlementTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !groupId) return;
      const response = await fetch(`${apiUrl}/api/transactions/group/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setSettlementTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error loading settlement transactions");
    }
  };

  // Settle debts by calling the API
  const handleSettleDebts = async () => {
    setIsSettling(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !groupId) throw new Error("No token or group ID found");
      const response = await fetch(`${apiUrl}/api/groups/${groupId}/settle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Settlement failed");
      const result = await response.json();
      setSettlementTransactions(result.transactions);
      toast.success("Debts settled successfully!", {
        description: `${result.transactions.length} transactions created`,
      });
    } catch (error) {
      console.error("Settlement error:", error);
      toast.error("Failed to settle debts. Please try again.");
    } finally {
      setIsSettling(false);
    }
  };

  // Filtering expenses based on search and group filter
  const applyFilters = (search: string, group: string) => {
    let filtered = [...expenses];
    if (group !== "all") {
      filtered = filtered.filter((expense) => expense.groupId === group);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (expense) =>
          expense.name.toLowerCase().includes(searchLower) ||
          (expense.category &&
            expense.category.toLowerCase().includes(searchLower))
      );
    }
    setFilteredExpenses(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, groupFilter);
  };

  const handleFilterChange = (group: string) => {
    setGroupFilter(group);
    applyFilters(searchTerm, group);
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  // AR Scan functionality
  const handleARScan = () => {
    setIsARScanOpen(true);
  };

  // Payment processing (stub function)
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

  // Create a new expense (called when ExpenseForm onSave is triggered)
  const handleCreateExpense = async (newExpenseData: Partial<Expense>) => {
    closeForm();
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/expenses`, newExpenseData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Expense created:", response.data);
      await fetchExpenses();
      toast.success("Expense added successfully");
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error("Failed to add expense");
    } finally {
      setIsLoading(false);
    }
  };

  // Payment dialog trigger
  const handleProceedToPayment = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setPaymentModalOpen(true);
  };

  // Invite dialog functions (for inviting new members)
  const sendInvite = async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    setIsLoading(true);
    const templateParams = {
      user_email: inviteEmail,
      invite_link: `${apiUrl}/invite?group=${groupId}`,
    };
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_USER_ID
      );
      setIsLoading(false);
      setInviteModalOpen(false);
      setInviteEmail("");
      toast.success("Invitation sent", {
        description: `An invitation has been sent to ${inviteEmail}`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      setIsLoading(false);
      toast.error("Failed to send invitation");
    }
  };

  useEffect(() => {
    if (groupId) {
      setGroupFilter(groupId);
      fetchGroupDetails();
      fetchExpenses();
      fetchSettlementTransactions();
    }
  }, [groupId]);

  // Filter duplicate members (only include those with valid email)
  const validMembers = groupDetails?.members.filter((member: any) => member.email) || [];
  const uniqueMembers = Array.from(new Map(validMembers.map((member: any) => [member.email, member])).values());

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Expenses for: {groupDetails ? groupDetails.name : "Loading..."}
        </h1>
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
          <Button onClick={handleARScan} className="rounded-md">
            <Camera className="mr-2 h-4 w-4" />
            AR Scan
          </Button>
        </div>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={(val) => setSelectedTab(val)}
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
                  <SelectItem value={groupId ?? "all"}>Current Group</SelectItem>
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
              {filteredExpenses.map((expense: Expense) => (
                <ExpenseCard
                  key={expense.ExpenseID || expense.id}
                  expense={expense}
                  members={[]} // Adjust if member data is available
                  onPaymentClick={() =>
                    handleProceedToPayment(expense.ExpenseID || expense.id)
                  }
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

        <TabsContent value="payments" className="mt-4 space-y-4">
          <SettleDebtsCard 
            transactions={settlementTransactions}
            onSettle={handleSettleDebts}
            isSettling={isSettling}
            currency={currency}
          />
          {settlementTransactions.length > 0 ? (
            <div className="space-y-4">
              {settlementTransactions.map((transaction) => (
                <div 
                  key={transaction.TransactionID}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium">{transaction.From}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{transaction.To}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      {currency.symbol}
                      {parseFloat(transaction.Amount).toFixed(2)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.Status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {transaction.Status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/40 rounded-lg p-6 text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium text-lg mb-2">No Settlement Transactions</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Settle group debts to see transaction history here.
              </p>
            </div>
          )}
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
            {groupDetails ? (
              <ExpenseForm
                group={groupDetails}
                onSave={handleCreateExpense}
                onCancel={closeForm}
              />
            ) : (
              <div className="flex justify-center items-center h-40">
                <Loader size="lg" />
              </div>
            )}
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
                    <Input placeholder="yourname@upi" className="rounded-r-none" />
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
                <Button className="w-full" onClick={processPayment} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Pay with UPI
                    </>
                  )}
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
                <Button className="w-full" onClick={processPayment} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay with Card
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white shadow-lg border border-gray-200">
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
                <Select defaultValue={groupId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={groupId ?? "all"}>Current Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message (Optional)</label>
                <Input placeholder="Join our expense group for the trip!" />
              </div>
            </div>
            <Button className="w-full" onClick={sendInvite} disabled={isLoading}>
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

      {/* AR Scan Dialog */}
      <ARScanDialog isOpen={isARScanOpen} onClose={() => setIsARScanOpen(false)} />
    </AppLayout>
  );
};

export default Expenses;
