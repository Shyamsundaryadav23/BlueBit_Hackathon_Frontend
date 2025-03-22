
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import GroupCard from '@/components/groups/GroupCard';
import GroupForm from '@/components/groups/GroupForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { mockGroups } from '@/utils/mockData';
import Loader from '@/components/ui/Loader';

const Groups = () => {
  const [groups, setGroups] = useState(mockGroups);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  
  const handleCreateGroup = () => {
    closeForm();
    // In a real app, we would fetch updated groups
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Groups</h1>
        <Button onClick={openForm} className="rounded-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Group
        </Button>
      </div>
      
      {isLoading ? (
        <div className="h-40 flex-center">
          <Loader size="lg" />
        </div>
      ) : groups.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {groups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="font-medium text-lg mb-2">No Groups Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first group to start tracking shared expenses
          </p>
          <Button onClick={openForm} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </div>
      )}
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <GroupForm onSave={handleCreateGroup} onCancel={closeForm} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Groups;