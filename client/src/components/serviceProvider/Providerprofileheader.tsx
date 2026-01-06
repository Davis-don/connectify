import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import './providerprofileheader.css';
import { useTokenStore } from '../../../store/tokenStore';
import Spinner from '../common/Spinner';

interface ServiceProfile {
  id: number;
  phone_number: string | null;
  company_name: string | null;
}

interface UserProfileResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  service_profile: ServiceProfile | null;
}

const ProviderProfileHeader: React.FC = () => {
  const { getAccessToken, isAuthenticated } = useTokenStore();
  const queryClient = useQueryClient();
  
  const fetchUserProfile = async (): Promise<UserProfileResponse> => {
    const token = getAccessToken();
    
    if (!token) {
      // Clear cache if no token
      queryClient.removeQueries({ queryKey: ['serviceProviderProfile'] });
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
        queryClient.removeQueries({ queryKey: ['serviceProviderProfile'] });
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `Failed to fetch user profile: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      // Clear cache on any error
      queryClient.removeQueries({ queryKey: ['serviceProviderProfile'] });
      throw error;
    }
  };

  // Clear cache when authentication state changes
  React.useEffect(() => {
    if (!isAuthenticated) {
      queryClient.removeQueries({ queryKey: ['serviceProviderProfile'] });
    }
  }, [isAuthenticated, queryClient]);

  const {
    data: userProfile,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery<UserProfileResponse, Error>({
    queryKey: ['serviceProviderProfile'],
    queryFn: fetchUserProfile,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated, // Only run query if authenticated
    gcTime: 0, // No garbage collection - cache cleared on logout
  });

  // Add refetch when component mounts (in case token changed)
  React.useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const generateAvatarColor = (name: string) => {
    // Generate consistent color based on name
    const colors = [
      '#4361ee', '#3a0ca3', '#4cc9f0', '#3a86ff', '#7209b7',
      '#f72585', '#480ca8', '#560bad', '#7209b7', '#b5179e'
    ];
    
    if (!name) return colors[0];
    
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // If not authenticated, show empty state
  if (!isAuthenticated) {
    return (
      <div className="svp-user-profile">
        <div className="svp-user-avatar" style={{ background: '#64748b' }}>
          ?
        </div>
        <div className="svp-user-info">
          <span className="svp-user-name">Not Logged In</span>
          <span className="svp-user-role">Please login</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="svp-user-profile loading">
        <div className="svp-user-avatar skeleton">
          <Spinner size="small" color="#4361ee" />
        </div>
        <div className="svp-user-info">
          <div className="svp-user-name skeleton-text">
            <Spinner size="small" color="#e2e8f0" />
          </div>
          <div className="svp-user-role skeleton-text">
            <Spinner size="small" color="#e2e8f0" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !userProfile) {
    const errorMessage = error?.message || 'Failed to load user profile';
    
    // If error is authentication related, show login prompt
    if (errorMessage.includes('Authentication') || errorMessage.includes('token')) {
      return (
        <div className="svp-user-profile error">
          <div className="svp-user-avatar error-avatar">
            !
          </div>
          <div className="svp-user-info">
            <span className="svp-user-name error-text">Auth Error</span>
            <span className="svp-user-role error-subtext">
              Please login again
            </span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="svp-user-profile error">
        <div className="svp-user-avatar error-avatar">
          !
        </div>
        <div className="svp-user-info">
          <span className="svp-user-name error-text">Error</span>
          <span className="svp-user-role error-subtext">
            {errorMessage.length > 20 
              ? `${errorMessage.substring(0, 20)}...` 
              : errorMessage}
          </span>
        </div>
      </div>
    );
  }

  const fullName = `${userProfile.first_name} ${userProfile.last_name}`;
  const avatarColor = generateAvatarColor(fullName);
  const companyName = userProfile.service_profile?.company_name;

  return (
    <div className="svp-user-profile">
      <div 
        className="svp-user-avatar" 
        style={{ background: avatarColor }}
        title={fullName}
      >
        {getInitials(userProfile.first_name, userProfile.last_name)}
      </div>
      <div className="svp-user-info">
        <span className="svp-user-name" title={fullName}>
          {fullName}
        </span>
        <span className="svp-user-role active">
          {companyName || 'Service Provider'}
        </span>
      </div>
    </div>
  );
};

export default ProviderProfileHeader;