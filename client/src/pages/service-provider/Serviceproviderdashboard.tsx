import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './service-provider-dashboard.css';
import { useTokenStore } from '../../../store/tokenStore';
import { useToast } from '../../../store/toastStore';

// Import React Icons
import { 
  FaSignOutAlt,
  FaHandsHelping,
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaTools,
  FaCog,
  FaCreditCard
} from 'react-icons/fa';

// Import separated components
import ProviderProfileHeader from '../../components/serviceProvider/Providerprofileheader';
import NotificationBell from '../../components/serviceProvider/Notificationbell';
import Overview from '../../components/serviceProvider/ServiceproviderdashOverview';
import Services from '../../components/serviceProvider/Services';
import Profile from '../../components/serviceProvider/Profile';
import Billings from '../../components/serviceProvider/Billings';

const ServiceProviderDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('overview');
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
      case 'overview':
        return <Overview />;
      case 'services':
        return <Services />;
      case 'profile':
        return <Profile />;
      case 'billings':
        return <Billings />;
      default:
        return <Overview />;
    }
  };

  // Don't render anything if not authenticated
  if (!isAuthenticated || !tokenData) {
    return null;
  }

  // Menu items data with React Icons
  const menuItems = [
    {
      id: 'overview',
      icon: FaTachometerAlt,
      label: 'Overview',
      active: activeComponent === 'overview',
      description: 'Dashboard analytics'
    },
    {
      id: 'services',
      icon: FaTools,
      label: 'Services',
      badge: '24',
      active: activeComponent === 'services',
      description: 'Manage your services'
    },
    {
      id: 'profile',
      icon: FaCog,
      label: 'Profile',
      active: activeComponent === 'profile',
      description: 'Account settings'
    },
    {
      id: 'billings',
      icon: FaCreditCard,
      label: 'Billings',
      badge: '5',
      active: activeComponent === 'billings',
      description: 'Payments & invoices'
    }
  ];

  const pageTitles = {
    overview: 'Dashboard Overview',
    services: 'Services Management',
    profile: 'Profile Settings',
    billings: 'Billing & Payments'
  };

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
              <div className="svp-logo-subtext">PROVIDER DASHBOARD</div>
            </div>
          </div>
        </div>

        <div className="svp-nav-section">
          <div className="svp-nav-group">
            <div className="svp-nav-group-title">Navigation</div>
            <ul className="svp-nav-list">
              {menuItems.map((item) => (
                <li key={item.id} className="svp-nav-item">
                  <a
                    href="#"
                    className={`svp-nav-link ${item.active ? 'svp-nav-link-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuItemClick(item.id);
                    }}
                    title={item.description}
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
            <FaSignOutAlt />
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
              {pageTitles[activeComponent as keyof typeof pageTitles]}
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