import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './welcomedashoverview.css';
import Spinner from '../common/Spinner';
import { useTokenStore } from '../../../store/tokenStore';
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Star, 
  Clock, 
  Rocket,
  Target,
  Zap,
  CheckCircle,
  Award
} from 'lucide-react'; // Using Lucide React icons[citation:2]

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
  const [welcomeText, setWelcomeText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Welcome back! Let's get you started today.";
  
  // Typewriter animation effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setWelcomeText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  const fetchUserProfile = async (): Promise<UserProfileResponse> => {
    const token = getAccessToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

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

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }

    return response.json();
  };

  const {
    data: userProfile,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery<UserProfileResponse, Error>({
    queryKey: ['serviceProviderWelcomeProfile'],
    queryFn: fetchUserProfile,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: isAuthenticated,
  });

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
        <div className="spdo-welcome-header">
          <div className="spdo-welcome-icon">
            <Sparkles size={32} color="#ffffff" />
          </div>
          <h1 className="spdo-welcome-title">Welcome to Your Dashboard</h1>
        </div>
        <p className="spdo-welcome-message">
          Please log in to access your service provider dashboard and manage your business.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="spdo-welcome-container loading">
        <div className="spdo-loading-content">
          <div className="spdo-loading-spinner">
            <Spinner size="medium" color="#ffffff" />
          </div>
          <div className="spdo-loading-text">
            <div className="spdo-skeleton-title"></div>
            <div className="spdo-skeleton-message"></div>
          </div>
        </div>
        <div className="spdo-welcome-features">
          {[1, 2, 3].map((i) => (
            <div key={i} className="spdo-feature-item skeleton">
              <div className="spdo-feature-icon">
                <div className="spdo-skeleton-icon"></div>
              </div>
              <div className="spdo-feature-text">
                <div className="spdo-skeleton-heading"></div>
                <div className="spdo-skeleton-paragraph"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !userProfile) {
    return (
      <div className="spdo-welcome-container error">
        <div className="spdo-error-content">
          <div className="spdo-error-icon">
            <div className="spdo-error-symbol">!</div>
          </div>
          <div className="spdo-error-text">
            <h2 className="spdo-error-title">Unable to Load Profile</h2>
            <p className="spdo-error-message">
              {error?.message?.includes('token') ? 
                'Authentication error. Please try logging in again.' : 
                'Could not load your profile data. Please try refreshing.'}
            </p>
            <button 
              onClick={() => refetch()}
              className="spdo-retry-button"
            >
              <Zap size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${userProfile.first_name} ${userProfile.last_name}`;
  const companyName = userProfile.service_profile?.company_name;
  const greeting = getGreeting();

  return (
    <div className="spdo-welcome-container">
      <div className="spdo-welcome-header">
        <div className="spdo-welcome-icon animated">
          <Sparkles size={32} color="#ffffff" />
        </div>
        <div className="spdo-welcome-text">
          <h1 className="spdo-welcome-title">
            {greeting}, <span className="spdo-user-name">{fullName}</span>
          </h1>
          <div className="spdo-typewriter-container">
            <p className="spdo-welcome-message">
              {welcomeText}
              <span className="spdo-cursor">|</span>
            </p>
          </div>
          {companyName && (
            <div className="spdo-company-badge">
              <Target size={16} />
              <span>{companyName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="spdo-welcome-features">
        <div className="spdo-feature-item">
          <div className="spdo-feature-icon performance">
            <TrendingUp size={24} />
          </div>
          <div className="spdo-feature-text">
            <h3>Performance Dashboard</h3>
            <p>Track your revenue, bookings, and customer ratings in real-time</p>
          </div>
        </div>
        <div className="spdo-feature-item">
          <div className="spdo-feature-icon booking">
            <Calendar size={24} />
          </div>
          <div className="spdo-feature-text">
            <h3>Smart Booking Management</h3>
            <p>Manage active and pending service requests efficiently</p>
          </div>
        </div>
        <div className="spdo-feature-item">
          <div className="spdo-feature-icon quality">
            <Award size={24} />
          </div>
          <div className="spdo-feature-text">
            <h3>Quality First</h3>
            <p>Maintain excellence with customer reviews and ratings</p>
          </div>
        </div>
      </div>

      <div className="spdo-welcome-actions">
        <div className="spdo-action-stats">
          <div className="spdo-stat-item">
            <CheckCircle size={20} className="spdo-stat-icon" />
            <span>Ready to serve</span>
          </div>
          <div className="spdo-stat-item">
            <Clock size={20} className="spdo-stat-icon" />
            <span>24/7 availability</span>
          </div>
          <div className="spdo-stat-item">
            <Star size={20} className="spdo-stat-icon" />
            <span>Premium service provider</span>
          </div>
        </div>
        <button className="spdo-get-started-button">
          <Rocket size={20} />
          Get Started Today
        </button>
      </div>
    </div>
  );
};

export default WelcomeDashoverview;