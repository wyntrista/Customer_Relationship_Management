import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthService from '../services/auth.service';
import userService from '../services/user.service';
import LeadDetailModal from './LeadDetailModal_New';
import {
  MdFirstPage,
  MdChevronLeft,
  MdChevronRight,
  MdLastPage,
  MdPeople,
  MdClear,
  MdAdd,
  MdSearch,
  MdFilterList,
  MdInfo,
  MdArrowUpward,
  MdArrowDownward
} from 'react-icons/md';
import './LeadManagement.css';

const LeadManagement = () => {
  // State variables
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // Loading state for form submission
  const [users, setUsers] = useState([]);
  const [currentUser] = useState(() => AuthService.getCurrentUser());
  
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

  const [appliedFilters, setAppliedFilters] = useState({
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

  // Debug selectedLead changes
  useEffect(() => {
    console.log('selectedLead state changed:', selectedLead);
  }, [selectedLead]);
  
  // Debug showAddModal changes
  useEffect(() => {
    console.log('showAddModal state changed:', showAddModal);
  }, [showAddModal]);

  // Constants - Updated to match backend VietnamProvince enum
  const provinces = [
    // Miền Bắc
    { value: 'HA_NOI', label: 'Hà Nội' },
    { value: 'HAI_PHONG', label: 'Hải Phòng' },
    { value: 'QUANG_NINH', label: 'Quảng Ninh' },
    { value: 'LANG_SON', label: 'Lạng Sơn' },
    { value: 'CAO_BANG', label: 'Cao Bằng' },
    { value: 'BAC_KAN', label: 'Bắc Kạn' },
    { value: 'THAI_NGUYEN', label: 'Thái Nguyên' },
    { value: 'PHU_THO', label: 'Phú Thọ' },
    { value: 'VINH_PHUC', label: 'Vĩnh Phúc' },
    { value: 'BAC_GIANG', label: 'Bắc Giang' },
    { value: 'BAC_NINH', label: 'Bắc Ninh' },
    { value: 'HUNG_YEN', label: 'Hưng Yên' },
    { value: 'HAI_DUONG', label: 'Hải Dương' },
    { value: 'HOA_BINH', label: 'Hòa Bình' },
    { value: 'HA_NAM', label: 'Hà Nam' },
    { value: 'NAM_DINH', label: 'Nam Định' },
    { value: 'THAI_BINH', label: 'Thái Bình' },
    { value: 'NINH_BINH', label: 'Ninh Bình' },
    { value: 'HA_GIANG', label: 'Hà Giang' },
    { value: 'TUYEN_QUANG', label: 'Tuyên Quang' },
    { value: 'LAI_CHAU', label: 'Lai Châu' },
    { value: 'DIEN_BIEN', label: 'Điện Biên' },
    { value: 'SON_LA', label: 'Sơn La' },
    { value: 'YEN_BAI', label: 'Yên Bái' },
    { value: 'LAO_CAI', label: 'Lào Cai' },

    // Miền Trung
    { value: 'THANH_HOA', label: 'Thanh Hóa' },
    { value: 'NGHE_AN', label: 'Nghệ An' },
    { value: 'HA_TINH', label: 'Hà Tĩnh' },
    { value: 'QUANG_BINH', label: 'Quảng Bình' },
    { value: 'QUANG_TRI', label: 'Quảng Trị' },
    { value: 'THUA_THIEN_HUE', label: 'Thừa Thiên Huế' },
    { value: 'DA_NANG', label: 'Đà Nẵng' },
    { value: 'QUANG_NAM', label: 'Quảng Nam' },
    { value: 'QUANG_NGAI', label: 'Quảng Ngãi' },
    { value: 'BINH_DINH', label: 'Bình Định' },
    { value: 'PHU_YEN', label: 'Phú Yên' },
    { value: 'KHANH_HOA', label: 'Khánh Hòa' },
    { value: 'NINH_THUAN', label: 'Ninh Thuận' },
    { value: 'BINH_THUAN', label: 'Bình Thuận' },
    { value: 'KON_TUM', label: 'Kon Tum' },
    { value: 'GIA_LAI', label: 'Gia Lai' },
    { value: 'DAK_LAK', label: 'Đắk Lắk' },
    { value: 'DAK_NONG', label: 'Đắk Nông' },
    { value: 'LAM_DONG', label: 'Lâm Đồng' },

    // Miền Nam
    { value: 'HO_CHI_MINH', label: 'Hồ Chí Minh' },
    { value: 'BA_RIA_VUNG_TAU', label: 'Bà Rịa - Vũng Tàu' },
    { value: 'BINH_DUONG', label: 'Bình Dương' },
    { value: 'BINH_PHUOC', label: 'Bình Phước' },
    { value: 'DONG_NAI', label: 'Đồng Nai' },
    { value: 'TAY_NINH', label: 'Tây Ninh' },
    { value: 'LONG_AN', label: 'Long An' },
    { value: 'AN_GIANG', label: 'An Giang' },
    { value: 'DONG_THAP', label: 'Đồng Tháp' },
    { value: 'TIEN_GIANG', label: 'Tiền Giang' },
    { value: 'VINH_LONG', label: 'Vĩnh Long' },
    { value: 'BEN_TRE', label: 'Bến Tre' },
    { value: 'CAN_THO', label: 'Cần Thơ' },
    { value: 'KIEN_GIANG', label: 'Kiên Giang' },
    { value: 'CA_MAU', label: 'Cà Mau' },
    { value: 'BAC_LIEU', label: 'Bạc Liêu' },
    { value: 'SOC_TRANG', label: 'Sóc Trăng' },
    { value: 'HAU_GIANG', label: 'Hậu Giang' }
  ];

  const sourceOptions = [
    { value: 'WEBSITE', label: 'Website' },
    { value: 'FACEBOOK', label: 'Facebook' },
    { value: 'GOOGLE', label: 'Google' },
    { value: 'REFERRAL', label: 'Giới thiệu' },
    { value: 'PHONE', label: 'Điện thoại' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'EVENT', label: 'Sự kiện' },
    { value: 'OTHER', label: 'Khác' }
  ];

  const leadStatuses = [
    { value: 'CHUA_GOI', label: 'Chưa gọi' },
    { value: 'CHUA_LIEN_HE_DUOC', label: 'Chưa liên hệ được' },
    { value: 'WARM_LEAD', label: 'Warm lead' },
    { value: 'COLD_LEAD', label: 'Cold lead' },
    { value: 'TU_CHOI', label: 'Từ chối' },
    { value: 'HUY', label: 'Hủy' },
    { value: 'KY_HOP_DONG', label: 'Ký hợp đồng' }
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
      case 'CHUA_LIEN_HE_DUOC': return 'bg-info';
      case 'WARM_LEAD': return 'bg-warning text-dark';
      case 'COLD_LEAD': return 'bg-primary';
      case 'TU_CHOI': return 'bg-danger';
      case 'HUY': return 'bg-dark';
      case 'KY_HOP_DONG': return 'bg-success';
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

  // Debug useEffect to monitor selectedLead changes
  useEffect(() => {
    if (selectedLead) {
      console.log('Lead selected for modal:', selectedLead.id);
    }
  }, [selectedLead]);

  // API functions
  const fetchLeads = useCallback(async () => {
    console.log('fetchLeads called with pagination:', pagination, 'appliedFilters:', appliedFilters);
    try {
      setLoading(true);
      const token = AuthService.getToken();
      console.log('Token for API call:', token);
      console.log('Pagination state:', pagination);
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      // Build query parameters with validation
      const page = (typeof pagination.page === 'number' && !isNaN(pagination.page) && pagination.page >= 0) ? pagination.page : 0;
      const size = (typeof pagination.size === 'number' && !isNaN(pagination.size) && pagination.size > 0) ? pagination.size : 20;
      const sortBy = pagination.sortBy || 'updatedAt';
      const sortDirection = pagination.sortDirection || 'desc';

      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy: sortBy,
        sortDirection: sortDirection
      });
      
      console.log('Making API request to:', `http://localhost:8080/api/leads/page?${queryParams}`);
      console.log('Headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      // Add applied filters to query parameters
      console.log('AppliedFilters before adding to query:', appliedFilters);
      if (appliedFilters.search) queryParams.append('search', appliedFilters.search);
      if (appliedFilters.fullName) queryParams.append('fullName', appliedFilters.fullName);
      if (appliedFilters.phone) queryParams.append('phone', appliedFilters.phone);
      if (appliedFilters.email) queryParams.append('email', appliedFilters.email);
      if (appliedFilters.company) queryParams.append('company', appliedFilters.company);
      if (appliedFilters.province) {
        console.log('Adding province to query:', appliedFilters.province);
        queryParams.append('province', appliedFilters.province);
      }
      if (appliedFilters.source) queryParams.append('source', appliedFilters.source);
      if (appliedFilters.status) queryParams.append('status', appliedFilters.status);
      if (appliedFilters.assignedUserId) queryParams.append('assignedUserId', appliedFilters.assignedUserId);
      if (appliedFilters.myAssignedLeads) queryParams.append('myAssignedLeads', 'true');
      if (appliedFilters.myCreatedLeads) queryParams.append('myCreatedLeads', 'true');
      if (appliedFilters.createdDateFrom) queryParams.append('createdDateFrom', appliedFilters.createdDateFrom.toISOString().split('T')[0]);
      if (appliedFilters.createdDateTo) queryParams.append('createdDateTo', appliedFilters.createdDateTo.toISOString().split('T')[0]);

      console.log('Final query URL:', `http://localhost:8080/api/leads/page?${queryParams}`);

      const response = await fetch(`http://localhost:8080/api/leads/page?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.error('Raw response text:', await response.text());
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('Raw API Response:', data);
      console.log('Response content:', data.content);
      console.log('Response content type:', typeof data.content);
      console.log('Response content length:', data.content ? data.content.length : 'undefined');

      // Validate that API returned the correct page
      if (data.number !== page) {
        console.warn(`API returned wrong page. Requested: ${page}, Got: ${data.number}`);
      }

      setLeads(data.content || []);
      setFilteredLeads(data.content || []);
      console.log('Updated leads with', (data.content || []).length, 'items');
      console.log('First few leads:', (data.content || []).slice(0, 3));
      console.log('Setting leads state with:', data.content || []);
      console.log('Setting filteredLeads state with:', data.content || []);
      setPagination(prev => ({
        ...prev,
        // Don't update page from response to preserve user selection
        // Only update metadata
        size: (typeof data.size === 'number' && !isNaN(data.size)) ? data.size : prev.size,
        totalPages: (typeof data.totalPages === 'number' && !isNaN(data.totalPages)) ? data.totalPages : 0,
        totalElements: (typeof data.totalElements === 'number' && !isNaN(data.totalElements)) ? data.totalElements : 0,
        first: Boolean(data.first),
        last: Boolean(data.last),
        hasNext: Boolean(data.hasNext),
        hasPrevious: Boolean(data.hasPrevious)
      }));
    } catch (error) {
      console.error('Error fetching leads:', error);
      // Reset to safe state on error
      setLeads([]);
      setFilteredLeads([]);
      setPagination(prev => ({
        ...prev,
        page: 0,
        size: 20,
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: true,
        hasNext: false,
        hasPrevious: false
      }));
      alert('Lỗi khi tải danh sách leads: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, pagination.sortBy, pagination.sortDirection, appliedFilters]);

  // Debug useEffect to track pagination changes
  useEffect(() => {
    console.log('Pagination state changed:', pagination);
  }, [pagination]);

  const fetchLeadDetails = async (leadId) => {
    console.log('fetchLeadDetails called with leadId:', leadId);
    try {
      const token = AuthService.getToken();
      console.log('Token:', token ? 'present' : 'missing');
      
      // Fetch lead details
      const leadResponse = await fetch(`http://localhost:8080/api/leads/${leadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Lead response status:', leadResponse.status);
      if (!leadResponse.ok) throw new Error('Failed to fetch lead details');

      const leadData = await leadResponse.json();
      console.log('Lead data fetched:', leadData);
      
      // Fetch lead status history
      const historyResponse = await fetch(`http://localhost:8080/api/leads/${leadId}/status-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      let historyData = [];
      if (historyResponse.ok) {
        historyData = await historyResponse.json();
        console.log('History data fetched:', historyData);
      } else {
        console.warn('Could not fetch lead history');
      }

      // Combine lead data with history
      const leadWithHistory = {
        ...leadData,
        statusHistory: historyData
      };

      console.log('Combined lead with history:', leadWithHistory);
      setSelectedLead(leadWithHistory);
    } catch (error) {
      console.error('Error fetching lead details:', error);
      // For debugging, let's set basic lead data
      const basicLead = leads.find(lead => lead.id === leadId);
      if (basicLead) {
        console.log('Using basic lead data:', basicLead);
        setSelectedLead({...basicLead, statusHistory: []});
      }
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
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Auto-apply filters when changed for better UX
      setAppliedFilters(newFilters);
      setPagination(prevPagination => ({ ...prevPagination, page: 0 }));
      return newFilters;
    });
  };

  const handlePageChange = (newPage) => {
    console.log('handlePageChange called with newPage:', newPage);
    console.log('Current pagination.page:', pagination.page);
    setPagination(prev => {
      console.log('Setting pagination.page from', prev.page, 'to', newPage);
      return { ...prev, page: newPage };
    });
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
    // Apply current filters and reset to first page
    setAppliedFilters({...filters});
    setPagination(prev => ({ ...prev, page: 0 }));
    // fetchLeads will be called automatically via useEffect
  };

  const clearFilters = () => {
    const emptyFilters = {
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
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPagination(prev => ({ ...prev, page: 0 }));
    // fetchLeads will be called automatically via useEffect
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (appliedFilters.search) count++;
    if (appliedFilters.fullName) count++;
    if (appliedFilters.phone) count++;
    if (appliedFilters.email) count++;
    if (appliedFilters.company) count++;
    if (appliedFilters.province) count++;
    if (appliedFilters.source) count++;
    if (appliedFilters.status) count++;
    if (appliedFilters.assignedUserId) count++;
    if (appliedFilters.myAssignedLeads) count++;
    if (appliedFilters.myCreatedLeads) count++;
    if (appliedFilters.createdDateFrom) count++;
    if (appliedFilters.createdDateTo) count++;
    return count;
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName.trim()) {
      alert('Vui lòng nhập họ tên');
      return;
    }
    
    if (!formData.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    // Email validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Vui lòng nhập email hợp lệ');
      return;
    }

    setSaving(true); // Start loading state

    try {
      const token = AuthService.getToken();
      if (!token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        AuthService.logout();
        window.location.href = '/login';
        return;
      }

      const url = editingLead ? `http://localhost:8080/api/leads/${editingLead.id}` : 'http://localhost:8080/api/leads';
      const method = editingLead ? 'PUT' : 'POST';

      // Prepare request data with proper enum values
      const requestData = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || null,
        company: formData.company?.trim() || null,
        province: formData.province || null,
        source: formData.source || null,
        notes: formData.notes?.trim() || null,
        assignedUserId: formData.assignedUserId || null
      };

      // For update requests, include status
      if (editingLead) {
        requestData.status = formData.status;
      }

      console.log('Submitting lead data:', requestData);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        
        let errorMessage = 'Failed to save lead';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        if (response.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          AuthService.logout();
          window.location.href = '/login';
          return;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Lead saved successfully:', result);

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
      
      // Refresh the leads list
      fetchLeads();
      
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Lỗi khi lưu lead: ' + error.message);
    } finally {
      setSaving(false); // End loading state
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

  const handleAddNewLead = () => {
    console.log('handleAddNewLead called - Opening add lead modal');
    console.log('Current selectedLead:', selectedLead);
    console.log('Current showAddModal before:', showAddModal);
    
    // Close any existing modals first
    setSelectedLead(null);
    
    setEditingLead(null); // Clear editing lead
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
    setShowAddModal(true);
    console.log('showAddModal set to true');
  };

  const handleDeleteLead = async (lead) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa lead "${lead.fullName}"?`)) {
      return;
    }

    try {
      const token = AuthService.getToken();
      const response = await fetch(`http://localhost:8080/api/leads/${lead.id}`, {
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
  // Note: fetchLeads is already called in the useEffect with proper dependencies above
  // No need for additional useEffect as it would cause duplicate API calls

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Initial data fetch on component mount
  useEffect(() => {
    console.log('Component mounted, calling fetchLeads');
    fetchLeads();
  }, []); // Empty dependency array means this runs only on mount

  // Fetch data when pagination or appliedFilters change
  useEffect(() => {
    console.log('Pagination or appliedFilters changed, calling fetchLeads');
    console.log('Current pagination:', pagination);
    console.log('Current appliedFilters:', appliedFilters);
    fetchLeads();
  }, [pagination.page, pagination.size, pagination.sortBy, pagination.sortDirection, appliedFilters, fetchLeads]);

  // Debug render
  console.log('LeadManagement render - leads:', leads, 'filteredLeads:', filteredLeads, 'loading:', loading);

  return (
    <div className="lead-management-container">
      {/* Header */}
      <div className="header-section">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">
              <MdPeople className="me-2 text-primary" />
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
              <MdClear className="me-1" />
              Xóa lọc
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleAddNewLead}
              type="button"
            >
              <MdAdd className="me-2" />
              Thêm Lead
            </button>
          </div>
        </div>
      </div>

      {/* Lead Content Area */}
      <div className="lead-content">
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
                <MdSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
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
                  <MdFilterList className="me-1" />
                  Lọc
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={clearFilters}
                  style={{ minWidth: '50px' }}
                >
                  <MdClear className="me-1" />
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
                  popperClassName="datepicker-high-z-index"
                  calendarClassName="custom-datepicker"
                  onCalendarOpen={() => {
                    // Force high z-index when calendar opens
                    setTimeout(() => {
                      const popper = document.querySelector('.react-datepicker-popper');
                      if (popper) {
                        popper.style.zIndex = '2147483647';
                        popper.style.position = 'fixed';
                      }
                      const datepicker = document.querySelector('.react-datepicker');
                      if (datepicker) {
                        datepicker.style.zIndex = '2147483647';
                        datepicker.style.position = 'fixed';
                      }
                    }, 0);
                  }}
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
                  popperClassName="datepicker-high-z-index"
                  calendarClassName="custom-datepicker"
                  onCalendarOpen={() => {
                    // Force high z-index when calendar opens
                    setTimeout(() => {
                      const popper = document.querySelector('.react-datepicker-popper');
                      if (popper) {
                        popper.style.zIndex = '2147483647';
                        popper.style.position = 'fixed';
                      }
                      const datepicker = document.querySelector('.react-datepicker');
                      if (datepicker) {
                        datepicker.style.zIndex = '2147483647';
                        datepicker.style.position = 'fixed';
                      }
                    }, 0);
                  }}
                />
              </div>
              <div className="col-md-6 d-flex align-items-end">
                <div className="text-muted small">
                  <MdInfo className="me-1" />
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
                      pagination.sortDirection === 'asc' ? <MdArrowUpward className="ms-1" /> : <MdArrowDownward className="ms-1" />
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
                      pagination.sortDirection === 'asc' ? <MdArrowUpward className="ms-1" /> : <MdArrowDownward className="ms-1" />
                    )}
                  </th>
                  <th 
                    style={{ width: '150px', minWidth: '150px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('company')}
                    title="Nhấn để sắp xếp"
                  >
                    Công ty
                    {pagination.sortBy === 'company' && (
                      pagination.sortDirection === 'asc' ? <MdArrowUpward className="ms-1" /> : <MdArrowDownward className="ms-1" />
                    )}
                  </th>
                  <th 
                    style={{ width: '120px', minWidth: '120px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('province')}
                    title="Nhấn để sắp xếp"
                  >
                    Tỉnh/TP
                    {pagination.sortBy === 'province' && (
                      pagination.sortDirection === 'asc' ? <MdArrowUpward className="ms-1" /> : <MdArrowDownward className="ms-1" />
                    )}
                  </th>
                  <th 
                    style={{ width: '100px', minWidth: '100px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('source')}
                    title="Nhấn để sắp xếp"
                  >
                    Nguồn
                    {pagination.sortBy === 'source' && (
                      pagination.sortDirection === 'asc' ? <MdArrowUpward className="ms-1" /> : <MdArrowDownward className="ms-1" />
                    )}
                  </th>
                  <th 
                    style={{ width: '120px', minWidth: '120px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('status')}
                    title="Nhấn để sắp xếp"
                  >
                    Trạng thái
                    {pagination.sortBy === 'status' && (
                      pagination.sortDirection === 'asc' ? <MdArrowUpward className="ms-1" /> : <MdArrowDownward className="ms-1" />
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
                      pagination.sortDirection === 'asc' ? <MdArrowUpward className="ms-1" /> : <MdArrowDownward className="ms-1" />
                    )}
                  </th>
                  <th 
                    style={{ width: '120px', minWidth: '120px', cursor: 'pointer' }}
                    onClick={() => handleSortChange('createdAt')}
                    title="Nhấn để sắp xếp"
                  >
                    Ngày tạo
                    {pagination.sortBy === 'createdAt' && (
                      pagination.sortDirection === 'asc' ? <MdArrowUpward className="ms-1" /> : <MdArrowDownward className="ms-1" />
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
                      <MdSearch className="mb-3 text-muted" style={{ fontSize: '2rem' }} />
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
                      onClick={(e) => {
                        console.log('Row clicked for lead:', lead.id, lead.fullName);
                        e.preventDefault();
                        e.stopPropagation();
                        fetchLeadDetails(lead.id);
                      }}
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
                    <MdFirstPage />
                  </button>
                </li>
                <li className={`page-item ${!pagination.hasPrevious ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevious}
                  >
                    <MdChevronLeft />
                  </button>
                </li>
                
                {/* Page numbers - Simple display */}
                {pagination.totalPages > 0 && !isNaN(pagination.totalPages) && !isNaN(pagination.page) && Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNumber;
                  if (pagination.totalPages <= 5) {
                    // Show all pages if total <= 5
                    pageNumber = i;
                  } else if (pagination.page <= 2) {
                    // Show first 5 pages
                    pageNumber = i;
                  } else if (pagination.page >= pagination.totalPages - 3) {
                    // Show last 5 pages
                    pageNumber = pagination.totalPages - 5 + i;
                  } else {
                    // Show current page in middle
                    pageNumber = pagination.page - 2 + i;
                  }

                  // Ensure pageNumber is valid
                  if (isNaN(pageNumber) || pageNumber < 0 || pageNumber >= pagination.totalPages) {
                    return null;
                  }

                  return (
                    <li key={`page-${pageNumber}`} className={`page-item ${pagination.page === pageNumber ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber + 1}
                      </button>
                    </li>
                  );
                }).filter(Boolean)}
                
                <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                  >
                    <MdChevronRight />
                  </button>
                </li>
                <li className={`page-item ${pagination.last ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.totalPages - 1)}
                    disabled={pagination.last}
                  >
                    <MdLastPage />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal - Using LeadDetailModal Component */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
        getProvinceLabel={(provinceValue) => {
          const province = provinces.find(p => p.value === provinceValue);
          return province ? province.label : provinceValue;
        }}
        getSourceLabel={(sourceValue) => {
          const source = sourceOptions.find(s => s.value === sourceValue);
          return source ? source.label : sourceValue;
        }}
        getStatusLabel={(statusValue) => {
          const status = leadStatuses.find(s => s.value === statusValue);
          return status ? status.label : statusValue;
        }}
        getStatusBadgeClass={(status) => {
          const statusClasses = {
            'CHUA_GOI': 'bg-secondary',
            'CHUA_LIEN_HE_DUOC': 'bg-warning',
            'WARM_LEAD': 'bg-info',
            'COLD_LEAD': 'bg-primary',
            'TU_CHOI': 'bg-danger',
            'KY_HOP_DONG': 'bg-success'
          };
          return statusClasses[status] || 'bg-secondary';
        }}
        getAssignedUserLabel={(userId) => {
          if (!userId) return 'Chưa phân công';
          const user = users.find(u => u.id === userId);
          return user ? (user.fullName || user.username) : 'Không xác định';
        }}
        formatDate={(dateString) => {
          if (!dateString) return '';
          return new Date(dateString).toLocaleDateString('vi-VN');
        }}
        currentUser={currentUser}
        provinces={provinces}
        sourceOptions={sourceOptions}
        leadStatuses={leadStatuses}
        users={users}
        onUpdate={() => {
          fetchLeads(); // Refresh leads data
          setSelectedLead(null); // Close modal
        }}
      />

      {/* Old Modal - Keeping for now
      {/* Lead Detail Modal */}
      {false && selectedLead && (
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
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          style={{ 
            zIndex: 1055, 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)' 
          }}
        >
          {console.log('Rendering add modal now, showAddModal:', showAddModal)}
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
                    console.log('Closing add modal');
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
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Đang lưu...
                        </>
                      ) : (
                        editingLead ? 'Cập nhật' : 'Thêm mới'
                      )}
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
        <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
      )}
    </div>
  );
};

export default LeadManagement;
