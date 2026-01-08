import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import './adminwelcomeoverview.css';
import Spinner from '../common/Spinner';
import { useTokenStore } from '../../../store/tokenStore';
import { Sparkles } from 'lucide-react';

interface AdminProfileResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string | null;
}

const AdminWelcomeOverview: React.FC = () => {
  const { getAccessToken, isAuthenticated } = useTokenStore();
  const queryClient = useQueryClient();
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  
  const messages = [
    "Welcome back! Ready to manage the system?",
    "Great to see you! Everything is under your control.",
    "Hello Administrator! Your dashboard awaits.",
    "Welcome! Let's make today efficient and productive."
  ];
  
  const [currentMessage] = useState(() => 
    messages[Math.floor(Math.random() * messages.length)]
  );

  // Typewriter animation effect
  useEffect(() => {
    if (charIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + currentMessage[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, currentMessage]);

  const fetchAdminProfile = async (): Promise<AdminProfileResponse> => {
    const token = getAccessToken();
    
    if (!token) {
      queryClient.removeQueries({ queryKey: ['adminWelcomeProfile'] });
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/fetch-system-manager/`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 401) {
        queryClient.removeQueries({ queryKey: ['adminWelcomeProfile'] });
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        queryClient.removeQueries({ queryKey: ['adminWelcomeProfile'] });
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `Failed to fetch admin profile: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      queryClient.removeQueries({ queryKey: ['adminWelcomeProfile'] });
      throw error;
    }
  };

  // Clear cache when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.removeQueries({ queryKey: ['adminWelcomeProfile'] });
    }
  }, [isAuthenticated, queryClient]);

  const {
    data: adminProfile,
    isLoading,
    isError,
    refetch,
  } = useQuery<AdminProfileResponse, Error>({
    queryKey: ['adminWelcomeProfile'],
    queryFn: fetchAdminProfile,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
    gcTime: 0,
  });

  // Add refetch when component mounts (in case token changed)
  useEffect(() => {
    if (isAuthenticated) {
      setTypedText('');
      setCharIndex(0);
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Show loading state
  if (!isAuthenticated) {
    return (
      <div className="adwo-welcome-container">
        <h1 className="adwo-welcome-title">
          Welcome to Admin Dashboard
        </h1>
        <p className="adwo-welcome-message">
          Please log in to access the administrator dashboard.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="adwo-welcome-container">
        <div className="adwo-welcome-content">
          <div className="adwo-loading-greeting">
            <Spinner size="small" color="#8b5cf6" />
            <span>Loading your welcome...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !adminProfile) {
    return (
      <div className="adwo-welcome-container error">
        <h1 className="adwo-welcome-title">
          Welcome Back
        </h1>
        <p className="adwo-welcome-message">
          We're having trouble loading your profile. Please try refreshing.
        </p>
        <button 
          onClick={() => {
            setTypedText('');
            setCharIndex(0);
            refetch();
          }}
          className="adwo-retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  const firstName = adminProfile.first_name;
  const greeting = getGreeting();

  return (
    <div className="adwo-welcome-container">
      <div className="adwo-welcome-header">
        <Sparkles className="adwo-welcome-sparkle" size={24} />
        <h1 className="adwo-welcome-title">
          {greeting}, <span className="adwo-user-name">{firstName}</span>!
        </h1>
      </div>
      
      <div className="adwo-typewriter">
        <p className="adwo-welcome-message">
          {typedText}
          {charIndex < currentMessage.length && (
            <span className="adwo-cursor">|</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default AdminWelcomeOverview;