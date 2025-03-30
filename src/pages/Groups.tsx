import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import GroupCard from '@/components/groups/GroupCard';
import GroupForm from '@/components/groups/GroupForm';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import Loader from '@/components/ui/Loader';
import axios from 'axios';
import { Group } from '@/utils/mockData'; // Your API shape may differ

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Base API URL from environment variables
  const baseApiUrl = import.meta.env.VITE_APP_API_URL;

  // Fetch groups from backend
  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
      console.log('Token:', token);

      const response = await axios.get(`${baseApiUrl}/api/groups`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetch Groups Response:', response);

      if (response.status === 200) {
        // Transform the API data to your Group shape
        const fetchedGroups = response.data.map((group: any) => ({
          id: group.GroupID, // Map GroupID from API to id
          name: group.name,
          description: group.description,
          members: group.members,
          createdAt: new Date(group.createdAt),
        }));
        setGroups(fetchedGroups);
      } else {
        throw new Error('Failed to fetch groups');
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  // Called after successful group creation
  const handleCreateGroup = () => {
    console.log('Group created successfully, refetching groups');
    closeForm();
    setIsLoading(true);
    setTimeout(() => {
      fetchGroups();
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
          {groups.map((group) => (
            // Wrap each GroupCard in a Link that routes to /groups/:groupId
            <Link key={group.id} to={`/groups/${group.id}`}>
              <GroupCard group={group} />
            </Link>
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
        <DialogTitle>New Group</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new group and start tracking your shared expenses.
        </DialogDescription>
        <DialogContent className="sm:max-w-[600px] p-0">
          <GroupForm onSave={handleCreateGroup} onCancel={closeForm} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Groups;
