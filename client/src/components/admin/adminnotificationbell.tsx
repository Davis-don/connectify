import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaBell } from 'react-icons/fa';
import './adminnotificationbel.css'
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

const AdminNotificationBell: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { getAccessToken, isAuthenticated } = useTokenStore();
  const queryClient = useQueryClient();

  const fetchNotifications = async (): Promise<Notification[]> => {
    const token = getAccessToken();
    
    if (!token) {
      queryClient.removeQueries({ queryKey: ['adminNotifications'] });
      throw new Error('No authentication token found');
    }

    try {
      // Mock notifications for admin
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'System Update Required',
          message: 'Critical security patch available for installation',
          timestamp: '10 minutes ago',
          read: false,
          type: 'warning'
        },
        {
          id: '2',
          title: 'New User Registration',
          message: 'Service provider "John Smith" has registered',
          timestamp: '30 minutes ago',
          read: false,
          type: 'info'
        },
        {
          id: '3',
          title: 'Payment Processed',
          message: '$2,500 payment processed for platform fees',
          timestamp: '2 hours ago',
          read: false,
          type: 'success'
        },
        {
          id: '4',
          title: 'Report Generated',
          message: 'Monthly system report is ready for review',
          timestamp: '5 hours ago',
          read: true,
          type: 'info'
        },
        {
          id: '5',
          title: 'High Traffic Alert',
          message: 'Server load is above 80% threshold',
          timestamp: '1 day ago',
          read: true,
          type: 'warning'
        }
      ];
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockNotifications;
    } catch (error) {
      queryClient.removeQueries({ queryKey: ['adminNotifications'] });
      throw error;
    }
  };

  // Clear cache when authentication state changes
  React.useEffect(() => {
    if (!isAuthenticated) {
      queryClient.removeQueries({ queryKey: ['adminNotifications'] });
      setShowDropdown(false);
    }
  }, [isAuthenticated, queryClient]);

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Notification[], Error>({
    queryKey: ['adminNotifications'],
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
    queryClient.setQueryData<Notification[]>(['adminNotifications'], (old) =>
      old?.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ) || []
    );
  };

  const markAllAsRead = () => {
    queryClient.setQueryData<Notification[]>(['adminNotifications'], (old) =>
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
      <div className="admn-wrapper">
        <button 
          className="admn-bell disabled" 
          disabled
          aria-label="Notifications (disabled)"
        >
          <FaBell />
        </button>
      </div>
    );
  }

  return (
    <div className="admn-wrapper">
      <button 
        className="admn-bell" 
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="admn-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div 
            className="admn-overlay" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="admn-dropdown">
            <div className="admn-header">
              <h3>Admin Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  className="admn-mark-all"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="admn-list">
              {isLoading ? (
                <div className="admn-loading">
                  <Spinner size="medium" color="#8b5cf6" />
                  <span>Loading notifications...</span>
                </div>
              ) : isError ? (
                <div className="admn-error">
                  <div className="admn-error-icon">!</div>
                  <span>Failed to load notifications</span>
                  <button 
                    className="admn-retry"
                    onClick={() => refetch()}
                  >
                    Retry
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="admn-empty">
                  <FaBell className="admn-empty-icon" />
                  <span>No notifications yet</span>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`admn-item ${getNotificationClass(notification.type)} ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="admn-item-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="admn-content">
                      <div className="admn-title">
                        {notification.title}
                        {!notification.read && <span className="admn-unread-dot"></span>}
                      </div>
                      <div className="admn-message">
                        {notification.message}
                      </div>
                      <div className="admn-time">
                        {notification.timestamp}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && !isLoading && !isError && (
              <div className="admn-footer">
                <button className="admn-view-all">
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

export default AdminNotificationBell;