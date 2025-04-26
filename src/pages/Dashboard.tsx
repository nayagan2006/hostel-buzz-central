
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NotificationList from '@/components/NotificationList';
import QRGenerator from '@/components/QRGenerator';
import FeedbackForm from '@/components/FeedbackForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockNotifications, markAsRead } from '@/utils/mockData';

const Dashboard = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [currentUser, setCurrentUser] = useState({ id: '1', name: 'John Student', role: 'student' });
  const navigate = useNavigate();
  
  // Redirect if not logged in (in a real app, this would check auth state)
  useEffect(() => {
    // This is just a placeholder for actual auth logic
    // In a real app, you'd check if the user is authenticated and their role
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userName={currentUser.name}
        role={currentUser.role}
        unreadNotifications={unreadCount}
      />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
        
        <Tabs defaultValue="notifications">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationList
              notifications={notifications}
              userId={currentUser.id}
              onMarkAsRead={handleMarkAsRead}
            />
          </TabsContent>
          
          <TabsContent value="visitors">
            <div className="max-w-md mx-auto">
              <QRGenerator />
            </div>
          </TabsContent>
          
          <TabsContent value="feedback">
            <div className="max-w-md mx-auto">
              <FeedbackForm />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
