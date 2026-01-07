import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminuserdashboard.css'
import { useTokenStore } from '../../../store/tokenStore';
import { useToast } from '../../../store/toastStore';

// Import React Icons
import { 
  FaSignOutAlt,
  FaUserShield,
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaTools,
  FaUsers,
  FaCog
} from 'react-icons/fa';

// Import admin components (you'll need to create these)
import AdminProfileHeader from '../../components/admin/Adminprofileheader';
import AdminNotificationBell from '../../components/admin/adminnotificationbell';
import AdminOverview from '../../components/admin/Adminoverview';
import AdminServices from '../../components/admin/Adminservices';
import AdminClients from '../../components/admin/Adminclients';
import AdminSettings from '../../components/admin/Adminsettings';

const AdminDashboard = () => {
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
    if (userRole !== 'admin') {
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
      const sidebar = document.querySelector('.adm-sidebar');
      const toggleButton = document.querySelector('.adm-menu-toggle');
      
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
        return <AdminOverview />;
      case 'services':
        return <AdminServices />;
      case 'clients':
        return <AdminClients />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
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
      label: 'Dashboard',
      active: activeComponent === 'overview',
      description: 'Admin dashboard analytics'
    },
    {
      id: 'services',
      icon: FaTools,
      label: 'Services',
      badge: '42',
      active: activeComponent === 'services',
      description: 'Manage all services'
    },
    {
      id: 'clients',
      icon: FaUsers,
      label: 'Clients',
      badge: '128',
      active: activeComponent === 'clients',
      description: 'Client management'
    },
    {
      id: 'settings',
      icon: FaCog,
      label: 'Settings',
      active: activeComponent === 'settings',
      description: 'System configuration'
    }
  ];

  const pageTitles = {
    overview: 'Admin Dashboard',
    services: 'Services Management',
    clients: 'Client Management',
    settings: 'System Settings'
  };

  return (
    <div className="adm-dashboard-container">
      {/* Mobile overlay */}
      <div 
        className={`adm-sidebar-overlay ${sidebarOpen ? 'adm-sidebar-overlay-open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'adm-sidebar-open' : ''}`}>
        <div className="adm-sidebar-header">
          <div className="adm-sidebar-logo">
            <div className="adm-logo-icon">
              <FaUserShield />
            </div>
            <div>
              <div className="adm-logo-text">HELPR</div>
              <div className="adm-logo-subtext">ADMIN DASHBOARD</div>
            </div>
          </div>
        </div>

        <div className="adm-nav-section">
          <div className="adm-nav-group">
            <div className="adm-nav-group-title">Administration</div>
            <ul className="adm-nav-list">
              {menuItems.map((item) => (
                <li key={item.id} className="adm-nav-item">
                  <a
                    href="#"
                    className={`adm-nav-link ${item.active ? 'adm-nav-link-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuItemClick(item.id);
                    }}
                    title={item.description}
                  >
                    <span className="adm-nav-icon">
                      <item.icon />
                    </span>
                    <span className="adm-nav-text">{item.label}</span>
                    {item.badge && <span className="adm-nav-badge">{item.badge}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="adm-sidebar-footer">
          <button 
            className="adm-logout-btn" 
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="adm-main-content">
        {/* Header */}
        <header className="adm-header">
          <div className="adm-header-left">
            <button 
              className="adm-menu-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="adm-page-title">
              {pageTitles[activeComponent as keyof typeof pageTitles]}
            </h1>
          </div>

          <div className="adm-header-right">
            {/* Admin Notification Bell Component */}
            <AdminNotificationBell />
            
            {/* Admin Profile Header Component */}
            <AdminProfileHeader />
          </div>
        </header>

        {/* Content Area */}
        <div className="adm-content-wrapper">
          <div className="adm-dashboard-content">
            {renderComponent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;