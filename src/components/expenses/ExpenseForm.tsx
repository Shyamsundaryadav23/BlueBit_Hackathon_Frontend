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
import { Switch } from "@radix-ui/react-switch";
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
  onSave: (receiptImage?: string) => void;
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
  const [paidBy, setPaidBy] = useState(group.members[0].id);
  const [splitEqually, setSplitEqually] = useState(true);
  const [sendEmailLink, setSendEmailLink] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [currency, setCurrency] = useState({ code: "USD", symbol: "$" });
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [showEmailOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(selectedImage);

  useEffect(() => {
    // Detect user's currency based on geolocation when the component mounts
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
      setReceiptImage(imageUrl);
      toast.success("Receipt uploaded", {
        description: "Your receipt has been attached to this expense",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Here you might want to adjust the expense data based on whether
    // the expense was split equally or manually assigned per member.
    // For this example, we'll just simulate saving.

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Expense added successfully");
      onSave(receiptImage || undefined);
    }, 1000);
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
                type="number"
                value={totalAmount || ""}
                onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
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
            <Select defaultValue="food">
              <SelectTrigger id="category" className="w-full">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger id="paidBy" className="w-full">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {group.members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Receipt Image */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="receipt">Receipt Image (Optional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleImageUpload}>
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Receipt
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {(receiptImage || selectedImage) && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <img
                  src={receiptImage || selectedImage || ""}
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
                placeholder="Add notes or details about this expense"
                className="pl-10 min-h-24"
              />
            </div>
          </div>

          <Separator className="md:col-span-2" />

    {/* Split Equally */}
<div className="flex items-center justify-between md:col-span-2">
  <div className="space-y-0.5">
    <h3 className="font-medium">Split Equally</h3>
  </div>
  <Switch
  checked={splitEqually}
  onCheckedChange={setSplitEqually}
  className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-300 
    ${splitEqually ? "bg-blue-500" : "bg-gray-300"}`}
>
  <span
    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 transform 
      ${splitEqually ? "translate-x-6" : "translate-x-1"}`}
  />
</Switch>


</div>

<div className="space-y-4">
  <div className="space-y-3">
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
        {!splitEqually ? (
          <div className="relative w-24">
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              min="0"
              step="0.01"
              className="pl-8"
              placeholder="0.00"
            />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Equal share</div>
        )}
      </div>
    ))}
  </div>
</div>

              

{/* Email Notifications */}
<div className="pt-2 md:col-span-2">
  <div className="flex items-center justify-between mb-2">
    <div className="space-y-0.5">
      <h3 className="font-medium text-lg">Email Notifications</h3>
      <p className="text-sm text-muted-foreground">
        Notify group members about this expense
      </p>
    </div>
    <Switch
      checked={sendEmailLink}
      onCheckedChange={setSendEmailLink}
      defaultChecked
      className="relative inline-flex items-center w-12 h-6 transition-colors duration-300 bg-gray-300 rounded-full focus:outline-none data-[state=checked]:bg-blue-500"
    >
      <span
        className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 data-[state=checked]:translate-x-6"
      />
    </Switch>
  </div>

  {showEmailOptions && (
    <div className="mt-2 p-3 bg-muted/40 rounded-md">
      <p className="text-sm text-muted-foreground mb-2">
        Email notifications will be sent to:
      </p>
      <div className="space-y-2">
        {group.members.map((member) => (
          <div key={member.id} className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={member.avatar} />
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{member.email}</span>
          </div>
          // updateed
        ))}
      </div>
    </div>
  )}
</div>


        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <CustomButton variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </CustomButton>
        <CustomButton onClick={handleSubmit} isLoading={isLoading}>
          Save Expense
        </CustomButton>
      </CardFooter>
    </Card>
  );
};

export default ExpenseForm;
