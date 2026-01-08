import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import './adminprofileheader.css';
import { useTokenStore } from '../../../store/tokenStore';
import Spinner from '../common/Spinner';

interface AdminProfileResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string | null;
}

const AdminProfileHeader: React.FC = () => {
  const { getAccessToken, isAuthenticated } = useTokenStore();
  const queryClient = useQueryClient();
  
  const fetchAdminProfile = async (): Promise<AdminProfileResponse> => {
    const token = getAccessToken();
    
    if (!token) {
      queryClient.removeQueries({ queryKey: ['adminProfile'] });
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
        queryClient.removeQueries({ queryKey: ['adminProfile'] });
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `Failed to fetch admin profile: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      queryClient.removeQueries({ queryKey: ['adminProfile'] });
      throw error;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.removeQueries({ queryKey: ['adminProfile'] });
    }
  }, [isAuthenticated, queryClient]);

  const {
    data: adminProfile,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery<AdminProfileResponse, Error>({
    queryKey: ['adminProfile'],
    queryFn: fetchAdminProfile,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
    gcTime: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const generateAvatarColor = (name: string) => {
    const colors = [
      '#8b5cf6', '#7c3aed', '#a78bfa', '#9333ea', '#6d28d9',
      '#3b0764', '#7e22ce', '#6b21a8', '#86198f', '#701a75'
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
      <div className="adm-user-profile">
        <div className="adm-user-avatar" style={{ background: '#64748b' }}>
          ?
        </div>
        <div className="adm-user-info">
          <span className="adm-user-name">Not Logged In</span>
          <span className="adm-user-role">Please login</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="adm-user-profile loading">
        <div className="adm-user-avatar skeleton">
          <Spinner size="small" color="#8b5cf6" />
        </div>
        <div className="adm-user-info">
          <div className="adm-user-name skeleton-text">
            <Spinner size="small" color="#e2e8f0" />
          </div>
          <div className="adm-user-role skeleton-text">
            <Spinner size="small" color="#e2e8f0" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !adminProfile) {
    const errorMessage = error?.message || 'Failed to load admin profile';
    
    if (errorMessage.includes('Authentication') || errorMessage.includes('token')) {
      return (
        <div className="adm-user-profile error">
          <div className="adm-user-avatar error-avatar">
            !
          </div>
          <div className="adm-user-info">
            <span className="adm-user-name error-text">Auth Error</span>
            <span className="adm-user-role error-subtext">
              Please login again
            </span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="adm-user-profile error">
        <div className="adm-user-avatar error-avatar">
          !
        </div>
        <div className="adm-user-info">
          <span className="adm-user-name error-text">Error</span>
          <span className="adm-user-role error-subtext">
            {errorMessage.length > 20 
              ? `${errorMessage.substring(0, 20)}...` 
              : errorMessage}
          </span>
        </div>
      </div>
    );
  }

  const fullName = `${adminProfile.first_name} ${adminProfile.last_name}`;
  const avatarColor = generateAvatarColor(fullName);

  return (
    <div className="adm-user-profile">
      <div 
        className="adm-user-avatar" 
        style={{ background: avatarColor }}
        title={fullName}
      >
        {getInitials(adminProfile.first_name, adminProfile.last_name)}
      </div>
      <div className="adm-user-info">
        <span className="adm-user-name" title={fullName}>
          {fullName}
        </span>
        <span className="adm-user-role admin-active">
          Administrator
        </span>
      </div>
    </div>
  );
};

export default AdminProfileHeader;