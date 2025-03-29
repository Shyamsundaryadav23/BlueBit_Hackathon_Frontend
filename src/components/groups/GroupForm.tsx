import { useState } from 'react';
import emailjs from "@emailjs/browser";
import { Users, Info, Plus, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, getRandomId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CustomButton from '../ui/CustomButton';

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
    name: '',
    description: '',
  });
  // Store invited member emails entered by the user.
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  // Track the current input value for inviting a member.
  const [invitedEmailInput, setInvitedEmailInput] = useState("");

  // Automatically include the current user's details from localStorage.
  const currentUser = {
    id: getRandomId(),
    email: getStoredValue("email"),
    name: getStoredValue("name"),
    avatar: getStoredValue("picture"),
  };

  const handleGroupInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setGroupInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleInvitedEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvitedEmailInput(e.target.value);
  };

  // Add the email from the input field to the invitedEmails array.
  const handleAddInvitedEmail = () => {
    const email = invitedEmailInput.trim();
    if (email !== "" && !invitedEmails.includes(email)) {
      setInvitedEmails((prev) => [...prev, email]);
      toast.success(`Member ${email} added to invitation list.`);
      setInvitedEmailInput("");
    } else if (invitedEmails.includes(email)) {
      toast.error("This email has already been added.");
    }
  };

  // Function to send verification email using EmailJS.
  const sendVerificationEmail = async (email: string, token: string) => {
    const verificationLink = `${import.meta.env.VITE_APP_API_URL}/token=${token}`;
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

    // Build the members list: current user plus invited emails (filtering duplicates).
    const members = [
      {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      ...invitedEmails
        .filter((email) => email !== currentUser.email)
        .map((email) => ({
          id: getRandomId(),
          email,
          name: null,
          avatar: null,
        })),
    ];

    const groupData = {
      GroupID: getRandomId(),
      name: groupInfo.name,
      description: groupInfo.description || '',
      members,
      createdAt: new Date().toISOString(),
    };

    const apiUrl = `http://127.0.0.1:5000/api/groups`;
    console.log('API URL:', apiUrl);
    console.log('Group Data:', groupData);

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });
      const result = await response.json();
      console.log('API Response:', result);
      if (response.ok) {
        toast.success(result.message || 'Group created successfully');

        // Send verification email to each invited member.
        for (const email of invitedEmails) {
          const verificationToken = btoa(email); // Example token.
          await sendVerificationEmail(email, verificationToken);
        }
        onSave();
      } else {
        toast.error(result.error || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      toast.error('An error occurred while creating the group');
    } finally {
      setIsLoading(false);
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
              <Input
                type="email"
                placeholder="Enter member email"
                value={invitedEmailInput}
                onChange={handleInvitedEmailInputChange}
                className="w-full"
              />
              <Button type="button" size="sm" variant="outline" onClick={handleAddInvitedEmail}>
                Add
              </Button>
            </div>
            {invitedEmails.length > 0 && (
              <ul className="mt-2 space-y-1">
                {invitedEmails.map((email, idx) => (
                  <li key={idx} className="flex items-center gap-1 text-sm">
                    <Mail className="h-4 w-4" /> {email}
                  </li>
                ))}
              </ul>
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
