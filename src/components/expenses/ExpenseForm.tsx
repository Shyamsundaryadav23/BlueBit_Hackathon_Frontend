// src/components/expenses/ExpenseForm.tsx
import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Hash,
  Users,
  FileText,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CustomButton from "../ui/CustomButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpenseCategory, Group, Member } from "@/utils/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { detectUserCurrency } from "@/utils/locationUtils";

interface ExpenseFormProps {
  group: Group;
  onSave: (expense: any) => void;
  onCancel: () => void;
  selectedImage?: string | null;
  onUploadReceipt?: () => void;
}

const categories: ExpenseCategory[] = [
  "food",
  "transportation",
  "entertainment",
  "housing",
  "utilities",
  "travel",
  "shopping",
  "health",
  "other",
];

type SplitMethod = "equal" | "percentage" | "manual";

const ExpenseForm = ({
  group,
  onSave,
  onCancel,
  selectedImage = null,
  onUploadReceipt,
}: ExpenseFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  // Safely initialize paidBy; if no member exists, default to an empty string.
  const [paidBy, setPaidBy] = useState(
    (group.members && group.members.length > 0 && group.members[0].id) || ""
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategory>("food");
  const [splitMethod, setSplitMethod] = useState<SplitMethod>("equal");
  const [expenseAmount, setExpenseAmount] = useState("");
  // For percentage/manual splits, store values per member as strings.
  const [splitPercentages, setSplitPercentages] = useState<{ [key: string]: string }>({});
  const [splitAmounts, setSplitAmounts] = useState<{ [key: string]: string }>({});
  const [currency, setCurrency] = useState({ code: "USD", symbol: "$" });
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [receiptImage, setReceiptImage] = useState<string | null>(selectedImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Log received group details and fetch full group data from API.
  useEffect(() => {
    console.log("ExpenseForm: Received group prop:", group);
    if (group && group.id) {
      fetch(`${import.meta.env.VITE_APP_API_URL}/api/groups/${group.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched group details from API:", data);
          if (data.members && data.members.length > 0) {
            data.members.forEach((member: any) => {
              console.log("Member email:", member.email);
            });
          } else {
            console.log("Group has no members (from API).");
          }
        })
        .catch((err) => console.error("Error fetching group details:", err));
    } else {
      console.log("No valid group provided to ExpenseForm");
    }
  }, [group]);

  // Detect user currency on mount.
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        setIsDetectingLocation(true);
        const detectedCurrency = await detectUserCurrency();
        setCurrency(detectedCurrency);
        toast.success(`Currency set to ${detectedCurrency.code} based on your location`);
      } catch (error) {
        console.error("Failed to detect currency:", error);
        toast.error("Could not detect your location. Using default currency.");
      } finally {
        setIsDetectingLocation(false);
      }
    };
    detectCurrency();
  }, []);

  // Update equal splits when expenseAmount changes (for equal split method).
  useEffect(() => {
    if (group.members.length > 0 && expenseAmount && splitMethod === "equal") {
      const amt = parseFloat(expenseAmount);
      const equalPercentage = (100 / group.members.length).toFixed(2);
      const equalAmount = (amt / group.members.length).toFixed(2);
      const newPercentages: { [key: string]: string } = {};
      const newAmounts: { [key: string]: string } = {};
      group.members.forEach((member) => {
        newPercentages[member.id] = equalPercentage;
        newAmounts[member.id] = equalAmount;
      });
      setSplitPercentages(newPercentages);
      setSplitAmounts(newAmounts);
      console.log("Equal splits updated:", newPercentages, newAmounts);
    }
  }, [expenseAmount, group.members, splitMethod]);

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
      setReceiptImage(imageUrl);
      toast.success("Receipt uploaded successfully", {
        description: "Your receipt image has been attached to the expense",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const expenseName = formData.get("expense-name") as string;
    const amt = parseFloat(expenseAmount);
    const date = new Date(formData.get("date") as string);
    const category = formData.get("category") as ExpenseCategory;
    const paidByValue = formData.get("paidBy") as string;

    console.log("FormData values:", {
      expenseName,
      amt,
      date,
      category,
      paidByValue,
      splitMethod,
    });

    if (!expenseName || isNaN(amt) || !date || !category || !paidByValue) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    let splits;
    if (splitMethod === "equal") {
      splits = group.members.map((member) => ({
        memberId: member.id,
        amount: parseFloat((amt / group.members.length).toFixed(2)),
        paid: member.id === paidByValue,
      }));
    } else if (splitMethod === "percentage") {
      const totalPercentage = group.members.reduce((sum, member) => {
        return sum + parseFloat(splitPercentages[member.id] || "0");
      }, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast.error("Total percentage must equal 100%");
        setIsLoading(false);
        return;
      }
      splits = group.members.map((member) => ({
        memberId: member.id,
        amount: parseFloat((amt * (parseFloat(splitPercentages[member.id]) / 100)).toFixed(2)),
        paid: member.id === paidByValue,
      }));
    } else if (splitMethod === "manual") {
      const totalManual = group.members.reduce((sum, member) => {
        return sum + parseFloat(splitAmounts[member.id] || "0");
      }, 0);
      if (Math.abs(totalManual - amt) > 0.01) {
        toast.error("Sum of manual splits must equal total amount");
        setIsLoading(false);
        return;
      }
      splits = group.members.map((member) => ({
        memberId: member.id,
        amount: parseFloat(splitAmounts[member.id]),
        paid: member.id === paidByValue,
      }));
    }

    const expenseData = {
      ExpenseID: `exp-${Date.now()}`,
      name: expenseName,
      amount: amt,
      date: date.toISOString(),
      category,
      currency: currency.code,
      groupId: group.id,
      paidBy: paidByValue,
      splits,
      description: (formData.get("description") as string) || undefined,
      receiptImage: receiptImage || undefined,
    };

    console.log("Constructed expenseData:", expenseData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(expenseData),
        }
      );

      if (!response.ok) throw new Error("Failed to create expense");

      const createdExpense = await response.json();
      console.log("Expense created:", createdExpense);
      onSave(createdExpense.expense);
      toast.success("Expense added successfully");
    } catch (error: any) {
      console.error("Error saving expense:", error);
      toast.error(error.message || "Failed to save expense");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-subtle">
      <CardHeader>
        <CardTitle className="text-xl">Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expense Name */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="expense-name">Expense Name</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="expense-name"
                name="expense-name"
                placeholder="Dinner, Movie Tickets, etc."
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground flex items-center justify-center">
                {isDetectingLocation ? (
                  <div className="h-4 w-4 border-2 border-t-transparent border-muted-foreground rounded-full animate-spin"></div>
                ) : (
                  <span className="text-base font-medium">{currency.symbol}</span>
                )}
              </div>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                console.log("Category changed:", value);
                setSelectedCategory(value as ExpenseCategory);
              }}
            >
              <SelectTrigger id="category" className="bg-white">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Paid By */}
          <div className="space-y-2 opacity-100">
            <Label htmlFor="paidBy">Paid By</Label>
            <Select
              value={paidBy}
              onValueChange={(value) => {
                console.log("Paid By changed:", value);
                setPaidBy(value);
              }}
            >
              <SelectTrigger id="paidBy" className="bg-white  w-full">
                <Users className="mr-2 h-4 w-4 text-muted" />
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {(group.members || []).map((member: Member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground ml-8">
                        {member.email}
                      </p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hidden inputs for category and paidBy */}
          <input type="hidden" name="category" value={selectedCategory} />
          <input type="hidden" name="paidBy" value={paidBy} />

          {/* Split Method Dropdown */}
          <div className="space-y-2 md:col-span-2">
            <Label>Split Method</Label>
            <Select
              value={splitMethod}
              onValueChange={(value) => {
                console.log("Split Method changed:", value);
                setSplitMethod(value as SplitMethod);
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select split method" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="equal">Equal</SelectItem>
                <SelectItem value="percentage">By Percentage</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Split Between Members */}
          <div className="space-y-3 md:col-span-2">
            <Label>Split Between</Label>
            {group.members.map((member: Member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                {splitMethod === "equal" && (
                  <div className="text-sm text-muted-foreground">
                    {expenseAmount
                      ? `$${(parseFloat(expenseAmount) / group.members.length).toFixed(2)}`
                      : "Equal share"}
                  </div>
                )}
                {splitMethod === "percentage" && (
                  <div className="relative w-24">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={splitPercentages[member.id] || ""}
                      onChange={(e) =>
                        setSplitPercentages({
                          ...splitPercentages,
                          [member.id]: e.target.value,
                        })
                      }
                      className="pl-2 bg-white"
                      placeholder="%"
                      required
                    />
                    <span className="absolute right-2 top-2 text-sm">%</span>
                  </div>
                )}
                {splitMethod === "manual" && (
                  <div className="relative w-24">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={splitAmounts[member.id] || ""}
                      onChange={(e) =>
                        setSplitAmounts({
                          ...splitAmounts,
                          [member.id]: e.target.value,
                        })
                      }
                      className="pl-2 bg-white"
                      placeholder="0.00"
                      required
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Receipt Image */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="receipt">Receipt Image (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUploadReceipt}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Receipt
              </Button>
              <input
                type="file"
                name="receipt"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {receiptImage && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <img
                  src={receiptImage}
                  alt="Receipt"
                  className="w-full h-auto max-h-40 object-contain"
                />
                <div className="bg-muted p-2 text-center text-xs text-muted-foreground">
                  Receipt image attached
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Textarea
                id="description"
                name="description"
                placeholder="Add notes or details about this expense"
                className="pl-10 min-h-24"
              />
            </div>
          </div>

          <Separator className="md:col-span-2" />

          {/* Hidden splitEqually input */}
          <input type="hidden" name="splitEqually" value="true" />

          {/* Submit button */}
          <div className="md:col-span-2 flex justify-end">
            <CustomButton type="submit" isLoading={isLoading}>
              Save Expense
            </CustomButton>
          </div>
        </form>
      </CardContent>
      <CardFooter className="hidden" />
    </Card>
  );
};

export default ExpenseForm;
