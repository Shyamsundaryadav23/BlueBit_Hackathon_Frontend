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
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>("food");
  const [splitMethod, setSplitMethod] = useState<SplitMethod>("equal");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [splitPercentages, setSplitPercentages] = useState<{ [key: string]: string }>({});
  const [splitAmounts, setSplitAmounts] = useState<{ [key: string]: string }>({});
  const [currency, setCurrency] = useState({ code: "USD", symbol: "$" });
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  // Receipt preview state
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(selectedImage);
  const [receiptFileName, setReceiptFileName] = useState<string>("");

  // New controlled states for auto-filled fields
  const [expenseName, setExpenseName] = useState("");
  const [date, setDate] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use a safe members variable (fallback to empty array if undefined)
  const members = group.members || [];

  // Log group members for debugging
  useEffect(() => {
    if (group && members.length > 0) {
      members.forEach((member: any) => {
        console.log("Group member email:", member.email);
      });
    }
  }, [group, members]);

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

  // When using equal split, update percentages and amounts based on expenseAmount.
  useEffect(() => {
    if (members.length > 0 && expenseAmount && splitMethod === "equal") {
      const amt = parseFloat(expenseAmount);
      const equalPercentage = (100 / members.length).toFixed(2);
      const equalAmount = (amt / members.length).toFixed(2);
      const newPercentages: { [key: string]: string } = {};
      const newAmounts: { [key: string]: string } = {};
      members.forEach((member) => {
        newPercentages[member.id] = equalPercentage;
        newAmounts[member.id] = equalAmount;
      });
      setSplitPercentages(newPercentages);
      setSplitAmounts(newAmounts);
    }
  }, [expenseAmount, members, splitMethod]);

  const callOCRApi = async (file: File) => {
    const formData = new FormData();
    formData.append("receipt", file);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/ocr`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("OCR API failed");
      return await response.json();
    } catch (error) {
      console.error("OCR API error:", error);
      toast.error("OCR API failed to process receipt. Please fill fields manually.");
      return null;
    }
  };

  const handleUploadReceipt = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    if (onUploadReceipt) {
      onUploadReceipt();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setReceiptImageUrl(imageUrl);
      setReceiptFileName(file.name);
      toast.success("Receipt uploaded successfully", {
        description: "Your receipt has been attached to the expense",
      });

      // Call OCR API and fill form fields automatically
      const ocrData = await callOCRApi(file);
      if (ocrData) {
        const missingFields: string[] = [];
        if (ocrData.expenseName) {
          setExpenseName(ocrData.expenseName);
        } else {
          missingFields.push("Expense Name");
        }
        if (ocrData.amount) {
          setExpenseAmount(ocrData.amount.toString());
        } else {
          missingFields.push("Amount");
        }
        if (ocrData.date) {
          // Assuming the date is provided in YYYY-MM-DD format
          setDate(ocrData.date);
        } else {
          missingFields.push("Date");
        }
        if (ocrData.category) {
          setSelectedCategory(ocrData.category);
        } else {
          missingFields.push("Category");
        }
        if (missingFields.length > 0) {
          toast.info(
            `Some fields could not be auto-filled: ${missingFields.join(
              ", "
            )}. Please fill them manually.`
          );
        }
      }
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
    // Prevent duplicate submissions.
    if (isLoading) return;
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    // Since we're using controlled inputs for expense name and date,
    // we override the values from formData with our state values.
    const expenseNameValue = expenseName || (formData.get("expense-name") as string);
    const amt = parseFloat(expenseAmount);
    const rawDate = date || (formData.get("date") as string);
    const category = formData.get("category") as ExpenseCategory;

    if (!expenseNameValue || isNaN(amt) || !rawDate || !category) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    let parsedDate: Date;
    if (rawDate.includes("-")) {
      parsedDate = new Date(rawDate);
    } else if (rawDate.includes("/")) {
      const [month, day, year] = rawDate.split("/");
      parsedDate = new Date(+year, +month - 1, +day);
    } else {
      parsedDate = new Date(rawDate);
    }

    if (isNaN(parsedDate.getTime())) {
      toast.error("Invalid date format. Please use YYYY-MM-DD or MM/DD/YYYY.");
      setIsLoading(false);
      return;
    }

    const currentUserEmail = localStorage.getItem("email");

    let splits;
    if (splitMethod === "equal") {
      splits = members.map((member) => ({
        memberId: member.email, // use email as the identifier
        amount: parseFloat((amt / members.length).toFixed(2)),
        paid: member.email === currentUserEmail,
      }));
    } else if (splitMethod === "percentage") {
      const totalPercentage = members.reduce((sum, member) => {
        return sum + parseFloat(splitPercentages[member.id] || "0");
      }, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast.error("Total percentage must equal 100%");
        setIsLoading(false);
        return;
      }
      splits = members.map((member) => ({
        memberId: member.email,
        amount: parseFloat((amt * (parseFloat(splitPercentages[member.id]) / 100)).toFixed(2)),
        paid: member.email === currentUserEmail,
      }));
    } else if (splitMethod === "manual") {
      const totalManual = members.reduce((sum, member) => {
        return sum + parseFloat(splitAmounts[member.id] || "0");
      }, 0);
      if (Math.abs(totalManual - amt) > 0.01) {
        toast.error("Sum of manual splits must equal total amount");
        setIsLoading(false);
        return;
      }
      splits = members.map((member) => ({
        memberId: member.email,
        amount: parseFloat(splitAmounts[member.id]),
        paid: member.email === currentUserEmail,
      }));
    }

    const expenseData = {
      ExpenseID: `exp-${Date.now()}`,
      name: expenseNameValue,
      amount: amt,
      date: parsedDate.toISOString(),
      category,
      currency: currency.code,
      GroupID: group.id,
      paidBy: currentUserEmail, // use email for paidBy
      splits,
      description: (formData.get("description") as string) || undefined,
      receiptImage: receiptImageUrl || undefined,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) throw new Error("Failed to create expense");

      const createdExpense = await response.json();
      onSave(createdExpense.expense);
      toast.success("Expense added successfully");
      
      // Automatically close the form after successful submission
      onCancel();
      
    } catch (error: any) {
      toast.error(error.message || "Failed to save expense");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter duplicate members (only include those with valid email)
  const validMembers = (group.members || []).filter((member: any) => member.email);
  const uniqueMembers = Array.from(
    new Map(validMembers.map((member: any) => [member.email, member])).values()
  );

  return (
    <Card className="border-none shadow-subtle">
      <CardHeader>
        <CardTitle className="text-xl">Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Upload Receipt Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" size="sm" onClick={handleUploadReceipt}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Upload Receipt
            </Button>
            {receiptFileName && (
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <button onClick={handleViewReceipt} className="text-black underline" title="View Receipt">
                  {receiptFileName}
                </button>
                <Button variant="destructive" size="sm" className="text-black" onClick={handleRemoveReceipt}>
                  <X className="h-4 w-4 mr-1" />
                </Button>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">Fill Bill Automatically</div>
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
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
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
                className="pl-10"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Category and Split Method */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as ExpenseCategory)}
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
              <input type="hidden" name="category" value={selectedCategory} />
            </div>
            <div className="space-y-2">
              <Label>Split Method</Label>
              <Select value={splitMethod} onValueChange={(value) => setSplitMethod(value as SplitMethod)}>
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
            {uniqueMembers.map((member: Member) => (
              <div key={member.email || member.id} className="flex items-center justify-between">
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
                      ? `${currency.symbol}${(parseFloat(expenseAmount) / uniqueMembers.length).toFixed(2)}`
                      : "Equal share"}
                  </div>
                )}
                {splitMethod === "percentage" && (
                  <div className="relative w-24">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
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

          {/* Bottom Action Row */}
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