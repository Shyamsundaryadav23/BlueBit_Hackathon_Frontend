import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Users, Info, Plus, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getRandomId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CustomButton from "../ui/CustomButton";

interface GroupFormProps {
  onSave: () => void;
  onCancel: () => void;
}

// Helper function to get a value from localStorage ensuring no "undefined" string is returned.
const getStoredValue = (key: string) => {
  const value = localStorage.getItem(key);
  return value && value !== "undefined" ? value : "";
};

const GroupForm = ({ onSave, onCancel }: GroupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [groupInfo, setGroupInfo] = useState({
    name: "",
    description: "",
  });
  // Store invited member emails entered by the user.
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  // Track the current input value for inviting a member.
  const [invitedEmailInput, setInvitedEmailInput] = useState("");

  // Automatically include the current user's details from localStorage.
  const currentUser = {
    id: getStoredValue("userId") || getRandomId(),
    email: getStoredValue("email"),
    name: getStoredValue("name"),
    avatar: getStoredValue("picture"),
  };

  const handleGroupInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setGroupInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleInvitedEmailInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInvitedEmailInput(e.target.value);
  };

  // Add the email from the input field to the invitedEmails array.
  const handleAddInvitedEmail = () => {
    const email = invitedEmailInput.trim();
    if (email === "") return;

    // Don't allow adding the current user's email
    if (email === currentUser.email) {
      toast.error("You are already a member of this group");
      setInvitedEmailInput("");
      return;
    }

    if (invitedEmails.includes(email)) {
      toast.error("This email has already been added");
      setInvitedEmailInput("");
      return;
    }

    setInvitedEmails((prev) => [...prev, email]);
    toast.success(`Member ${email} added to invitation list`);
    setInvitedEmailInput("");
  };

  // Remove an email from the invited list
  const handleRemoveInvitedEmail = (emailToRemove: string) => {
    setInvitedEmails(invitedEmails.filter((email) => email !== emailToRemove));
  };

  // Function to send verification email using EmailJS.
  const sendVerificationEmail = async (email: string, token: string) => {
    const verificationLink = `${
      import.meta.env.VITE_APP_API_URL
    }/token=${token}`;
    const emailParams = {
      user_email: email,
      verification_link: verificationLink,
    };
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailParams,
        import.meta.env.VITE_EMAILJS_USER_ID
      );
      console.log("Verification email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // IMPORTANT: Create members array WITHOUT the current user
      // The backend will add the current user automatically
      const members = invitedEmails.map((email) => ({
        id: getRandomId(),
        email: email,
        name: null,
        avatar: null,
      }));

      const groupData = {
        name: groupInfo.name,
        description: groupInfo.description || "",
        members: members, // Only send invited members, not current user
        createdAt: new Date().toISOString(),
      };

      const apiUrl = `http://127.0.0.1:5000/api/groups`;
      console.log("Members count:", members.length);
      console.log("Group Data:", groupData);

      const token = localStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Group created successfully");

        // Send verification emails
        for (const email of invitedEmails) {
          const verificationToken = btoa(email);
          await sendVerificationEmail(email, verificationToken);
        }

        onSave();
      } else {
        toast.error(result.error || "Failed to create group");
      }
    } catch (error) {
      console.error("Error during group creation:", error);
      toast.error("An error occurred while creating the group");
    } finally {
      setIsLoading(false);
    }
  };

  // Pressing Enter in the email input field should add the email
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInvitedEmail();
    }
  };

  return (
    <Card className="bg-white border-none shadow-subtle">
      <CardHeader>
        <CardTitle className="text-xl">Create New Group</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                value={groupInfo.name}
                onChange={handleGroupInfoChange}
                placeholder="Vacation, Roommates, etc."
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <div className="relative">
              <Info className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Textarea
                id="description"
                value={groupInfo.description}
                onChange={handleGroupInfoChange}
                placeholder="What is this group for?"
                className="pl-10 min-h-24"
              />
            </div>
          </div>
          {/* Invite Members Section */}
          <div className="space-y-2">
            <Label>Invite Members</Label>
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter member email"
                  value={invitedEmailInput}
                  onChange={handleInvitedEmailInputChange}
                  onKeyDown={handleKeyDown}
                  className="pl-10 w-full"
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddInvitedEmail}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Display current user as first member */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Group Members:</p>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Avatar className="h-8 w-8">
                  {currentUser.avatar ? (
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {getInitials(currentUser.name || "You")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {currentUser.name || "You"} (You)
                  </span>
                  <span className="text-xs text-gray-500">
                    {currentUser.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Display invited emails */}
            {invitedEmails.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Invited Members:</p>
                <ul className="space-y-2">
                  {invitedEmails.map((email, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {email.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{email}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInvitedEmail(email)}
                        className="h-7 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
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
          Create Group
        </CustomButton>
      </CardFooter>
    </Card>
  );
};

export default GroupForm;