import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import './welcomedashoverview.css';
import Spinner from '../common/Spinner';
import { useTokenStore } from '../../../store/tokenStore';
import { Sparkles } from 'lucide-react';

interface UserProfileResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  service_profile: {
    id: number;
    company_name: string | null;
  } | null;
}

const WelcomeDashoverview: React.FC = () => {
  const { getAccessToken, isAuthenticated } = useTokenStore();
  const queryClient = useQueryClient();
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  
  const messages = [
    "Welcome back! Let's make today productive.",
    "Great to see you! Ready to serve your clients?",
    "Hello there! Your dashboard is ready for action.",
    "Welcome! Let's achieve great things today."
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

  const fetchUserProfile = async (): Promise<UserProfileResponse> => {
    const token = getAccessToken();
    
    if (!token) {
      // Clear cache if no token
      queryClient.removeQueries({ queryKey: ['serviceProviderWelcomeProfile'] });
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/fetch-service-provider/`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 401) {
        // Unauthorized - clear cache and throw error
        queryClient.removeQueries({ queryKey: ['serviceProviderWelcomeProfile'] });
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Clear cache on error
        queryClient.removeQueries({ queryKey: ['serviceProviderWelcomeProfile'] });
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `Failed to fetch user profile: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      // Clear cache on any error
      queryClient.removeQueries({ queryKey: ['serviceProviderWelcomeProfile'] });
      throw error;
    }
  };

  // Clear cache when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.removeQueries({ queryKey: ['serviceProviderWelcomeProfile'] });
    }
  }, [isAuthenticated, queryClient]);

  const {
    data: userProfile,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserProfileResponse, Error>({
    queryKey: ['serviceProviderWelcomeProfile'], // Unique query key for this component
    queryFn: fetchUserProfile,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Reduced from 30 to 5 minutes to match ProviderProfileHeader
    enabled: isAuthenticated,
    gcTime: 0, // No garbage collection - cache cleared on logout
  });

  // Add refetch when component mounts (in case token changed)
  useEffect(() => {
    if (isAuthenticated) {
      // Reset typewriter animation when refetching
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
      <div className="spdo-welcome-container">
        <h1 className="spdo-welcome-title">
          Welcome to Your Dashboard
        </h1>
        <p className="spdo-welcome-message">
          Please log in to access your service provider dashboard.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="spdo-welcome-container">
        <div className="spdo-welcome-content">
          <div className="spdo-loading-greeting">
            <Spinner size="small" color="#4361ee" />
            <span>Loading your welcome...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !userProfile) {
    return (
      <div className="spdo-welcome-container error">
        <h1 className="spdo-welcome-title">
          Welcome Back
        </h1>
        <p className="spdo-welcome-message">
          We're having trouble loading your profile. Please try refreshing.
        </p>
        <button 
          onClick={() => {
            // Reset typewriter animation when retrying
            setTypedText('');
            setCharIndex(0);
            refetch();
          }}
          className="spdo-retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  const firstName = userProfile.first_name;
  const greeting = getGreeting();

  return (
    <div className="spdo-welcome-container">
      <div className="spdo-welcome-header">
        <Sparkles className="spdo-welcome-sparkle" size={24} />
        <h1 className="spdo-welcome-title">
          {greeting}, <span className="spdo-user-name">{firstName}</span>!
        </h1>
      </div>
      
      <div className="spdo-typewriter">
        <p className="spdo-welcome-message">
          {typedText}
          {charIndex < currentMessage.length && (
            <span className="spdo-cursor">|</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default WelcomeDashoverview;