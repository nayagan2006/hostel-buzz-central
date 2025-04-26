
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NotificationList from '@/components/NotificationList';
import EngagementChart from '@/components/EngagementChart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { mockNotifications, markAsRead } from '@/utils/mockData';

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [currentUser, setCurrentUser] = useState({ id: '2', name: 'Admin Warden', role: 'warden' });
  const [notificationType, setNotificationType] = useState<string>('general');
  const [notificationPriority, setNotificationPriority] = useState<string>('medium');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not logged in as warden (in a real app, this would check auth state)
  useEffect(() => {
    // This is just a placeholder for actual auth logic
    // In a real app, you'd check if the user is authenticated and is a warden
  }, [navigate]);
  
  // Calculate unread notifications
  const unreadCount = notifications.filter(
    notification => !notification.readBy.includes(currentUser.id)
  ).length;
  
  // Handle marking notifications as read
  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId, currentUser.id);
    setNotifications([...notifications]); // Force re-render with updated data
  };
  
  // Handle creating a new notification
  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notificationTitle || !notificationMessage) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both title and message for the notification",
      });
      return;
    }
    
    // Create a new notification
    const newNotification = {
      id: (notifications.length + 1).toString(),
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType as any,
      priority: notificationPriority as any,
      createdAt: new Date(),
      readBy: [],
      createdBy: currentUser.id
    };
    
    // Add to notifications
    setNotifications([newNotification, ...notifications]);
    
    toast({
      title: "Notification created",
      description: "Your notification has been sent to all students",
    });
    
    // Reset form
    setNotificationTitle('');
    setNotificationMessage('');
    setNotificationType('general');
    setNotificationPriority('medium');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userName={currentUser.name}
        role={currentUser.role}
        unreadNotifications={unreadCount}
      />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Warden Dashboard</h1>
        
        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="create">Create Notification</TabsTrigger>
            <TabsTrigger value="notifications">All Notifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Notification</CardTitle>
                <CardDescription>
                  Send a new notification to all hostel students
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateNotification}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Notification Type</Label>
                      <Select 
                        value={notificationType} 
                        onValueChange={setNotificationType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="mess">Mess</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select 
                        value={notificationPriority} 
                        onValueChange={setNotificationPriority}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                      placeholder="Enter notification title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      placeholder="Enter notification message"
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Send Notification</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationList
              notifications={notifications}
              userId={currentUser.id}
              onMarkAsRead={handleMarkAsRead}
            />
          </TabsContent>
          
          <TabsContent value="analytics">
            <EngagementChart notifications={notifications} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
