import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  PlusCircle,
  Mail,
  CreditCard,
  UserPlus,
  Smartphone,
  Camera,
  Search,
  Menu,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseCard from "@/components/expenses/ExpenseCard";
import axios from "axios";
import ARScanDialog from "@/components/arscan/ARScanDialogue";
import { SettleDebtsCard } from "@/components/settledebt/SettleDebtsCard";
import { Expense, Group, Transaction } from "@/utils/mockData";
import { ErrorBoundary } from "@/components/errorr/ErrorrBoundary";
import { ChatRoom } from "@/components/chatroom/ChatRoom";
import emailjs from "emailjs-com";

// interface MemberMap {
//   [key: string]: { name: string; email: string };
// }

const Expenses: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [groupDetails, setGroupDetails] = useState<Group | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("expenses");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedExpenseId, ] = useState<string | null>(null);
  const [isARScanOpen, setIsARScanOpen] = useState(false);
  const [settlementTransactions, setSettlementTransactions] = useState<Transaction[]>([]);
  const [isSettling, setIsSettling] = useState(false);
  const [currency] = useState({ symbol: "$" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const fileInputRef = useRef<HTMLInputElement>(null);

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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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

  // Filtering expenses based on search term
  const applyFilters = (search: string) => {
    let filtered = [...expenses];
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
    applyFilters(value);
  };

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

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

  // Create a new expense (handled by ExpenseForm)
  const handleCreateExpense = (createdExpense: Expense) => {
    setExpenses((prev) => [...prev, createdExpense]);
    setFilteredExpenses((prev) => [...prev, createdExpense]);
    toast.success("Expense added successfully");
  };

  // // Payment dialog trigger
  // const handleProceedToPayment = (expenseId: string) => {
  //   setSelectedExpenseId(expenseId);
  //   setPaymentModalOpen(true);
  // };

  // Send invite function
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
      fetchGroupDetails();
      fetchExpenses();
      fetchSettlementTransactions();
    }
  }, [groupId]);

  // Compute memberMap to pass to SettleDebtsCard
  const memberMap =
    groupDetails?.members.reduce((map: any, member: any) => {
      if (member.email) {
        map[member.email] = { name: member.name, email: member.email };
      }
      return map;
    }, {}) || {};

  // Define payment amounts (example values)
  const paymentAmount = 24.99;
  const processingFee = 0.5;
  const totalPayment = paymentAmount + processingFee;

  // // Mobile ExpenseCard component (without AR Scan button)
  // const MobileExpenseCard = ({ expense }: { expense: Expense }) => {
  //   return (
  //     <div
  //       className="bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100 hover:shadow-md transition-shadow duration-200"
  //       aria-label={`Expense ${expense.name}`}
  //     >
  //       <div className="flex justify-between items-center mb-2">
  //         <div className="flex items-center">
  //           <div className="p-2 bg-primary-50 rounded-md mr-3">
  //             {expense.category === "food" ? (
  //               <span className="text-xl">🍔</span>
  //             ) : expense.category === "entertainment" ? (
  //               <span className="text-xl">🎬</span>
  //             ) : (
  //               <span className="text-xl">📦</span>
  //             )}
  //           </div>
  //           <div>
  //             <h3 className="font-medium text-base">{expense.name}</h3>
  //             <p className="text-xs text-gray-500">
  //               {expense.date.toLocaleDateString()}
  //             </p>
  //           </div>
  //         </div>
  //         <div className="text-right">
  //           <p className="font-bold text-base">
  //             {currency.symbol}{Number(expense.amount).toFixed(2)}
  //           </p>
  //         </div>
  //       </div>
  //       <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
  //         <div className="flex items-center text-xs text-gray-600">
  //           <span>Paid by</span>
  //           <span className="ml-1 px-2 py-1 bg-gray-100 rounded-full">
  //             {expense.paidBy}
  //           </span>
  //         </div>
  //         <div className="flex gap-1">
  //           <Button
  //             variant="ghost"
  //             size="sm"
  //             className="text-xs px-2 py-1 h-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
  //           >
  //             Details
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <AppLayout>
      {/* Responsive header */}
      <div className="sticky top-0 z-10 bg-gray-50 p-4 mb-4 rounded-b-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold truncate pr-2">
            {groupDetails ? groupDetails.name : "Loading..."}
          </h1>
          {/* Desktop action buttons */}
          <div className="hidden md:flex md:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 hover:bg-gray-100"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={openForm}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 hover:bg-gray-100"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Expense
            </Button>
            {/* Global AR Scan button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsARScanOpen(true)}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 hover:bg-gray-100"
            >
              <Camera className="mr-2 h-4 w-4" />
              AR Scan
            </Button>
          </div>
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="p-1 md:hidden transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mobile menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="bg-white absolute right-4 top-14 shadow-lg rounded-lg z-20 w-48 border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out">
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start mb-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 hover:bg-gray-100"
                onClick={() => {
                  setInviteModalOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 hover:bg-gray-100"
                onClick={() => {
                  openForm();
                  setMobileMenuOpen(false);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Expense
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 hover:bg-gray-100"
                onClick={() => {
                  setIsARScanOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Camera className="mr-2 h-4 w-4" />
                AR Scan
              </Button>
            </div>
          </div>
        )}
        {/* Tab selector */}
        <div className="grid grid-cols-3 gap-1 bg-gray-200 p-1 rounded-lg">
          {["expenses", "payments", "chat"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedTab === tab
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-pressed={selectedTab === tab}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {selectedTab === "expenses" && (
        <div className="px-4">
          {/* Search section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <div className="relative flex-grow md:max-w-md">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 w-full bg-white"
                aria-label="Search expenses"
              />
          </div>

          {/* Floating action button for mobile */}
          <div className="fixed bottom-6 right-6 z-10 md:hidden">
            <Button
              onClick={openForm}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform duration-200 hover:scale-105"
              aria-label="Add expense"
            >
              <PlusCircle className="h-6 w-6" />
            </Button>
          </div>

          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : filteredExpenses.length > 0 ? (
            <div className="space-y-2">
              {filteredExpenses.map((expense, index) => (
                <ExpenseCard key={`${expense.id}-${index}`} expense={expense} members={groupDetails?.members || []} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <h3 className="font-medium text-lg mb-2">No Expenses Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try changing your search criteria"
                  : "Add your first expense to get started"}
              </p>
              <Button onClick={openForm} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
          )}
        </div>
      )}

      {selectedTab === "payments" && (
        <div className="px-4">
          <SettleDebtsCard
            transactions={settlementTransactions}
            onSettle={handleSettleDebts}
            isSettling={isSettling}
            currency={currency}
            memberMap={memberMap}
          />
        </div>
      )}

      {selectedTab === "chat" && (
        <div className="px-4 h-[calc(100vh-200px)]">
          {groupId ? (
            <ErrorBoundary>
              <ChatRoom groupId={groupId} />
            </ErrorBoundary>
          ) : (
            <div className="text-center">Loading chat...</div>
          )}
        </div>
      )}

      {/* Expense Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-white dark:bg-gray-900 shadow-lg rounded-lg mx-4 max-h-[90vh] overflow-auto">
          <VisuallyHidden asChild>
            <DialogTitle>Add New Expense</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <DialogDescription>
              Fill out the form to add a new expense.
            </DialogDescription>
          </VisuallyHidden>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-bold mb-4">Add New Expense</h2>
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
        <DialogContent className="sm:max-w-[500px] mx-4 p-4">
          <VisuallyHidden asChild>
            <DialogTitle>Complete Payment</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <DialogDescription>
              Choose your preferred payment method.
            </DialogDescription>
          </VisuallyHidden>
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Complete Payment</h2>
              <p className="text-gray-500 text-sm">
                Choose your preferred payment method.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">
                  ${paymentAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">
                  Processing Fee:
                </span>
                <span className="font-medium">
                  ${processingFee.toFixed(2)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold">
                  ${totalPayment.toFixed(2)}
                </span>
              </div>
            </div>
            <Tabs defaultValue="upi" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upi">UPI</TabsTrigger>
                <TabsTrigger value="card">Card</TabsTrigger>
              </TabsList>
              <TabsContent value="upi" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="upi-id">UPI ID</label>
                  <div className="flex">
                    <Input
                      id="upi-id"
                      placeholder="yourname@upi"
                      className="rounded-r-none"
                    />
                    <Button className="rounded-l-none">Verify</Button>
                  </div>
                </div>
                <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Smartphone className="h-10 w-10 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-gray-500">
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
                  <label className="text-sm font-medium" htmlFor="card-number">Card Number</label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="expiry-date">Expiry Date</label>
                    <Input id="expiry-date" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="cvc">CVC</label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={processPayment}
                  disabled={isLoading}
                >
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
        <DialogContent className="sm:max-w-[500px] bg-white shadow-lg border border-gray-200 mx-4 p-4">
          <VisuallyHidden asChild>
            <DialogTitle>Invite Member</DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden asChild>
            <DialogDescription>
              Send an invitation to join your expense group.
            </DialogDescription>
          </VisuallyHidden>
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Invite Member</h2>
              <p className="text-gray-500 text-sm">
                Send an invitation to join your expense group.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="invite-email">Email Address</label>
                <Input
                  id="invite-email"
                  placeholder="friend@example.com"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="invite-message">
                  Message (Optional)
                </label>
                <Input id="invite-message" placeholder="Join our expense group for the trip!" />
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

      {/* AR Scan Dialog */}
      <ARScanDialog
        isOpen={isARScanOpen}
        onClose={() => setIsARScanOpen(false)}
      />
    </AppLayout>
  );
};

export default Expenses;
