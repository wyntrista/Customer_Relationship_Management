package com.example.crm.lead.repository;

import com.example.crm.lead.model.Lead;
import com.example.crm.lead.model.LeadStatus;
import com.example.crm.lead.model.VietnamProvince;
import com.example.crm.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    
    // Tìm leads theo assigned user
    List<Lead> findByAssignedUser(User assignedUser);
    
    // Tìm leads theo creator
    List<Lead> findByCreator(User creator);
    
    // Tìm leads theo status
    List<Lead> findByStatus(LeadStatus status);
    
    // Tìm leads theo khu vực (tỉnh thành)
    List<Lead> findByProvince(VietnamProvince province);
    
    // Tìm leads theo miền
    @Query("SELECT l FROM Lead l WHERE l.province IN :provinces")
    List<Lead> findByProvinceIn(@Param("provinces") List<VietnamProvince> provinces);
    
    // Tìm leads theo nguồn
    List<Lead> findBySource(String source);
    
    // Tìm leads theo lĩnh vực quan tâm
    List<Lead> findByCompanyContainingIgnoreCase(String company);
    
    // Tìm leads theo tên khách hàng
    List<Lead> findByFullNameContainingIgnoreCase(String fullName);
    
    // Tìm leads theo số điện thoại
    List<Lead> findByPhoneContaining(String phone);
    
    // Tìm leads được tạo trong khoảng thời gian
    List<Lead> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Tìm leads được cập nhật trong khoảng thời gian
    List<Lead> findByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Query tùy chỉnh để lấy tất cả leads sắp xếp theo thời gian cập nhật mới nhất
    @Query("SELECT l FROM Lead l ORDER BY l.updatedAt DESC")
    List<Lead> findAllOrderByUpdatedAtDesc();
    
    // Query để đếm leads theo status
    @Query("SELECT l.status, COUNT(l) FROM Lead l GROUP BY l.status")
    List<Object[]> countLeadsByStatus();
    
    // Query để đếm leads theo nguồn
    @Query("SELECT l.source, COUNT(l) FROM Lead l GROUP BY l.source")
    List<Object[]> countLeadsBySource();

    // Query để đếm leads theo khu vực (tỉnh thành)
    @Query("SELECT l.province, COUNT(l) FROM Lead l GROUP BY l.province")
    List<Object[]> countLeadsByProvince();
    
    // ===== PAGINATION METHODS =====
    
    // Phân trang tất cả leads
    @Query("SELECT l FROM Lead l ORDER BY l.updatedAt DESC")
    Page<Lead> findAllPaged(Pageable pageable);
    
    // Phân trang theo assigned user
    Page<Lead> findByAssignedUser(User assignedUser, Pageable pageable);
    
    // Phân trang theo creator
    Page<Lead> findByCreator(User creator, Pageable pageable);
    
    // Phân trang theo status
    Page<Lead> findByStatus(LeadStatus status, Pageable pageable);
    
    // Phân trang theo tỉnh thành
    Page<Lead> findByProvince(VietnamProvince province, Pageable pageable);
    
    // Phân trang với filter tùy chỉnh
    @Query("SELECT l FROM Lead l WHERE " +
           "(:fullName IS NULL OR :fullName = '' OR LOWER(l.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) AND " +
           "(:province IS NULL OR l.province = :province) AND " +
           "(:phone IS NULL OR :phone = '' OR l.phone LIKE CONCAT('%', :phone, '%')) AND " +
           "(:email IS NULL OR :email = '' OR LOWER(l.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(:company IS NULL OR :company = '' OR LOWER(l.company) LIKE LOWER(CONCAT('%', :company, '%'))) AND " +
           "(:source IS NULL OR l.source = :source) AND " +
           "(:status IS NULL OR l.status = :status) AND " +
           "(:assignedUserId IS NULL OR l.assignedUser.id = :assignedUserId) AND " +
           "(:creatorId IS NULL OR l.creator.id = :creatorId) AND " +
           "(:createdDateFrom IS NULL OR DATE(l.createdAt) >= :createdDateFrom) AND " +
           "(:createdDateTo IS NULL OR DATE(l.createdAt) <= :createdDateTo) " +
           "ORDER BY l.updatedAt DESC")
    Page<Lead> findLeadsWithFilters(@Param("fullName") String fullName,
                                   @Param("province") VietnamProvince province,
                                   @Param("phone") String phone,
                                   @Param("email") String email,
                                   @Param("company") String company,
                                   @Param("source") String source,
                                   @Param("status") LeadStatus status,
                                   @Param("assignedUserId") Long assignedUserId,
                                   @Param("creatorId") Long creatorId,
                                   @Param("createdDateFrom") LocalDateTime createdDateFrom,
                                   @Param("createdDateTo") LocalDateTime createdDateTo,
                                   Pageable pageable);
    
    // Additional pagination methods
    Page<Lead> findByAssignedUserId(Long userId, Pageable pageable);
    Page<Lead> findByFullNameContainingIgnoreCaseOrPhoneContainingOrEmailContainingIgnoreCase(
        String fullName, String phone, String email, Pageable pageable);
}
