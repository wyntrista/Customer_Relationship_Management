import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AuthService from '../services/auth.service';
import './LeadDetailModal_New.css';

const LeadDetailModal = ({ 
  lead, 
  onClose, 
  onEdit,
  onDelete,
  getProvinceLabel,
  getSourceLabel, 
  getStatusLabel,
  getStatusBadgeClass,
  getAssignedUserLabel,
  formatDate,
  currentUser,
  provinces,
  sourceOptions,
  leadStatuses,
  users,
  onUpdate  // Callback để refresh data thay vì reload page
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (lead) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lead]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!lead) return;
    
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, lead]);
  
  // Initialize edit data when lead changes
  useEffect(() => {
    if (lead) {
      setEditData({
        fullName: lead.fullName || '',
        phone: lead.phone || '',
        email: lead.email || '',
        company: lead.company || '',
        province: lead.province || '',
        source: lead.source || '',
        status: lead.status || 'CHUA_GOI',
        assignedUserId: lead.assignedUserId || null,
        notes: lead.notes || '',
        statusChangeNote: ''
      });
    }
  }, [lead]);
  
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Basic validation
      if (!editData.fullName?.trim()) {
        alert('Vui lòng nhập họ và tên');
        return;
      }

      if (!editData.phone?.trim()) {
        alert('Vui lòng nhập số điện thoại');
        return;
      }
      
      // Call API to update lead - Use same method as LeadManagement
      const token = AuthService.getToken();
      if (!token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/login';
        return;
      }

      // Get a fresh token to ensure it's not stale
      const freshToken = AuthService.getToken();
      if (!freshToken) {
        alert('Không tìm thấy token. Vui lòng đăng nhập lại.');
        AuthService.logout();
        window.location.href = '/login';
        return;
      }

      console.log('Fresh token being used:', freshToken ? `Token starts with: ${freshToken.substring(0, 20)}...` : 'No token');
      
      // Verify user info
      const currentUser = AuthService.getCurrentUser();
      console.log('Current user:', currentUser);
      console.log('User roles:', currentUser?.role || 'No role found');

      // Test token với một request khác trước
      console.log('Testing token with GET request first...');
      try {
        const testResponse = await fetch(`http://localhost:8080/api/leads/${lead.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${freshToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('GET test response status:', testResponse.status);
        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          console.error('GET test failed:', errorText);
          throw new Error(`GET test failed: ${testResponse.status}`);
        }
        console.log('GET test passed, proceeding with PUT...');
      } catch (testError) {
        console.error('Token test failed:', testError);
        alert('Token không hợp lệ. Vui lòng đăng nhập lại.');
        AuthService.logout();
        window.location.href = '/login';
        return;
      }

      // Prepare request data - match LeadManagement format exactly
      const requestData = {
        fullName: editData.fullName,
        phone: editData.phone,
        email: editData.email || null,
        company: editData.company || null,
        province: editData.province || null,
        source: editData.source || null,
        status: editData.status,
        assignedUserId: editData.assignedUserId || null,
        notes: editData.notes || null
      };

      // Only add statusChangeNote if status changed
      if (editData.status !== lead.status && editData.statusChangeNote) {
        requestData.statusChangeNote = editData.statusChangeNote;
      }

      console.log('Sending update request:', requestData);
      console.log('Request data validation:');
      console.log('- fullName:', typeof requestData.fullName, requestData.fullName);
      console.log('- phone:', typeof requestData.phone, requestData.phone);
      console.log('- email:', typeof requestData.email, requestData.email);
      console.log('- company:', typeof requestData.company, requestData.company);
      console.log('- province:', typeof requestData.province, requestData.province);
      console.log('- source:', typeof requestData.source, requestData.source);
      console.log('- status:', typeof requestData.status, requestData.status);
      console.log('- assignedUserId:', typeof requestData.assignedUserId, requestData.assignedUserId);
      console.log('- notes:', typeof requestData.notes, requestData.notes);
      console.log('- statusChangeNote:', typeof requestData.statusChangeNote, requestData.statusChangeNote);
      console.log('Original lead status:', lead.status);
      console.log('New status:', editData.status);

      console.log('Sending update request:', requestData);
      console.log('Original lead status:', lead.status);
      console.log('New status:', editData.status);

      // Add a small delay to ensure no timing conflicts
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Starting PUT request...');
      console.log('URL:', `http://localhost:8080/api/leads/${lead.id}`);
      console.log('Using fresh token:', freshToken ? `Bearer ${freshToken.substring(0, 20)}...` : 'No token');

      const response = await fetch(`http://localhost:8080/api/leads/${lead.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${freshToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        
        if (response.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          AuthService.logout();
          window.location.href = '/login';
          return;
        }

        if (response.status === 403) {
          alert('Bạn không có quyền cập nhật lead này.');
          return;
        }
        
        // Try to parse error message
        let errorMessage = `Lỗi ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || `${errorMessage}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const updatedLead = await response.json();
      console.log('Updated lead:', updatedLead);
      alert('Cập nhật lead thành công!');
      
      // Close modal and refresh data
      onClose();
      if (onUpdate) {
        onUpdate(); // Call parent refresh function
      } else {
        window.location.reload(); // Fallback
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      
      // If it's a 401/403 error, provide fallback option
      if (error.message.includes('401') || error.message.includes('403')) {
        const useMainModal = window.confirm(
          `Có lỗi xảy ra khi cập nhật lead: ${error.message}\n\n` +
          `Bạn có muốn sử dụng form chỉnh sửa chính không?`
        );
        if (useMainModal && onEdit) {
          onEdit(lead);
          onClose();
          return;
        }
      }
      
      alert(`Có lỗi xảy ra khi cập nhật lead: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  
  if (!lead) return null;

  const modalContent = (
    <div 
      className="modal show d-block lead-detail-modal" 
      tabIndex="-1"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center">
              <i className="fas fa-user-circle me-2"></i>
              Thông tin chi tiết Lead: {lead.fullName}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Tab Navigation */}
          <div className="modal-body p-0">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                  type="button"
                >
                  <i className="fas fa-info-circle me-1"></i>
                  Thông tin chi tiết
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edit')}
                  type="button"
                >
                  <i className="fas fa-edit me-1"></i>
                  Chỉnh sửa
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                  type="button"
                >
                  <i className="fas fa-history me-1"></i>
                  Lịch sử cập nhật ({lead.statusHistory?.length || 0})
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content p-4">
              {activeTab === 'details' && (
                <div className="tab-pane active">
                  <div className="row">
                    {/* Basic Information */}
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <h6 className="card-title mb-0">
                            <i className="fas fa-user me-2"></i>Thông tin cơ bản
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label fw-bold">Họ và tên:</label>
                              <div className="form-control-plaintext">{lead.fullName}</div>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-bold">Số điện thoại:</label>
                              <div className="form-control-plaintext">
                                <a href={`tel:${lead.phone}`} className="text-decoration-none">
                                  <i className="fas fa-phone text-success me-1"></i>
                                  {lead.phone}
                                </a>
                              </div>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-bold">Email:</label>
                              <div className="form-control-plaintext">
                                {lead.email ? (
                                  <a href={`mailto:${lead.email}`} className="text-decoration-none">
                                    <i className="fas fa-envelope text-primary me-1"></i>
                                    {lead.email}
                                  </a>
                                ) : (
                                  <span className="text-muted">Chưa có</span>
                                )}
                              </div>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-bold">Tỉnh/Thành phố:</label>
                              <div className="form-control-plaintext">
                                <i className="fas fa-map-marker-alt text-danger me-1"></i>
                                {getProvinceLabel ? getProvinceLabel(lead.province) : lead.province}
                              </div>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-bold">Công ty:</label>
                              <div className="form-control-plaintext">
                                {lead.company || <span className="text-muted">Chưa có</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Assignment */}
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <h6 className="card-title mb-0">
                            <i className="fas fa-cog me-2"></i>Trạng thái & Phân công
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-6">
                              <label className="form-label fw-bold">Trạng thái:</label>
                              <div className="form-control-plaintext">
                                <span className={`badge ${getStatusBadgeClass ? getStatusBadgeClass(lead.status) : 'badge-secondary'}`}>
                                  {getStatusLabel ? getStatusLabel(lead.status) : lead.status}
                                </span>
                              </div>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-bold">Nguồn:</label>
                              <div className="form-control-plaintext">
                                <span className="badge bg-info">
                                  {getSourceLabel ? getSourceLabel(lead.source) : lead.source}
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-bold">Người phụ trách:</label>
                              <div className="form-control-plaintext">
                                <i className="fas fa-user-tie text-primary me-1"></i>
                                {getAssignedUserLabel ? getAssignedUserLabel(lead.assignedUserId) : 'Chưa phân công'}
                              </div>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-bold">Ngày tạo:</label>
                              <div className="form-control-plaintext">
                                <i className="fas fa-calendar-plus text-success me-1"></i>
                                {formatDate ? formatDate(lead.createdAt) : lead.createdAt}
                              </div>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-bold">Cập nhật cuối:</label>
                              <div className="form-control-plaintext">
                                <i className="fas fa-calendar-check text-warning me-1"></i>
                                {formatDate ? formatDate(lead.updatedAt) : lead.updatedAt}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {lead.notes && (
                      <div className="col-12 mt-3">
                        <div className="card">
                          <div className="card-header bg-light">
                            <h6 className="card-title mb-0">
                              <i className="fas fa-sticky-note me-2"></i>Ghi chú
                            </h6>
                          </div>
                          <div className="card-body">
                            <div className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
                              {lead.notes}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'edit' && (
                <div className="tab-pane active">
                  <div className="row">
                    <div className="col-12">
                      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="row g-3">
                          {/* Basic Information */}
                          <div className="col-md-6">
                            <div className="card">
                              <div className="card-header bg-light">
                                <h6 className="card-title mb-0">
                                  <i className="fas fa-user me-2"></i>Thông tin cơ bản
                                </h6>
                              </div>
                              <div className="card-body">
                                <div className="row g-3">
                                  <div className="col-12">
                                    <label className="form-label">Họ và tên <span className="text-danger">*</span></label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={editData.fullName || ''}
                                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div className="col-12">
                                    <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                                    <input
                                      type="tel"
                                      className="form-control"
                                      value={editData.phone || ''}
                                      onChange={(e) => handleInputChange('phone', e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div className="col-12">
                                    <label className="form-label">Email</label>
                                    <input
                                      type="email"
                                      className="form-control"
                                      value={editData.email || ''}
                                      onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                  </div>
                                  <div className="col-12">
                                    <label className="form-label">Công ty</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={editData.company || ''}
                                      onChange={(e) => handleInputChange('company', e.target.value)}
                                    />
                                  </div>
                                  <div className="col-12">
                                    <label className="form-label">Tỉnh/Thành phố</label>
                                    <select
                                      className="form-select"
                                      value={editData.province || ''}
                                      onChange={(e) => handleInputChange('province', e.target.value)}
                                    >
                                      <option value="">Chọn tỉnh/thành phố</option>
                                      {provinces && provinces.map(province => (
                                        <option key={province.value} value={province.value}>
                                          {province.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Status and Assignment */}
                          <div className="col-md-6">
                            <div className="card">
                              <div className="card-header bg-light">
                                <h6 className="card-title mb-0">
                                  <i className="fas fa-cog me-2"></i>Trạng thái & Phân công
                                </h6>
                              </div>
                              <div className="card-body">
                                <div className="row g-3">
                                  <div className="col-12">
                                    <label className="form-label">Nguồn</label>
                                    <select
                                      className="form-select"
                                      value={editData.source || ''}
                                      onChange={(e) => handleInputChange('source', e.target.value)}
                                    >
                                      <option value="">Chọn nguồn</option>
                                      {sourceOptions && sourceOptions.map(source => (
                                        <option key={source.value} value={source.value}>
                                          {source.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-12">
                                    <label className="form-label">Trạng thái</label>
                                    <select
                                      className="form-select"
                                      value={editData.status || ''}
                                      onChange={(e) => handleInputChange('status', e.target.value)}
                                    >
                                      {leadStatuses && leadStatuses.map(status => (
                                        <option key={status.value} value={status.value}>
                                          {status.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-12">
                                    <label className="form-label">Người phụ trách</label>
                                    <select
                                      className="form-select"
                                      value={editData.assignedUserId || ''}
                                      onChange={(e) => handleInputChange('assignedUserId', e.target.value ? parseInt(e.target.value) : null)}
                                    >
                                      <option value="">Chưa phân công</option>
                                      {users && users.map(user => (
                                        <option key={user.id} value={user.id}>
                                          {user.fullName || user.username}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  {editData.status !== lead.status && (
                                    <div className="col-12">
                                      <label className="form-label">Ghi chú thay đổi trạng thái</label>
                                      <textarea
                                        className="form-control"
                                        rows="2"
                                        value={editData.statusChangeNote || ''}
                                        onChange={(e) => handleInputChange('statusChangeNote', e.target.value)}
                                        placeholder="Lý do thay đổi trạng thái..."
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          <div className="col-12">
                            <div className="card">
                              <div className="card-header bg-light">
                                <h6 className="card-title mb-0">
                                  <i className="fas fa-sticky-note me-2"></i>Ghi chú
                                </h6>
                              </div>
                              <div className="card-body">
                                <textarea
                                  className="form-control"
                                  rows="4"
                                  value={editData.notes || ''}
                                  onChange={(e) => handleInputChange('notes', e.target.value)}
                                  placeholder="Ghi chú về lead này..."
                                />
                              </div>
                            </div>
                          </div>

                          {/* Save Button */}
                          <div className="col-12 mt-4">
                            <div className="btn-section d-flex justify-content-end gap-3">
                              <button
                                type="button"
                                className="btn btn-secondary px-4"
                                onClick={() => setActiveTab('details')}
                                disabled={saving}
                              >
                                <i className="fas fa-times me-1"></i>
                                Hủy
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary px-4"
                                disabled={saving}
                              >
                                {saving ? (
                                  <>
                                    <i className="fas fa-spinner fa-spin me-1"></i>
                                    Đang lưu...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-save me-1"></i>
                                    Lưu thay đổi
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="tab-pane active">
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                          <h6 className="card-title mb-0">
                            <i className="fas fa-history me-2"></i>
                            Lịch sử cập nhật trạng thái
                          </h6>
                          <small className="text-muted">
                            {lead.statusHistory?.length || 0} cập nhật
                          </small>
                        </div>
                        <div className="card-body p-0">
                          {lead.statusHistory && lead.statusHistory.length > 0 ? (
                            <div className="timeline">
                              {lead.statusHistory.map((history, index) => (
                                <div key={history.id} className={`timeline-item ${index === 0 ? 'timeline-item-latest' : ''}`}>
                                  <div className="timeline-marker">
                                    <i className={`fas ${index === 0 ? 'fa-star' : 'fa-circle'}`}></i>
                                  </div>
                                  <div className="timeline-content">
                                    <div className="timeline-header d-flex justify-content-between align-items-start">
                                      <div>
                                        <h6 className="timeline-title mb-1">
                                          {history.previousStatus ? (
                                            <>
                                              <span className="badge bg-light text-dark me-1">
                                                {getStatusLabel ? getStatusLabel(history.previousStatus) : history.previousStatus}
                                              </span>
                                              <i className="fas fa-arrow-right mx-1"></i>
                                              <span className={`badge ${getStatusBadgeClass ? getStatusBadgeClass(history.newStatus) : 'bg-secondary'}`}>
                                                {getStatusLabel ? getStatusLabel(history.newStatus) : history.newStatus}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <i className="fas fa-plus-circle text-success me-1"></i>
                                              Tạo lead với trạng thái: 
                                              <span className={`badge ${getStatusBadgeClass ? getStatusBadgeClass(history.newStatus) : 'bg-secondary'} ms-1`}>
                                                {getStatusLabel ? getStatusLabel(history.newStatus) : history.newStatus}
                                              </span>
                                            </>
                                          )}
                                        </h6>
                                        <small className="text-muted d-flex align-items-center">
                                          <i className="fas fa-user me-1"></i>
                                          {history.updaterName || 'Hệ thống'}
                                        </small>
                                      </div>
                                      <small className="text-muted">
                                        <i className="fas fa-clock me-1"></i>
                                        {formatDate ? formatDate(history.createdAt) : history.createdAt}
                                      </small>
                                    </div>
                                    {history.notes && (
                                      <div className="timeline-body mt-2">
                                        <div className="p-2 bg-light rounded">
                                          <small>
                                            <i className="fas fa-comment me-1"></i>
                                            <span style={{ whiteSpace: 'pre-wrap' }}>{history.notes}</span>
                                          </small>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-5">
                              <i className="fas fa-history fa-3x text-muted mb-3"></i>
                              <h6 className="text-muted">Chưa có lịch sử cập nhật</h6>
                              <p className="text-muted small">
                                Lịch sử thay đổi trạng thái sẽ được hiển thị tại đây
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <div className="d-flex justify-content-between w-100">
              <div>
                {currentUser && (currentUser.roles?.includes('ADMIN') || currentUser.roles?.includes('MANAGER')) && onDelete && (
                  <button 
                    type="button" 
                    className="btn btn-outline-danger"
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn xóa lead này không?')) {
                        onDelete(lead.id);
                        onClose();
                      }
                    }}
                  >
                    <i className="fas fa-trash me-1"></i>
                    Xóa Lead
                  </button>
                )}
              </div>
              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  <i className="fas fa-times me-1"></i>
                  Đóng
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setActiveTab('edit')}
                >
                  <i className="fas fa-edit me-1"></i>
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render modal at document body level
  return createPortal(modalContent, document.body);
};

export default LeadDetailModal;
