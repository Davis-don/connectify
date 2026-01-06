import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './service-provider-dashboard.css';
import { useTokenStore } from '../../../store/tokenStore';
import { useToast } from '../../../store/toastStore';

// Import React Icons
import { 
  FaChartPie, 
  FaConciergeBell, 
  FaCalendarCheck, 
  FaWallet, 
  FaUserCog, 
  FaComments,
  FaTools,
  FaChartLine,
  FaStar,
  FaClock,
  FaChartBar,
  FaHandsHelping,
  FaBars,
  FaTimes,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

// Import separated components
import ProviderProfileHeader from '../../components/serviceProvider/Providerprofileheader';
import NotificationBell from '../../components/serviceProvider/Notificationbell';

// Placeholder Components (these will be separate files later)
const DashboardOverview = () => (
  <div className="svp-component-container">
    <h1 className="svp-component-title">Dashboard Overview</h1>
    <div className="svp-stats-grid">
      <div className="svp-stat-card">
        <div className="svp-stat-header">
          <span className="svp-stat-title">Active Services</span>
          <div className="svp-stat-icon svp-stat-icon-1">
            <FaTools />
          </div>
        </div>
        <div className="svp-stat-value">24</div>
        <div className="svp-stat-change svp-stat-change-positive">
          <FaArrowUp />
          <span>+8 this month</span>
        </div>
      </div>
      
      <div className="svp-stat-card">
        <div className="svp-stat-header">
          <span className="svp-stat-title">Total Revenue</span>
          <div className="svp-stat-icon svp-stat-icon-2">
            <FaChartLine />
          </div>
        </div>
        <div className="svp-stat-value">$12,850</div>
        <div className="svp-stat-change svp-stat-change-positive">
          <FaArrowUp />
          <span>+18% from last month</span>
        </div>
      </div>
      
      <div className="svp-stat-card">
        <div className="svp-stat-header">
          <span className="svp-stat-title">Client Rating</span>
          <div className="svp-stat-icon svp-stat-icon-3">
            <FaStar />
          </div>
        </div>
        <div className="svp-stat-value">4.9</div>
        <div className="svp-stat-change svp-stat-change-positive">
          <FaArrowUp />
          <span>+0.3 this week</span>
        </div>
      </div>
      
      <div className="svp-stat-card">
        <div className="svp-stat-header">
          <span className="svp-stat-title">Pending Bookings</span>
          <div className="svp-stat-icon svp-stat-icon-4">
            <FaClock />
          </div>
        </div>
        <div className="svp-stat-value">14</div>
        <div className="svp-stat-change svp-stat-change-negative">
          <FaArrowDown />
          <span>-3 from yesterday</span>
        </div>
      </div>
    </div>
    <div className="svp-placeholder-content">
      <div className="svp-placeholder-icon">
        <FaChartBar size={60} />
      </div>
      <div>
        <h3>Advanced Analytics Coming Soon</h3>
        <p>Detailed insights and performance metrics will be available here</p>
      </div>
    </div>
  </div>
);

const ServicesManagement = () => (
  <div className="svp-component-container">
    <h1 className="svp-component-title">Services Management</h1>
    <div className="svp-placeholder-content">
      <div className="svp-placeholder-icon">
        <FaConciergeBell size={60} />
      </div>
      <div>
        <h3>Manage Your Services</h3>
        <p>Add, edit, and manage all your service offerings from this panel</p>
      </div>
    </div>
  </div>
);

const ProfileSettings = () => (
  <div className="svp-component-container">
    <h1 className="svp-component-title">Profile Settings</h1>
    <div className="svp-placeholder-content">
      <div className="svp-placeholder-icon">
        <FaUserCog size={60} />
      </div>
      <div>
        <h3>Account Configuration</h3>
        <p>Update your profile, settings, and preferences</p>
      </div>
    </div>
  </div>
);

const ServiceProviderDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1400);
  const navigate = useNavigate();
  
  // Get token store and toast store
  const {
    clearTokens,
    getRole,
    isAuthenticated,
    tokenData
  } = useTokenStore();
  
  const { showToast } = useToast();

  // Handle logout
  const handleLogout = () => {
    // Close sidebar on mobile
    if (!isDesktop) {
      setSidebarOpen(false);
    }
    
    // Clear tokens from store
    clearTokens();
    
    // Show success toast
    showToast('You have been successfully logged out!', 'success', 3);
    
    // Navigate to login page after toast duration
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  // Check authentication and role
  useEffect(() => {
    if (!isAuthenticated || !tokenData) {
      showToast('Please login to access the dashboard', 'error', 3);
      navigate('/login');
      return;
    }
    
    const userRole = getRole();
    if (userRole !== 'service_provider') {
      showToast('Unauthorized access. Redirecting...', 'error', 3);
      setTimeout(() => {
        navigate('/unauthorized');
      }, 3000);
    }
  }, [isAuthenticated, tokenData, getRole, navigate, showToast]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1400;
      setIsDesktop(desktop);
      
      // Auto-open sidebar on desktop, close on mobile
      if (desktop) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.svp-sidebar');
      const toggleButton = document.querySelector('.svp-menu-toggle');
      
      if (!isDesktop && 
          sidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target as Node) &&
          toggleButton && 
          !toggleButton.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isDesktop]);

  // Handle menu item click
  const handleMenuItemClick = (component: string) => {
    setActiveComponent(component);
    // Close sidebar on mobile after selection
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'services':
        return <ServicesManagement />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  // Don't render anything if not authenticated
  if (!isAuthenticated || !tokenData) {
    return null;
  }

  // Menu items data with React Icons
  const menuItems = [
    {
      id: 'dashboard',
      icon: FaChartPie,
      label: 'Dashboard',
      active: activeComponent === 'dashboard'
    },
    {
      id: 'services',
      icon: FaConciergeBell,
      label: 'My Services',
      badge: '24',
      active: activeComponent === 'services'
    },
    {
      id: 'bookings',
      icon: FaCalendarCheck,
      label: 'Bookings',
      badge: '14'
    },
    {
      id: 'earnings',
      icon: FaWallet,
      label: 'Earnings'
    },
    {
      id: 'profile',
      icon: FaUserCog,
      label: 'Profile Settings',
      active: activeComponent === 'profile'
    },
    {
      id: 'messages',
      icon: FaComments,
      label: 'Messages',
      badge: '8'
    }
  ];

  return (
    <div className="svp-dashboard-container">
      {/* Mobile overlay */}
      <div 
        className={`svp-sidebar-overlay ${sidebarOpen ? 'svp-sidebar-overlay-open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <aside className={`svp-sidebar ${sidebarOpen ? 'svp-sidebar-open' : ''}`}>
        <div className="svp-sidebar-header">
          <div className="svp-sidebar-logo">
            <div className="svp-logo-icon">
              <FaHandsHelping />
            </div>
            <div>
              <div className="svp-logo-text">HELPR</div>
              <div className="svp-logo-subtext">PROVIDER PORTAL</div>
            </div>
          </div>
        </div>

        <div className="svp-nav-section">
          <div className="svp-nav-group">
            <div className="svp-nav-group-title">MAIN</div>
            <ul className="svp-nav-list">
              {menuItems.slice(0, 2).map((item) => (
                <li key={item.id} className="svp-nav-item">
                  <a
                    href="#"
                    className={`svp-nav-link ${item.active ? 'svp-nav-link-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuItemClick(item.id);
                    }}
                  >
                    <span className="svp-nav-icon">
                      <item.icon />
                    </span>
                    <span className="svp-nav-text">{item.label}</span>
                    {item.badge && <span className="svp-nav-badge">{item.badge}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="svp-nav-group">
            <div className="svp-nav-group-title">SERVICES</div>
            <ul className="svp-nav-list">
              {menuItems.slice(2, 4).map((item) => (
                <li key={item.id} className="svp-nav-item">
                  <a
                    href="#"
                    className="svp-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.id === 'bookings') {
                        showToast('Bookings feature coming soon!', 'info', 3);
                      } else {
                        showToast('Earnings dashboard coming soon!', 'info', 3);
                      }
                    }}
                  >
                    <span className="svp-nav-icon">
                      <item.icon />
                    </span>
                    <span className="svp-nav-text">{item.label}</span>
                    {item.badge && <span className="svp-nav-badge">{item.badge}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="svp-nav-group">
            <div className="svp-nav-group-title">ACCOUNT</div>
            <ul className="svp-nav-list">
              {menuItems.slice(4).map((item) => (
                <li key={item.id} className="svp-nav-item">
                  <a
                    href="#"
                    className={`svp-nav-link ${item.active ? 'svp-nav-link-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.id === 'profile') {
                        handleMenuItemClick('profile');
                      } else {
                        showToast('Messages feature coming soon!', 'info', 3);
                      }
                    }}
                  >
                    <span className="svp-nav-icon">
                      <item.icon />
                    </span>
                    <span className="svp-nav-text">{item.label}</span>
                    {item.badge && <span className="svp-nav-badge">{item.badge}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="svp-sidebar-footer">
          <button 
            className="svp-logout-btn" 
            onClick={handleLogout}
            aria-label="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="svp-main-content">
        {/* Header */}
        <header className="svp-header">
          <div className="svp-header-left">
            <button 
              className="svp-menu-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="svp-page-title">
              {activeComponent === 'dashboard' && 'Dashboard Overview'}
              {activeComponent === 'services' && 'Services Management'}
              {activeComponent === 'profile' && 'Profile Settings'}
            </h1>
          </div>

          <div className="svp-header-right">
            {/* Notification Bell Component */}
            <NotificationBell />
            
            {/* Provider Profile Header Component */}
            <ProviderProfileHeader />
          </div>
        </header>

        {/* Content Area */}
        <div className="svp-content-wrapper">
          <div className="svp-dashboard-content">
            {renderComponent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceProviderDashboard;