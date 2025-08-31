import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './LeadDetailModal.css';

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
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState('details');
  
  if (!lead) return null;

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

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
          
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="info-group">
                  <label><i className="fas fa-user me-2 text-primary"></i>Tên khách hàng:</label>
                  <div className="info-value">{lead.fullName}</div>
                </div>
                
                <div className="info-group">
                  <label><i className="fas fa-phone me-2 text-success"></i>Số điện thoại:</label>
                  <div className="info-value">{lead.phone}</div>
                </div>
                
                <div className="info-group">
                  <label><i className="fas fa-envelope me-2 text-info"></i>Email:</label>
                  <div className="info-value">{lead.email || 'Chưa có'}</div>
                </div>
                
                <div className="info-group">
                  <label><i className="fas fa-building me-2 text-secondary"></i>Công ty:</label>
                  <div className="info-value">{lead.company || 'Khách hàng cá nhân'}</div>
                </div>
                
                <div className="info-group">
                  <label><i className="fas fa-map-marker-alt me-2 text-danger"></i>Tỉnh/Thành phố:</label>
                  <div className="info-value">{getProvinceLabel(lead.province)}</div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="info-group">
                  <label><i className="fas fa-share-alt me-2 text-warning"></i>Nguồn lead:</label>
                  <div className="info-value">{getSourceLabel(lead.source)}</div>
                </div>
                
                <div className="info-group">
                  <label><i className="fas fa-flag me-2 text-primary"></i>Trạng thái:</label>
                  <div className="info-value">
                    <span className={`badge ${getStatusBadgeClass(lead.status)} fs-6`}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </div>
                </div>
                
                <div className="info-group">
                  <label><i className="fas fa-user-tag me-2 text-success"></i>Người phụ trách:</label>
                  <div className="info-value">{getAssignedUserLabel(lead.assignedUserId)}</div>
                </div>
                
                <div className="info-group">
                  <label><i className="fas fa-user-plus me-2 text-success"></i>Người tạo:</label>
                  <div className="info-value">
                    {lead.creatorFullName || lead.creatorUsername || 'Không xác định'}
                    {lead.creatorEmail && (
                      <small className="text-muted ms-2">({lead.creatorEmail})</small>
                    )}
                  </div>
                </div>
                
                <div className="info-group">
                  <label><i className="fas fa-calendar-plus me-2 text-info"></i>Ngày tạo:</label>
                  <div className="info-value">{formatDate(lead.createdAt)}</div>
                </div>
                
                <div className="info-group">
                  <label><i className="fas fa-clock me-2 text-warning"></i>Cập nhật lần cuối:</label>
                  <div className="info-value">{formatDate(lead.updatedAt)}</div>
                </div>
              </div>
            </div>
            
            {lead.notes && (
              <div className="row mt-4">
                <div className="col-12">
                  <div className="info-group">
                    <label><i className="fas fa-sticky-note me-2 text-secondary"></i>Ghi chú:</label>
                    <div className="notes-content">
                      {lead.notes}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Status History */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="info-group">
                  <label><i className="fas fa-history me-2 text-primary"></i>Lịch sử trạng thái:</label>
                  {lead.statusHistory && lead.statusHistory.length > 0 ? (
                    <div className="status-history-container">
                      {lead.statusHistory.map((history, index) => (
                        <div key={history.id} className={`status-history-item ${index === 0 ? 'latest' : ''}`}>
                          <div className="status-change">
                            {history.oldStatus && (
                              <>
                                <span className={`badge ${getStatusBadgeClass(history.oldStatus)} me-2`}>
                                  {getStatusLabel(history.oldStatus)}
                                </span>
                                <i className="fas fa-arrow-right mx-2 text-muted"></i>
                              </>
                            )}
                            <span className={`badge ${getStatusBadgeClass(history.newStatus)}`}>
                              {getStatusLabel(history.newStatus)}
                            </span>
                            {index === 0 && (
                              <span className="badge bg-success ms-2 small">Mới nhất</span>
                            )}
                          </div>
                          <div className="status-meta">
                            <i className="fas fa-user me-1"></i>
                            <strong>{history.updatedByName}</strong>
                            <span className="text-muted mx-2">•</span>
                            <i className="fas fa-clock me-1"></i>
                            <small>{formatDate(history.createdAt)}</small>
                          </div>
                          {history.notes && (
                            <div className="status-notes">
                              <i className="fas fa-comment me-1"></i>
                              {history.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-history">
                      <i className="fas fa-info-circle me-2"></i>
                      Chưa có lịch sử thay đổi trạng thái
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-danger me-auto"
              onClick={() => onDelete(lead)}
              title="Xóa lead này"
            >
              <i className="fas fa-trash me-2"></i>
              Xóa
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => onEdit(lead)}
            >
              <i className="fas fa-edit me-2"></i>
              Chỉnh sửa
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              <i className="fas fa-times me-2"></i>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render modal at document body level
  console.log('Creating portal with modalContent for lead:', lead?.id);
  console.log('Portal target:', document.body);
  return createPortal(modalContent, document.body);
};

export default LeadDetailModal;
