import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaBell } from 'react-icons/fa';
import './notificationbell.css'
import { useTokenStore } from '../../../store/tokenStore';
import Spinner from '../common/Spinner';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

const NotificationBell: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { getAccessToken, isAuthenticated } = useTokenStore();
  const queryClient = useQueryClient();

  const fetchNotifications = async (): Promise<Notification[]> => {
    const token = getAccessToken();
    
    if (!token) {
      queryClient.removeQueries({ queryKey: ['serviceProviderNotifications'] });
      throw new Error('No authentication token found');
    }

    try {
      // This is where you'll make your API call to fetch notifications from backend
      // For now, using mock data that changes based on user
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'New Booking Request',
          message: 'John Doe requested your plumbing service',
          timestamp: '5 minutes ago',
          read: false,
          type: 'info'
        },
        {
          id: '2',
          title: 'Payment Received',
          message: '$150 payment received for electrical service',
          timestamp: '1 hour ago',
          read: false,
          type: 'success'
        },
        {
          id: '3',
          title: 'Service Reminder',
          message: 'Monthly maintenance checkup scheduled tomorrow',
          timestamp: '3 hours ago',
          read: true,
          type: 'warning'
        },
        {
          id: '4',
          title: 'Client Review',
          message: 'Sarah Johnson left a 5-star review',
          timestamp: '1 day ago',
          read: true,
          type: 'success'
        }
      ];
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockNotifications;
    } catch (error) {
      queryClient.removeQueries({ queryKey: ['serviceProviderNotifications'] });
      throw error;
    }
  };

  // Clear cache when authentication state changes
  React.useEffect(() => {
    if (!isAuthenticated) {
      queryClient.removeQueries({ queryKey: ['serviceProviderNotifications'] });
      setShowDropdown(false);
    }
  }, [isAuthenticated, queryClient]);

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Notification[], Error>({
    queryKey: ['serviceProviderNotifications'],
    queryFn: fetchNotifications,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000, // 1 minute for notifications
    enabled: isAuthenticated,
    gcTime: 0, // No garbage collection
  });

  // Refetch when component mounts (in case user changed)
  React.useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    // In a real app, you would make an API call here
    queryClient.setQueryData<Notification[]>(['serviceProviderNotifications'], (old) =>
      old?.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ) || []
    );
  };

  const markAllAsRead = () => {
    // In a real app, you would make an API call here
    queryClient.setQueryData<Notification[]>(['serviceProviderNotifications'], (old) =>
      old?.map(notification => ({ ...notification, read: true })) || []
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return 'ℹ';
    }
  };

  const getNotificationClass = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  // If not authenticated, show disabled bell
  if (!isAuthenticated) {
    return (
      <div className="notification-wrapper">
        <button 
          className="notification-bell disabled" 
          disabled
          aria-label="Notifications (disabled)"
        >
          <FaBell />
        </button>
      </div>
    );
  }

  return (
    <div className="notification-wrapper">
      <button 
        className="notification-bell" 
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div 
            className="notification-overlay" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="notification-list">
              {isLoading ? (
                <div className="notification-loading">
                  <Spinner size="medium" color="#4361ee" />
                  <span>Loading notifications...</span>
                </div>
              ) : isError ? (
                <div className="notification-error">
                  <div className="error-icon">!</div>
                  <span>Failed to load notifications</span>
                  <button 
                    className="retry-btn"
                    onClick={() => refetch()}
                  >
                    Retry
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="notification-empty">
                  <FaBell className="empty-icon" />
                  <span>No notifications yet</span>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${getNotificationClass(notification.type)} ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">
                        {notification.title}
                        {!notification.read && <span className="unread-dot"></span>}
                      </div>
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      <div className="notification-time">
                        {notification.timestamp}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && !isLoading && !isError && (
              <div className="notification-footer">
                <button className="view-all">
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;