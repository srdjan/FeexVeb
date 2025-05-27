/**
 * Data Table Component - Demonstrates JSX with sorting, filtering, and pagination
 */
import FeexVeb from "../../lib/feexveb.js";

// Sample data for the table
const sampleUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joinDate: '2023-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active', joinDate: '2023-02-20' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Editor', status: 'Inactive', joinDate: '2023-03-10' },
  { id: 4, name: 'David Wilson', email: 'david@example.com', role: 'User', status: 'Active', joinDate: '2023-04-05' },
  { id: 5, name: 'Eva Brown', email: 'eva@example.com', role: 'Admin', status: 'Active', joinDate: '2023-05-12' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'User', status: 'Pending', joinDate: '2023-06-18' },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'Active', joinDate: '2023-07-22' },
  { id: 8, name: 'Henry Taylor', email: 'henry@example.com', role: 'User', status: 'Inactive', joinDate: '2023-08-30' }
];

// Data Table Component
FeexVeb.component({
  tag: 'fx-data-table',
  
  state: {
    data: [...sampleUsers],
    filteredData: [...sampleUsers],
    searchTerm: '',
    sortField: 'name',
    sortDirection: 'asc',
    currentPage: 1,
    itemsPerPage: 5,
    selectedRows: new Set(),
    filterRole: 'all',
    filterStatus: 'all'
  },
  
  computed: {
    totalPages: (state) => Math.ceil(state.filteredData.length / state.itemsPerPage),
    
    paginatedData: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return state.filteredData.slice(start, end);
    },
    
    selectedCount: (state) => state.selectedRows.size,
    
    allVisibleSelected: (state) => {
      return state.paginatedData.length > 0 && 
             state.paginatedData.every(item => state.selectedRows.has(item.id));
    },
    
    pageInfo: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage + 1;
      const end = Math.min(state.currentPage * state.itemsPerPage, state.filteredData.length);
      return `${start}-${end} of ${state.filteredData.length}`;
    }
  },
  
  methods: {
    applyFilters: (state) => {
      let filtered = [...state.data];
      
      // Apply search filter
      if (state.searchTerm) {
        const term = state.searchTerm.toLowerCase();
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term)
        );
      }
      
      // Apply role filter
      if (state.filterRole !== 'all') {
        filtered = filtered.filter(item => item.role === state.filterRole);
      }
      
      // Apply status filter
      if (state.filterStatus !== 'all') {
        filtered = filtered.filter(item => item.status === state.filterStatus);
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        const aVal = a[state.sortField];
        const bVal = b[state.sortField];
        const modifier = state.sortDirection === 'asc' ? 1 : -1;
        
        if (aVal < bVal) return -1 * modifier;
        if (aVal > bVal) return 1 * modifier;
        return 0;
      });
      
      state.filteredData = filtered;
      state.currentPage = 1; // Reset to first page when filters change
    },
    
    updateSearch: (state, value) => {
      state.searchTerm = value;
      state.applyFilters();
    },
    
    sort: (state, field) => {
      if (state.sortField === field) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = field;
        state.sortDirection = 'asc';
      }
      state.applyFilters();
    },
    
    setPage: (state, page) => {
      state.currentPage = Math.max(1, Math.min(page, state.totalPages));
    },
    
    toggleRowSelection: (state, id) => {
      const newSelected = new Set(state.selectedRows);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      state.selectedRows = newSelected;
    },
    
    toggleAllVisible: (state) => {
      const newSelected = new Set(state.selectedRows);
      const allSelected = state.allVisibleSelected;
      
      state.paginatedData.forEach(item => {
        if (allSelected) {
          newSelected.delete(item.id);
        } else {
          newSelected.add(item.id);
        }
      });
      
      state.selectedRows = newSelected;
    },
    
    setRoleFilter: (state, role) => {
      state.filterRole = role;
      state.applyFilters();
    },
    
    setStatusFilter: (state, status) => {
      state.filterStatus = status;
      state.applyFilters();
    },
    
    deleteSelected: (state) => {
      if (state.selectedRows.size === 0) return;
      
      state.data = state.data.filter(item => !state.selectedRows.has(item.id));
      state.selectedRows = new Set();
      state.applyFilters();
    }
  },
  
  render: ({ 
    paginatedData, searchTerm, sortField, sortDirection, currentPage, totalPages, 
    selectedRows, selectedCount, allVisibleSelected, pageInfo, filterRole, filterStatus,
    updateSearch, sort, setPage, toggleRowSelection, toggleAllVisible, 
    setRoleFilter, setStatusFilter, deleteSelected 
  }) => (
    <div class="data-table">
      <h3 class="table-title">👥 User Management (JSX Data Table)</h3>
      
      {/* Filters and Search */}
      <div class="table-controls">
        <div class="search-section">
          <input
            type="text"
            class="search-input"
            placeholder="Search users..."
            value={searchTerm}
            onInput={(e) => updateSearch(e.target.value)}
          />
        </div>
        
        <div class="filter-section">
          <select 
            class="filter-select"
            value={filterRole}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="User">User</option>
          </select>
          
          <select 
            class="filter-select"
            value={filterStatus}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        
        {selectedCount > 0 && (
          <div class="bulk-actions">
            <span class="selected-count">{selectedCount} selected</span>
            <button 
              class="delete-btn"
              onclick={deleteSelected}
              title="Delete selected users"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
      
      {/* Table */}
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th class="checkbox-col">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                  title="Select all visible"
                />
              </th>
              <th class="sortable" onclick={() => sort('name')}>
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th class="sortable" onclick={() => sort('email')}>
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th class="sortable" onclick={() => sort('role')}>
                Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th class="sortable" onclick={() => sort('status')}>
                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th class="sortable" onclick={() => sort('joinDate')}>
                Join Date {sortField === 'joinDate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colspan="6" class="no-data">
                  No users found matching your criteria
                </td>
              </tr>
            ) : (
              paginatedData.map(user => (
                <tr key={user.id} class={selectedRows.has(user.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(user.id)}
                      onChange={() => toggleRowSelection(user.id)}
                    />
                  </td>
                  <td class="name-cell">{user.name}</td>
                  <td class="email-cell">{user.email}</td>
                  <td>
                    <span class={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span class={`status-badge status-${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td class="date-cell">{user.joinDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div class="pagination">
          <div class="page-info">{pageInfo}</div>
          
          <div class="page-controls">
            <button 
              class="page-btn"
              onclick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                class={`page-btn ${currentPage === page ? 'active' : ''}`}
                onclick={() => setPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              class="page-btn"
              onclick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
});
