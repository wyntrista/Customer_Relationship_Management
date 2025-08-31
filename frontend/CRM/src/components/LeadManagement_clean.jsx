import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthService from '../services/auth.service';
import userService from '../services/user.service';
import './LeadManagement.css';

const LeadManagement = () => {
  // State variables
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser] = useState(AuthService.getCurrentUser);
  
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false,
    sortBy: 'updatedAt',
    sortDirection: 'desc'
  });

  const [filters, setFilters] = useState({
    search: '',
    fullName: '',
    phone: '',
    email: '',
    company: '',
    province: '',
    source: '',
    status: '',
    assignedUserId: '',
    myAssignedLeads: false,
    myCreatedLeads: false,
    createdDateFrom: null,
    createdDateTo: null
  });

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    province: '',
    source: '',
    status: 'CHUA_GOI',
    assignedUserId: null,
    notes: ''
  });

  // Constants
  const provinces = [
    { value: 'HN', label: 'Hà Nội' },
    { value: 'HCM', label: 'TP. Hồ Chí Minh' },
    { value: 'DN', label: 'Đà Nẵng' },
    { value: 'HP', label: 'Hải Phòng' },
    { value: 'CT', label: 'Cần Thơ' },
    { value: 'AG', label: 'An Giang' },
    { value: 'BL', label: 'Bạc Liêu' },
    { value: 'BV', label: 'Bà Rịa - Vũng Tàu' },
    { value: 'BD', label: 'Bình Dương' },
    { value: 'BT', label: 'Bình Thuận' },
    { value: 'BPH', label: 'Bình Phước' },
    { value: 'BD', label: 'Bình Định' },
    { value: 'CG', label: 'Cao Bằng' },
    { value: 'DT', label: 'Đồng Tháp' },
    { value: 'GL', label: 'Gia Lai' },
    { value: 'HG', label: 'Hà Giang' },
    { value: 'HN', label: 'Hà Nam' },
    { value: 'HT', label: 'Hà Tĩnh' },
    { value: 'HD', label: 'Hải Dương' },
    { value: 'HB', label: 'Hòa Bình' },
    { value: 'HY', label: 'Hưng Yên' },
    { value: 'KH', label: 'Khánh Hòa' },
    { value: 'KG', label: 'Kiên Giang' },
    { value: 'KT', label: 'Kon Tum' },
    { value: 'LC', label: 'Lào Cai' },
    { value: 'LD', label: 'Lâm Đồng' },
    { value: 'LS', label: 'Lạng Sơn' },
    { value: 'LCH', label: 'Long An' },
    { value: 'ND', label: 'Nam Định' },
    { value: 'NA', label: 'Nghệ An' },
    { value: 'NB', label: 'Ninh Bình' },
    { value: 'NT', label: 'Ninh Thuận' },
    { value: 'PY', label: 'Phú Yên' },
    { value: 'PT', label: 'Phú Thọ' },
    { value: 'QB', label: 'Quảng Bình' },
    { value: 'QN', label: 'Quảng Nam' },
    { value: 'QNG', label: 'Quảng Ngãi' },
    { value: 'QNI', label: 'Quảng Ninh' },
    { value: 'QT', label: 'Quảng Trị' },
    { value: 'ST', label: 'Sóc Trăng' },
    { value: 'SL', label: 'Sơn La' },
    { value: 'TY', label: 'Tây Ninh' },
    { value: 'TB', label: 'Thái Bình' },
    { value: 'TN', label: 'Thái Nguyên' },
    { value: 'TH', label: 'Thanh Hóa' },
    { value: 'HU', label: 'Thừa Thiên Huế' },
    { value: 'TG', label: 'Tiền Giang' },
    { value: 'TV', label: 'Trà Vinh' },
    { value: 'TQ', label: 'Tuyên Quang' },
    { value: 'VL', label: 'Vĩnh Long' },
    { value: 'VP', label: 'Vĩnh Phúc' },
    { value: 'YB', label: 'Yên Bái' }
  ];

  const sourceOptions = [
    { value: 'FACEBOOK', label: 'Facebook' },
    { value: 'GOOGLE', label: 'Google' },
    { value: 'WEBSITE', label: 'Website' },
    { value: 'GIOI_THIEU', label: 'Giới thiệu' },
    { value: 'HOTLINE', label: 'Hotline' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'OFFLINE', label: 'Offline' },
    { value: 'KHAC', label: 'Khác' }
  ];

  const leadStatuses = [
    { value: 'CHUA_GOI', label: 'Chưa gọi' },
    { value: 'DA_GOI', label: 'Đã gọi' },
    { value: 'QUAN_TAM', label: 'Quan tâm' },
    { value: 'KHONG_QUAN_TAM', label: 'Không quan tâm' },
    { value: 'THANH_CONG', label: 'Thành công' },
    { value: 'THAT_BAI', label: 'Thất bại' }
  ];

  // Helper functions
  const getProvinceLabel = (value) => {
    const province = provinces.find(p => p.value === value);
    return province ? province.label : value || '-';
  };

  const getSourceLabel = (value) => {
    const source = sourceOptions.find(s => s.value === value);
    return source ? source.label : value || '-';
  };

  const getStatusLabel = (value) => {
    const status = leadStatuses.find(s => s.value === value);
    return status ? status.label : value || '-';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CHUA_GOI': return 'bg-secondary';
      case 'DA_GOI': return 'bg-info';
      case 'QUAN_TAM': return 'bg-warning text-dark';
      case 'KHONG_QUAN_TAM': return 'bg-danger';
      case 'THANH_CONG': return 'bg-success';
      case 'THAT_BAI': return 'bg-dark';
      default: return 'bg-secondary';
    }
  };

  const getAssignedUserLabel = (userId) => {
    if (!userId) return 'Chưa gán';
    const user = users.find(u => u.id === userId);
    return user ? (user.fullName || user.username) : 'Chưa xác định';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return '';
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  // API functions
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const token = AuthService.getToken();
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        size: pagination.size.toString(),
        sortBy: pagination.sortBy,
        sortDirection: pagination.sortDirection
      });

      // Add filters
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.fullName) queryParams.append('fullName', filters.fullName);
      if (filters.phone) queryParams.append('phone', filters.phone);
      if (filters.email) queryParams.append('email', filters.email);
      if (filters.company) queryParams.append('company', filters.company);
      if (filters.province) queryParams.append('province', filters.province);
      if (filters.source) queryParams.append('source', filters.source);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.assignedUserId) queryParams.append('assignedUserId', filters.assignedUserId);
      if (filters.myAssignedLeads) queryParams.append('myAssignedLeads', 'true');
      if (filters.myCreatedLeads) queryParams.append('myCreatedLeads', 'true');
      if (filters.createdDateFrom) queryParams.append('createdDateFrom', filters.createdDateFrom.toISOString().split('T')[0]);
      if (filters.createdDateTo) queryParams.append('createdDateTo', filters.createdDateTo.toISOString().split('T')[0]);

      const response = await fetch(`/api/leads/page?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch leads');

      const data = await response.json();
      setLeads(data.content);
      setFilteredLeads(data.content);
      setPagination(prev => ({
        ...prev,
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        first: data.first,
        last: data.last,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious
      }));
    } catch (error) {
      console.error('Error fetching leads:', error);
      alert('Lỗi khi tải danh sách leads: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, pagination.sortBy, pagination.sortDirection, filters]);

  const fetchLeadDetails = async (leadId) => {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`/api/leads/${leadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch lead details');

      const data = await response.json();
      setSelectedLead(data);
    } catch (error) {
      console.error('Error fetching lead details:', error);
      alert('Lỗi khi tải chi tiết lead: ' + error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  // Event handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: parseInt(newSize), page: 0 }));
  };

  const handleSortChange = (column) => {
    setPagination(prev => ({
      ...prev,
      sortBy: column,
      sortDirection: prev.sortBy === column && prev.sortDirection === 'asc' ? 'desc' : 'asc',
      page: 0
    }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      fullName: '',
      phone: '',
      email: '',
      company: '',
      province: '',
      source: '',
      status: '',
      assignedUserId: '',
      myAssignedLeads: false,
      myCreatedLeads: false,
      createdDateFrom: null,
      createdDateTo: null
    });
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.fullName) count++;
    if (filters.phone) count++;
    if (filters.email) count++;
    if (filters.company) count++;
    if (filters.province) count++;
    if (filters.source) count++;
    if (filters.status) count++;
    if (filters.assignedUserId) count++;
    if (filters.myAssignedLeads) count++;
    if (filters.myCreatedLeads) count++;
    if (filters.createdDateFrom) count++;
    if (filters.createdDateTo) count++;
    return count;
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    try {
      const token = AuthService.getToken();
      const url = editingLead ? `/api/leads/${editingLead.id}` : '/api/leads';
      const method = editingLead ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to save lead');
      }

      alert(editingLead ? 'Cập nhật lead thành công!' : 'Thêm lead mới thành công!');
      setShowAddModal(false);
      setEditingLead(null);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        company: '',
        province: '',
        source: '',
        status: 'CHUA_GOI',
        assignedUserId: null,
        notes: ''
      });
      fetchLeads();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Lỗi khi lưu lead: ' + error.message);
    }
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setFormData({
      fullName: lead.fullName || '',
      phone: lead.phone || '',
      email: lead.email || '',
      company: lead.company || '',
      province: lead.province || '',
      source: lead.source || '',
      status: lead.status || 'CHUA_GOI',
      assignedUserId: lead.assignedUserId || null,
      notes: lead.notes || ''
    });
    setSelectedLead(null);
    setShowAddModal(true);
  };

  const handleDeleteLead = async (lead) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa lead "${lead.fullName}"?`)) {
      return;
    }

    try {
      const token = AuthService.getToken();
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete lead');

      alert('Xóa lead thành công!');
      setSelectedLead(null);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Lỗi khi xóa lead: ' + error.message);
    }
  };

  // Effects
  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, [fetchLeads]);

  // Render
  return (
    <div className="lead-management-container">
      {/* Header */}
      <div className="header-section">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">
              <i className="fas fa-users me-2 text-primary"></i>
              Quản lý Lead
            </h2>
            <p className="text-muted mb-0">
              Quản lý danh sách khách hàng tiềm năng
            </p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={clearFilters}
              title="Xóa tất cả bộ lọc"
            >
              <i className="fas fa-eraser me-1"></i>
              Xóa lọc
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Thêm Lead
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sticky Search & Filter Section */}
        <div className="sticky-filter-section">
          {/* Global Search */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm theo tên, phone, email, công ty..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="text-muted">
                Tổng số lead: <strong>{pagination.totalElements}</strong>
              </span>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="filter-section bg-light p-3 rounded mb-3">
            <div className="row g-2">
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={filters.fullName}
                  onChange={(e) => handleFilterChange('fullName', e.target.value)}
                  placeholder="Tên khách hàng"
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={filters.phone}
                  onChange={(e) => handleFilterChange('phone', e.target.value)}
                  placeholder="Số điện thoại"
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  placeholder="Công ty"
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select form-select-sm"
                  value={filters.province}
                  onChange={(e) => handleFilterChange('province', e.target.value)}
                >
                  <option value="">Tất cả tỉnh/thành</option>
                  {provinces.map(province => (
                    <option key={province.value} value={province.value}>
                      {province.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 text-center">
                <button
                  type="button"
                  className="btn btn-primary btn-sm me-1"
                  onClick={applyFilters}
                  style={{ minWidth: '60px' }}
                >
                  <i className="fas fa-filter me-1"></i>
                  Lọc
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={clearFilters}
                  style={{ minWidth: '50px' }}
                >
                  <i className="fas fa-eraser me-1"></i>
                  Xóa
                </button>
              </div>
            </div>

            {/* Second row of filters */}
            <div className="row g-2 mt-2">
              <div className="col-md-2">
                <select
                  className="form-select form-select-sm"
                  value={filters.source}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                >
                  <option value="">Tất cả nguồn</option>
                  {sourceOptions.map(source => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select form-select-sm"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  {leadStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select form-select-sm"
                  value={filters.assignedUserId}
                  onChange={(e) => handleFilterChange('assignedUserId', e.target.value)}
                >
                  <option value="">Tất cả người phụ trách</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.fullName || user.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="myAssignedLeads"
                    checked={filters.myAssignedLeads}
                    onChange={(e) => handleFilterChange('myAssignedLeads', e.target.checked)}
                  />
                  <label className="form-check-label text-muted small" htmlFor="myAssignedLeads">
                    Lead của tôi
                  </label>
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="myCreatedLeads"
                    checked={filters.myCreatedLeads}
                    onChange={(e) => handleFilterChange('myCreatedLeads', e.target.checked)}
                  />
                  <label className="form-check-label text-muted small" htmlFor="myCreatedLeads">
                    Lead tôi tạo
                  </label>
                </div>
              </div>
              <div className="col-md-2">
                {getActiveFiltersCount() > 0 && (
                  <span className="badge bg-info">
                    {getActiveFiltersCount()} bộ lọc
                  </span>
                )}
              </div>
            </div>

            {/* Third row with date filters */}
            <div className="row g-2 mt-3">
              <div className="col-md-3">
                <label className="form-label text-muted small">Từ ngày</label>
                <DatePicker
                  selected={filters.createdDateFrom}
                  onChange={(date) => handleFilterChange('createdDateFrom', date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn từ ngày"
                  className="form-control form-control-sm"
                  maxDate={new Date()}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label text-muted small">Đến ngày</label>
                <DatePicker
                  selected={filters.createdDateTo}
                  onChange={(date) => handleFilterChange('createdDateTo', date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn đến ngày"
                  className="form-control form-control-sm"
                  minDate={filters.createdDateFrom}
                  maxDate={new Date()}
                />
              </div>
              <div className="col-md-6 d-flex align-items-end">
                <div className="text-muted small">
                  <i className="fas fa-info-circle me-1"></i>
                  Click vào ô ngày để mở lịch. Chọn "Từ ngày" trước, sau đó chọn "Đến ngày"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Lead List */}
        <div className="scrollable-table-container">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light sticky-top">
                <tr>
                  <th 
                    style={{ width: '180px', minWidth: '180px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('fullName')}
                    title="Nhấn để sắp xếp"
                  >
                    Tên khách hàng
                    {pagination.sortBy === 'fullName' && (
                      <i className={`fas fa-sort-${pagination.sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </th>
                  <th 
                    style={{ width: '120px', minWidth: '120px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('phone')}
                    title="Nhấn để sắp xếp"
                  >
                    Điện thoại
                    {pagination.sortBy === 'phone' && (
                      <i className={`fas fa-sort-${pagination.sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </th>
                  <th 
                    style={{ width: '200px', minWidth: '200px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('email')}
                    title="Nhấn để sắp xếp"
                  >
                    Email
                    {pagination.sortBy === 'email' && (
                      <i className={`fas fa-sort-${pagination.sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </th>
                  <th 
                    style={{ width: '150px', minWidth: '150px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('company')}
                    title="Nhấn để sắp xếp"
                  >
                    Công ty
                    {pagination.sortBy === 'company' && (
                      <i className={`fas fa-sort-${pagination.sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </th>
                  <th 
                    style={{ width: '120px', minWidth: '120px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('province')}
                    title="Nhấn để sắp xếp"
                  >
                    Tỉnh/TP
                    {pagination.sortBy === 'province' && (
                      <i className={`fas fa-sort-${pagination.sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </th>
                  <th 
                    style={{ width: '100px', minWidth: '100px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('source')}
                    title="Nhấn để sắp xếp"
                  >
                    Nguồn
                    {pagination.sortBy === 'source' && (
                      <i className={`fas fa-sort-${pagination.sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </th>
                  <th 
                    style={{ width: '120px', minWidth: '120px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('status')}
                    title="Nhấn để sắp xếp"
                  >
                    Trạng thái
                    {pagination.sortBy === 'status' && (
                      <i className={`fas fa-sort-${pagination.sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </th>
                  <th style={{ width: '140px', minWidth: '140px' }}>Người phụ trách</th>
                  <th 
                    style={{ width: '120px', minWidth: '120px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('updatedAt')}
                    title="Nhấn để sắp xếp"
                  >
                    Cập nhật
                    {pagination.sortBy === 'updatedAt' && (
                      <i className={`fas fa-sort-${pagination.sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </th>
                  <th 
                    style={{ width: '120px', minWidth: '120px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('createdAt')}
                    title="Nhấn để sắp xếp"
                  >
                    Ngày tạo
                    {pagination.sortBy === 'createdAt' && (
                      <i className={`fas fa-sort-${pagination.sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                      </div>
                      <div className="mt-2">Đang tải danh sách lead...</div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-5">
                      <i className="fas fa-search fa-2x mb-3 text-muted"></i>
                      <br />
                      {leads.length === 0 ? (
                        <div>
                          <strong>Chưa có lead nào trong hệ thống</strong>
                          <br />
                          <small>Hãy nhấn "Thêm Lead" để tạo lead đầu tiên</small>
                        </div>
                      ) : (
                        <div>
                          <strong>Không có lead nào phù hợp với bộ lọc</strong>
                          <br />
                          <small>Thử điều chỉnh bộ lọc để xem các lead khác</small>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className="clickable-row"
                      onClick={() => fetchLeadDetails(lead.id)}
                      style={{ cursor: 'pointer' }}
                      title="Nhấn để xem chi tiết"
                    >
                      <td className="text-truncate" style={{ maxWidth: '180px' }} title={lead.fullName}>
                        {lead.fullName}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '120px' }} title={lead.phone}>
                        {lead.phone}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '200px' }} title={lead.email || '-'}>
                        {lead.email || '-'}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '150px' }} title={lead.company || '-'}>
                        {lead.company || '-'}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '120px' }} title={getProvinceLabel(lead.province)}>
                        {getProvinceLabel(lead.province)}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '100px' }} title={getSourceLabel(lead.source)}>
                        {getSourceLabel(lead.source)}
                      </td>
                      <td style={{ maxWidth: '120px' }}>
                        <span className={`badge ${getStatusBadgeClass(lead.status)} text-truncate`} style={{ maxWidth: '110px' }}>
                          {getStatusLabel(lead.status)}
                        </span>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '140px' }} title={getAssignedUserLabel(lead.assignedUserId)}>
                        {getAssignedUserLabel(lead.assignedUserId)}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '120px' }} title={formatDate(lead.updatedAt)}>
                        {formatDate(lead.updatedAt)}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '120px' }} title={formatDate(lead.createdAt)}>
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fixed Pagination Section */}
      <div className="pagination-section">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="text-muted me-3">
              Hiển thị {pagination.page * pagination.size + 1} - {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} trong tổng số {pagination.totalElements} lead
            </span>
            <div className="d-flex align-items-center">
              <span className="text-muted me-2">Hiển thị:</span>
              <select 
                className="form-select form-select-sm" 
                style={{ width: 'auto' }}
                value={pagination.size}
                onChange={(e) => handlePageSizeChange(e.target.value)}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-muted ms-2">mỗi trang</span>
            </div>
          </div>
          
          <div className="d-flex align-items-center">
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${pagination.first ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(0)}
                    disabled={pagination.first}
                  >
                    <i className="fas fa-angle-double-left"></i>
                  </button>
                </li>
                <li className={`page-item ${!pagination.hasPrevious ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevious}
                  >
                    <i className="fas fa-angle-left"></i>
                  </button>
                </li>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNumber;
                  if (pagination.totalPages <= 5) {
                    pageNumber = i;
                  } else if (pagination.page <= 2) {
                    pageNumber = i;
                  } else if (pagination.page >= pagination.totalPages - 3) {
                    pageNumber = pagination.totalPages - 5 + i;
                  } else {
                    pageNumber = pagination.page - 2 + i;
                  }
                  
                  return (
                    <li key={pageNumber} className={`page-item ${pagination.page === pageNumber ? 'active' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber + 1}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                  >
                    <i className="fas fa-angle-right"></i>
                  </button>
                </li>
                <li className={`page-item ${pagination.last ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.totalPages - 1)}
                    disabled={pagination.last}
                  >
                    <i className="fas fa-angle-double-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết Lead</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedLead(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Tên khách hàng:</strong> {selectedLead.fullName}</p>
                    <p><strong>Số điện thoại:</strong> {selectedLead.phone}</p>
                    <p><strong>Email:</strong> {selectedLead.email || 'Chưa có'}</p>
                    <p><strong>Công ty:</strong> {selectedLead.company || 'Khách hàng cá nhân'}</p>
                    <p><strong>Tỉnh/Thành phố:</strong> {getProvinceLabel(selectedLead.province)}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Nguồn lead:</strong> {getSourceLabel(selectedLead.source)}</p>
                    <p><strong>Trạng thái:</strong> 
                      <span className={`badge ${getStatusBadgeClass(selectedLead.status)} ms-2`}>
                        {getStatusLabel(selectedLead.status)}
                      </span>
                    </p>
                    <p><strong>Người phụ trách:</strong> {getAssignedUserLabel(selectedLead.assignedUserId)}</p>
                    <p><strong>Người tạo:</strong> {selectedLead.creatorFullName || selectedLead.creatorUsername || 'Chưa xác định'}</p>
                    <p><strong>Ngày tạo:</strong> {formatDate(selectedLead.createdAt)}</p>
                    <p><strong>Cập nhật lần cuối:</strong> {formatDate(selectedLead.updatedAt)}</p>
                  </div>
                </div>
                {selectedLead.notes && (
                  <div className="row">
                    <div className="col-12">
                      <p><strong>Ghi chú:</strong></p>
                      <div className="p-3 bg-light rounded">
                        {selectedLead.notes}
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedLead.statusHistory && selectedLead.statusHistory.length > 0 && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6 className="mb-3">
                        <i className="fas fa-history me-2"></i>
                        Lịch sử thay đổi trạng thái
                      </h6>
                      <div className="timeline-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {selectedLead.statusHistory.map((history, index) => (
                          <div key={history.id || index} className="timeline-item d-flex align-items-start mb-3">
                            <div className="timeline-marker me-3 mt-1">
                              <div className={`rounded-circle ${getStatusBadgeClass(history.newStatus)} d-flex align-items-center justify-content-center`} 
                                   style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                                <i className="fas fa-circle text-white"></i>
                              </div>
                            </div>
                            <div className="timeline-content flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <strong className="text-primary">{getStatusLabel(history.newStatus)}</strong>
                                  {history.oldStatus && (
                                    <span className="text-muted ms-2">
                                      (từ {getStatusLabel(history.oldStatus)})
                                    </span>
                                  )}
                                </div>
                                <small className="text-muted">{formatDate(history.changedAt)}</small>
                              </div>
                              <div className="mt-1">
                                <small className="text-muted">
                                  Bởi: {history.changedByFullName || history.changedByUsername || 'Hệ thống'}
                                </small>
                              </div>
                              {history.reason && (
                                <div className="mt-2 p-2 bg-light rounded">
                                  <small><strong>Lý do:</strong> {history.reason}</small>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary me-2" 
                  onClick={() => handleEditLead(selectedLead)}
                >
                  <i className="fas fa-edit me-2"></i>
                  Chỉnh sửa
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger me-2"
                  onClick={() => handleDeleteLead(selectedLead)}
                >
                  <i className="fas fa-trash me-2"></i>
                  Xóa
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => setSelectedLead(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Lead Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingLead ? 'Chỉnh sửa Lead' : 'Thêm Lead mới'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLead(null);
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      company: '',
                      province: '',
                      source: '',
                      status: 'CHUA_GOI',
                      assignedUserId: null,
                      notes: ''
                    });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitLead}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Tên khách hàng *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                          placeholder="Nhập tên khách hàng..."
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Số điện thoại *</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          placeholder="Nhập số điện thoại..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Nhập email..."
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="company" className="form-label">Công ty</label>
                        <input
                          type="text"
                          className="form-control"
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Nhập tên công ty..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="province" className="form-label">Tỉnh/Thành phố</label>
                        <select
                          className="form-select"
                          id="province"
                          value={formData.province}
                          onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          {provinces.map(province => (
                            <option key={province.value} value={province.value}>
                              {province.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="source" className="form-label">Nguồn lead</label>
                        <select
                          className="form-select"
                          id="source"
                          value={formData.source}
                          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        >
                          <option value="">Chọn nguồn</option>
                          {sourceOptions.map(source => (
                            <option key={source.value} value={source.value}>
                              {source.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="assignedUserId" className="form-label">Người phụ trách</label>
                        <select
                          className="form-select"
                          id="assignedUserId"
                          value={formData.assignedUserId || ''}
                          onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value || null })}
                        >
                          <option value="">Chưa gán</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.fullName || user.username} ({user.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {editingLead && (
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="status" className="form-label">Trạng thái</label>
                          <select
                            className="form-select"
                            id="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          >
                            {leadStatuses.map(status => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">Ghi chú</label>
                    <textarea
                      className="form-control"
                      id="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Nhập ghi chú về lead..."
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingLead(null);
                        setFormData({
                          fullName: '',
                          phone: '',
                          email: '',
                          company: '',
                          province: '',
                          source: '',
                          status: 'CHUA_GOI',
                          assignedUserId: null,
                          notes: ''
                        });
                      }}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingLead ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background overlay for modal */}
      {(selectedLead || showAddModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default LeadManagement;
