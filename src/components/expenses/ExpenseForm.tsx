import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Hash,
  Tag,
  Image as ImageIcon,
  Camera,
  X,
  FileText,
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
  // Optional callback for AR Scan
  onARScan?: () => void;
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
  onARScan,
}: ExpenseFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategory>("food");
  const [splitMethod, setSplitMethod] = useState<SplitMethod>("equal");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [splitPercentages, setSplitPercentages] = useState<{ [key: string]: string }>({});
  const [splitAmounts, setSplitAmounts] = useState<{ [key: string]: string }>({});
  const [currency, setCurrency] = useState({ code: "USD", symbol: "$" });
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  // Store the image URL and file name for receipt preview.
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(selectedImage);
  const [receiptFileName, setReceiptFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (group && group.id && group.members) {
      group.members.forEach((member: any) => {
        console.log("Group member email:", member.email);
      });
    }
  }, [group]);

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        setIsDetectingLocation(true);
        const detectedCurrency = await detectUserCurrency();
        setCurrency(detectedCurrency);
        toast.success(
          `Currency set to ${detectedCurrency.code} based on your location`
        );
      } catch (error) {
        console.error("Failed to detect currency:", error);
        toast.error("Could not detect your location. Using default currency.");
      } finally {
        setIsDetectingLocation(false);
      }
    };
    detectCurrency();
  }, []);

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
    }
  }, [expenseAmount, group.members, splitMethod]);

  const handleUploadReceipt = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    if (onUploadReceipt) {
      onUploadReceipt();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setReceiptImageUrl(imageUrl);
      setReceiptFileName(file.name);
      toast.success("Receipt uploaded successfully", {
        description: "Your receipt has been attached to the expense",
      });
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptImageUrl(null);
    setReceiptFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleViewReceipt = () => {
    if (receiptImageUrl) {
      window.open(receiptImageUrl, "_blank");
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

    if (!expenseName || isNaN(amt) || !date || !category) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Automatically set paidBy based on the authenticated user's email.
    const currentUserEmail = localStorage.getItem("email");
    const paidByValue =
      group.members.find((member: Member) => member.email === currentUserEmail)
        ?.id || "";

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
      receiptImage: receiptImageUrl || undefined,
    };

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
      onSave(createdExpense.expense);
      toast.success("Expense added successfully");
    } catch (error: any) {
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
        {/* Upload Receipt Row with Clear Field */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUploadReceipt}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Upload Receipt
            </Button>
            {receiptFileName && (
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <button
                  onClick={handleViewReceipt}
                  className="text-black underline"
                  title="View Receipt"
                >
                  {receiptFileName}
                </button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-black"
                  onClick={handleRemoveReceipt}
                >
                  <X className="h-4 w-4 mr-1" />
                </Button>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Fill Bill Automatically
          </div>
          <input
            type="file"
            name="receipt"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

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

          {/* Category and Split Method in one row */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) =>
                  setSelectedCategory(value as ExpenseCategory)
                }
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
            <div className="space-y-2">
              <Label>Split Method</Label>
              <Select
                value={splitMethod}
                onValueChange={(value) => setSplitMethod(value as SplitMethod)}
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

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Textarea
                id="description"
                name="description"
                placeholder="Add notes or details about this expense"
                className="pl-10 min-h-24 max-h-40 overflow-y-auto"
              />
            </div>
          </div>

          <Separator className="md:col-span-2" />

          {/* Bottom Action Row: AR Scan (left) and Save Expense (right) */}
          <div className="md:col-span-2 flex justify-between items-center">
            {onARScan && (
              <Button onClick={onARScan} variant="outline" className="rounded-md">
                <Camera className="mr-2 h-4 w-4" />
                AR Scan
              </Button>
            )}
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
