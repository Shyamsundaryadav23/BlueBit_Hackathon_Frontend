
import { useState } from 'react';
import { Users, Mail, Info, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CustomButton from '../ui/CustomButton';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, getRandomId } from '@/lib/utils';
import { mockUsers } from '@/utils/mockData';
import { Button } from '@/components/ui/button';

interface MemberInput {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface GroupFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const GroupForm = ({ onSave, onCancel }: GroupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<MemberInput[]>([
    // Current user is always added by default
    {
      id: getRandomId(),
      email: mockUsers[0].email,
      name: mockUsers[0].name,
      avatar: mockUsers[0].avatar
    }
  ]);
  
  const handleAddMember = () => {
    setMembers([...members, { id: getRandomId(), email: '' }]);
  };
  
  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };
  
  const handleMemberChange = (id: string, email: string) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, email } : member
    ));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Group created successfully');
      onSave();
    }, 1000);
  };
  
  return (
    <Card className="border-none shadow-subtle">
      <CardHeader>
        <CardTitle className="text-xl">Create New Group</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input 
                id="group-name" 
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
                placeholder="What is this group for?"
                className="pl-10 min-h-24"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Group Members</Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline"
                onClick={handleAddMember}
                className="h-8 rounded-full text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Member
              </Button>
            </div>
            
            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={member.id} className="flex items-center gap-2">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    {member.avatar ? (
                      <AvatarImage src={member.avatar} />
                    ) : null}
                    <AvatarFallback>
                      {member.name ? getInitials(member.name) : index === 0 ? 'You' : '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={member.email}
                      onChange={(e) => handleMemberChange(member.id, e.target.value)}
                      placeholder="Email address"
                      className="pl-9"
                      type="email"
                      disabled={index === 0} // Can't edit current user
                      required
                    />
                  </div>
                  
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 rounded-full flex-shrink-0"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <span className="sr-only">Remove</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <CustomButton
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </CustomButton>
        <CustomButton
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          Create Group
        </CustomButton>
      </CardFooter>
    </Card>
  );
};

export default GroupForm;