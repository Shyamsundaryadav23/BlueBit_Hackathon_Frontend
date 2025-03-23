import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import GroupCard from '@/components/groups/GroupCard';
import GroupForm from '@/components/groups/GroupForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Loader from '@/components/ui/Loader';
import axios from 'axios'; // Make sure axios is installed or you can use fetch API
import { Group } from '@/utils/mockData';

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch groups from backend
  const fetchGroups = async () => {
    setIsLoading(true);  // Show loading state
    try {
      // Retrieve the token from localStorage (or from your auth context, depending on your setup)
      const token = localStorage.getItem('token');
      
      // If the token doesn't exist, throw an error
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
  
      console.log('Token:', token);  
      
      const response = await axios.get("http://127.0.0.1:5000/api/groups", {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  
        },
      });
      console.log(response); // Check the response structure

      if (response.status === 200) {
        // Parse the API response data
        const fetchedGroups = response.data.map((group: any) => ({
          id: group.GroupID, // Map GroupID to id
          name: group.name,
          description: group.description,
          members: group.members,
          createdAt: new Date(group.createdAt), // Convert createdAt string to Date object
        }));
        
        setGroups(fetchedGroups);  // Set groups state with the transformed data
      } else {
        throw new Error('Failed to fetch groups');
      }
    } catch (error) {
      // Handle the error and show an appropriate message
      console.error('Error fetching groups:', error);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  
  // This handler is called after GroupForm successfully creates a group.
  const handleCreateGroup = () => {
    closeForm();
    setIsLoading(true);
    setTimeout(() => {
      // Refetch groups after creating a new group
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
