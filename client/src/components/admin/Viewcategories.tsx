import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff,
  FaSpinner,
  FaFilter,
  FaSortAmountDown,
  FaFolderOpen,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaListAlt,
  FaTimes,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
  FaDatabase,
  FaChevronRight,
  FaChevronLeft,
  FaEye,
} from 'react-icons/fa';
import { useToast } from '../../../store/toastStore';
import { useTokenStore } from '../../../store/tokenStore';
import UpdateCategory from './Updatecategorycomponent';
import DeleteCategory from './Deletecategorycomponent';
import './viewcategories.css';

interface ServiceCategory {
  id: number;
  category_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface ViewCategoriesProps {
  onAddNew: () => void;
  refreshTrigger?: number;
}

interface FetchError {
  message: string;
  detail?: string;
}

const ViewCategories: React.FC<ViewCategoriesProps> = ({ onAddNew, refreshTrigger = 0 }) => {
  const { showToast } = useToast();
  const { getAccessToken, isAuthenticated } = useTokenStore();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'newest' | 'oldest'>('name');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCategories = async (): Promise<ServiceCategory[]> => {
    const token = getAccessToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/get-all-categories/`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `Failed to fetch categories: ${response.status}`
        );
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ServiceCategory[], FetchError>({
    queryKey: ['serviceCategories'],
    queryFn: fetchCategories,
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 seconds - more frequent updates
    gcTime: 60000, // 1 minute cache
    enabled: isAuthenticated,
  });

  // Auto-refresh when refreshTrigger changes (when new category is added)
  useEffect(() => {
    if (refreshTrigger > 0) {
      handleManualRefresh();
    }
  }, [refreshTrigger]);

  // Setup auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      setLastRefresh(new Date());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (isError && error) {
      showToast(error.message || 'Failed to load categories', 'error', 4);
    }
  }, [isError, error, showToast]);

  const filteredCategories = categories
    .filter(category => {
      const matchesSearch = searchTerm === '' || 
        category.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = 
        filterActive === 'all' || 
        (filterActive === 'active' && category.is_active) ||
        (filterActive === 'inactive' && !category.is_active);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.category_name.localeCompare(b.category_name);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return 0;
      }
    });

  // Pagination logic
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const activeCategoriesCount = categories.filter(c => c.is_active).length;
  const inactiveCategoriesCount = categories.filter(c => !c.is_active).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['serviceCategories'] });
      await refetch();
      setLastRefresh(new Date());
      showToast('Categories refreshed successfully!', 'success', 2);
    } catch (error) {
      console.error('Error refreshing categories:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRetry = () => {
    handleManualRefresh();
  };

  const handleEdit = (id: number) => {
    setEditingCategoryId(id);
  };

  const handleDelete = (id: number) => {
    setDeletingCategoryId(id);
  };

  const handleEditClose = () => {
    setEditingCategoryId(null);
    handleManualRefresh();
  };

  const handleDeleteClose = () => {
    setDeletingCategoryId(null);
    handleManualRefresh();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of list
    const container = document.querySelector('.cat-view-cards-grid');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterActive('all');
    setCurrentPage(1);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="cat-view-container">
        <div className="cat-view-header">
          <div className="cat-view-header-left">
            <div className="cat-view-title-group">
              <h1 className="cat-view-main-title">
                <span className="cat-view-title-icon-wrapper">
                  <FaListAlt className="cat-view-title-icon" />
                </span>
                Service Categories
              </h1>
              <p className="cat-view-subtitle">Managing all service categories</p>
            </div>
          </div>
        </div>

        <div className="cat-view-loading-state">
          <div className="cat-view-loading-spinner-container">
            <FaSpinner className="cat-view-loading-spinner" />
          </div>
          <h3 className="cat-view-loading-title">Loading Categories</h3>
          <p className="cat-view-loading-text">
            Fetching your service categories from the database...
          </p>
          <div className="cat-view-loading-progress">
            <div className="cat-view-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="cat-view-container">
        <div className="cat-view-header">
          <div className="cat-view-header-left">
            <div className="cat-view-title-group">
              <h1 className="cat-view-main-title">
                <span className="cat-view-title-icon-wrapper">
                  <FaListAlt className="cat-view-title-icon" />
                </span>
                Service Categories
              </h1>
              <p className="cat-view-subtitle">Managing all service categories</p>
            </div>
          </div>
          <button onClick={onAddNew} className="cat-view-add-btn">
            <FaPlus className="cat-view-add-icon" />
            Add Category
          </button>
        </div>

        <div className="cat-view-error-state">
          <div className="cat-view-error-icon">
            <FaExclamationTriangle />
          </div>
          <h3 className="cat-view-error-title">Unable to Load Categories</h3>
          <p className="cat-view-error-message">
            {error?.message || 'There was an error connecting to the server.'}
          </p>
          <div className="cat-view-error-actions">
            <button onClick={handleRetry} className="cat-view-retry-btn">
            <button onClick={handleRetry} className="cat-view-retry-btn">
              <FaSync className="cat-view-retry-icon" />
              Try Again
            </button>
              <FaPlus /> Add Category Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cat-view-container">
      {/* Modals */}
      {editingCategoryId && (
        <div className="cat-view-modal-overlay">
          <div className="cat-view-modal">
            <UpdateCategory
              categoryId={editingCategoryId}
              onClose={handleEditClose}
            />
          </div>
        </div>
      )}
      
      {deletingCategoryId && (
        <div className="cat-view-modal-overlay">
          <div className="cat-view-modal">
            <DeleteCategory
              categoryId={deletingCategoryId}
              onClose={handleDeleteClose}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="cat-view-header">
        <div className="cat-view-header-left">
          <div className="cat-view-title-group">
            <h1 className="cat-view-main-title">
              <span className="cat-view-title-icon-wrapper">
                <FaListAlt className="cat-view-title-icon" />
              </span>
              Service Categories
            </h1>
            <p className="cat-view-subtitle">Manage and organize all service categories</p>
          </div>
          
          <div className="cat-view-refresh-info">
            <button 
              onClick={handleManualRefresh}
              className="cat-view-refresh-btn"
              disabled={isRefreshing || isFetching}
              title="Refresh categories"
            >
              <FaSync className={`cat-view-refresh-icon ${isRefreshing || isFetching ? 'cat-view-refreshing' : ''}`} />
              {isRefreshing || isFetching ? 'Refreshing...' : 'Refresh'}
            </button>
            <span className="cat-view-last-refresh">
              Last updated: {formatTimeAgo(lastRefresh)}
            </span>
          </div>
        </div>

        <div className="cat-view-header-right">
          <button onClick={onAddNew} className="cat-view-add-btn">
            <FaPlus className="cat-view-add-icon" />
            Add New Category
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="cat-view-stats-grid">
        <div className="cat-view-stat-card">
          <div className="cat-view-stat-content">
            <div className="cat-view-stat-icon">
              <FaDatabase />
            </div>
            <div className="cat-view-stat-info">
              <div className="cat-view-stat-number">{categories.length}</div>
              <div className="cat-view-stat-label">Total Categories</div>
            </div>
          </div>
        </div>

        <div className="cat-view-stat-card cat-view-stat-active">
          <div className="cat-view-stat-content">
            <div className="cat-view-stat-icon">
              <FaCheckCircle />
            </div>
            <div className="cat-view-stat-info">
              <div className="cat-view-stat-number">{activeCategoriesCount}</div>
              <div className="cat-view-stat-label">Active</div>
            </div>
          </div>
        </div>

        <div className="cat-view-stat-card cat-view-stat-inactive">
          <div className="cat-view-stat-content">
            <div className="cat-view-stat-icon">
              <FaTimesCircle />
            </div>
            <div className="cat-view-stat-info">
              <div className="cat-view-stat-number">{inactiveCategoriesCount}</div>
              <div className="cat-view-stat-label">Inactive</div>
            </div>
          </div>
        </div>

        <div className="cat-view-stat-card cat-view-stat-display">
          <div className="cat-view-stat-content">
            <div className="cat-view-stat-icon">
              <FaEye />
            </div>
            <div className="cat-view-stat-info">
              <div className="cat-view-stat-number">{filteredCategories.length}</div>
              <div className="cat-view-stat-label">Displayed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="cat-view-controls-bar">
        <div className="cat-view-search-container">
          <div className="cat-view-search-wrapper">
            <FaSearch className="cat-view-search-icon" />
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="cat-view-search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="cat-view-search-clear"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        <div className="cat-view-filters-container">
          <div className="cat-view-filter-group">
            <div className="cat-view-filter-label">
              <FaFilter className="cat-view-filter-icon" />
              <span>Filter by Status</span>
            </div>
            <div className="cat-view-filter-buttons">
              <button
                className={`cat-view-filter-btn ${filterActive === 'all' ? 'cat-view-filter-active' : ''}`}
                onClick={() => {
                  setFilterActive('all');
                  setCurrentPage(1);
                }}
              >
                All
              </button>
              <button
                className={`cat-view-filter-btn ${filterActive === 'active' ? 'cat-view-filter-active' : ''}`}
                onClick={() => {
                  setFilterActive('active');
                  setCurrentPage(1);
                }}
              >
                <FaToggleOn className="cat-view-filter-btn-icon" />
                Active
              </button>
              <button
                className={`cat-view-filter-btn ${filterActive === 'inactive' ? 'cat-view-filter-active' : ''}`}
                onClick={() => {
                  setFilterActive('inactive');
                  setCurrentPage(1);
                }}
              >
                <FaToggleOff className="cat-view-filter-btn-icon" />
                Inactive
              </button>
            </div>
          </div>

          <div className="cat-view-filter-group">
            <div className="cat-view-filter-label">
              <FaSortAmountDown className="cat-view-filter-icon" />
              <span>Sort By</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'name' | 'newest' | 'oldest');
                setCurrentPage(1);
              }}
              className="cat-view-sort-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="cat-view-filter-group">
            <div className="cat-view-filter-label">
              <span>Items per page</span>
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="cat-view-items-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          {(searchTerm || filterActive !== 'all') && (
            <button onClick={clearFilters} className="cat-view-clear-filters">
              <FaTimes className="cat-view-clear-icon" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      {currentCategories.length === 0 ? (
        <div className="cat-view-empty-state">
          <div className="cat-view-empty-content">
            <div className="cat-view-empty-icon">
              <FaFolderOpen />
            </div>
            <h3 className="cat-view-empty-title">
              {searchTerm || filterActive !== 'all' ? 'No Categories Found' : 'No Categories Yet'}
            </h3>
            <p className="cat-view-empty-message">
              {searchTerm 
                ? `No categories found for "${searchTerm}". Try different search terms.`
                : filterActive !== 'all'
                  ? `No ${filterActive} categories found.`
                  : 'Start by creating your first service category.'}
            </p>
            <div className="cat-view-empty-actions">
              {!searchTerm && filterActive === 'all' ? (
                <button onClick={onAddNew} className="cat-view-empty-primary-btn">
                  <FaPlus /> Create First Category
                </button>
              ) : (
                <button onClick={clearFilters} className="cat-view-empty-secondary-btn">
                  Clear Search & Filters
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="cat-view-cards-grid">
            {currentCategories.map((category) => (
              <div key={category.id} className="cat-view-card">
                <div className="cat-view-card-header">
                  <div className="cat-view-card-badge">
                    {category.is_active ? (
                      <span className="cat-view-badge-active">
                        <FaToggleOn /> Active
                      </span>
                    ) : (
                      <span className="cat-view-badge-inactive">
                        <FaToggleOff /> Inactive
                      </span>
                    )}
                  </div>
                  <div className="cat-view-card-actions">
                    <button
                      onClick={() => handleEdit(category.id)}
                      className="cat-view-action-btn cat-view-edit-btn"
                      title="Edit category"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="cat-view-action-btn cat-view-delete-btn"
                      title="Delete category"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="cat-view-card-content">
                  <div className="cat-view-card-title">
                    <div className="cat-view-card-icon">
                      <FaListAlt />
                    </div>
                    <h3 className="cat-view-category-name">{category.category_name}</h3>
                  </div>
                  
                  <div className="cat-view-card-description">
                    <p>{category.description || 'No description provided.'}</p>
                  </div>

                  <div className="cat-view-card-meta">
                    <div className="cat-view-meta-item">
                      <FaCalendarAlt className="cat-view-meta-icon" />
                      <span className="cat-view-meta-text">
                        Created: {formatDate(category.created_at)}
                      </span>
                    </div>
                    <div className="cat-view-meta-item">
                      <span className="cat-view-meta-id">ID: {category.id}</span>
                    </div>
                  </div>
                </div>

                <div className="cat-view-card-footer">
                  <div className="cat-view-card-status">
                    <span className={`cat-view-status-indicator ${category.is_active ? 'cat-view-status-active' : 'cat-view-status-inactive'}`}></span>
                    {category.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="cat-view-pagination">
              <div className="cat-view-pagination-info">
                Showing {startIndex + 1} to {endIndex} of {totalItems} categories
              </div>
              
              <div className="cat-view-pagination-controls">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cat-view-pagination-btn cat-view-pagination-prev"
                >
                  <FaChevronLeft />
                  Previous
                </button>

                <div className="cat-view-pagination-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`cat-view-pagination-number ${currentPage === pageNum ? 'cat-view-pagination-active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="cat-view-pagination-ellipsis">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`cat-view-pagination-number ${currentPage === totalPages ? 'cat-view-pagination-active' : ''}`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cat-view-pagination-btn cat-view-pagination-next"
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="cat-view-results-summary">
            <div className="cat-view-summary-content">
              <span className="cat-view-summary-count">
                Displaying {currentCategories.length} of {filteredCategories.length} filtered categories
                {categories.length !== filteredCategories.length && 
                  ` (from ${categories.length} total)`}
              </span>
              <div className="cat-view-summary-filters">
                {searchTerm && (
                  <span className="cat-view-summary-filter">
                    Search: "{searchTerm}"
                  </span>
                )}
                {filterActive !== 'all' && (
                  <span className="cat-view-summary-filter">
                    Status: {filterActive}
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Auto-refresh indicator */}
      {(isRefreshing || isFetching) && (
        <div className="cat-view-refresh-indicator">
          <FaSpinner className="cat-view-refresh-indicator-spinner" />
          <span>Updating categories...</span>
        </div>
      )}
    </div>
  );
};

export default ViewCategories;