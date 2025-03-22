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
import { Switch } from "@/components/ui/switch";
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

const ExpenseForm = ({
  group,
  onSave,
  onCancel,
  selectedImage = null,
  onUploadReceipt,
}: ExpenseFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  // PaidBy is already stored in state
  const [paidBy, setPaidBy] = useState(group.members[0].id);
  // Add state for selected category
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategory>("food");
  const [splitEqually, setSplitEqually] = useState(true);
  const [currency, setCurrency] = useState({ code: "USD", symbol: "$" });
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [receiptImage, setReceiptImage] = useState<string | null>(
    selectedImage
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = () => {
    if (onUploadReceipt) {
      onUploadReceipt();
    } else if (fileInputRef.current) {
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

    // FormData now picks up our hidden inputs
    const formData = new FormData(e.currentTarget);

    // Basic form data
    const expenseName = formData.get("expense-name") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const date = new Date(formData.get("date") as string);
    // These values will now be provided via hidden inputs:
    const category = formData.get("category") as ExpenseCategory;
    const paidByValue = formData.get("paidBy") as string;
    const splitEquallyValue = formData.get("splitEqually") === "true";

    console.log("FormData values:", {
      expenseName,
      amount,
      date,
      category,
      paidByValue,
      splitEquallyValue,
    });

    // Validate required fields
    if (!expenseName || isNaN(amount) || !date || !category || !paidByValue) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Process splits for each group member
    const splits = group.members.map((member) => {
      const memberSplit = splitEquallyValue
        ? parseFloat((amount / group.members.length).toFixed(2))
        : parseFloat(formData.get(`split-${member.id}`) as string);
      return {
        memberId: member.id,
        amount: memberSplit,
        paid: member.id === paidByValue,
      };
    });

    // Construct expense object
    const expenseData = {
      ExpenseID: `exp-${Date.now()}`,
      name: expenseName,
      amount,
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
        {/* The form element wraps all inputs including our hidden ones */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
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
                  <span className="text-base font-medium">
                    {currency.symbol}
                  </span>
                )}
              </div>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
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
              onValueChange={(value) =>
                setSelectedCategory(value as ExpenseCategory)
              }
            >
              <SelectTrigger id="category">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger id="paidBy">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {group.members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hidden inputs for category and paidBy */}
          <input type="hidden" name="category" value={selectedCategory} />
          <input type="hidden" name="paidBy" value={paidBy} />

          {/* Receipt Image */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="receipt">Receipt Image (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImageUpload}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Receipt
              </Button>
              {/* Adding a name here is optional if you want it in the formData */}
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
          <input
            type="hidden"
            name="splitEqually"
            value={splitEqually.toString()}
          />

          {/* Split Between Members */}
          <div className="space-y-3 md:col-span-2">
            <Label>Split Between</Label>
            {group.members.map((member: Member) => (
              <div
                key={member.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                {!splitEqually ? (
                  <div className="relative w-24">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      name={`split-${member.id}`}
                      className="pl-8"
                      placeholder="0.00"
                      required
                    />
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Equal share
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit button inside the form */}
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
