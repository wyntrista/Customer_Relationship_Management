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
    
    List<Lead> findByAssignedUser(User assignedUser);
    
    List<Lead> findByCreator(User creator);
    
    List<Lead> findByStatus(LeadStatus status);
    
    List<Lead> findByProvince(VietnamProvince province);
    
    @Query("SELECT l FROM Lead l WHERE l.province IN :provinces")
    List<Lead> findByProvinceIn(@Param("provinces") List<VietnamProvince> provinces);
    
    List<Lead> findBySource(String source);
    
    List<Lead> findByCompanyContainingIgnoreCase(String company);
    
    List<Lead> findByFullNameContainingIgnoreCase(String fullName);
    
    List<Lead> findByPhoneContaining(String phone);
    
    List<Lead> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Lead> findByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT l FROM Lead l ORDER BY l.updatedAt DESC")
    List<Lead> findAllOrderByUpdatedAtDesc();
    
    @Query("SELECT l.status, COUNT(l) FROM Lead l GROUP BY l.status")
    List<Object[]> countLeadsByStatus();
    
    @Query("SELECT l.source, COUNT(l) FROM Lead l GROUP BY l.source")
    List<Object[]> countLeadsBySource();

    @Query("SELECT l.province, COUNT(l) FROM Lead l GROUP BY l.province")
    List<Object[]> countLeadsByProvince();
    
    @Query("SELECT l FROM Lead l ORDER BY l.updatedAt DESC")
    Page<Lead> findAllPaged(Pageable pageable);
    
    Page<Lead> findByAssignedUser(User assignedUser, Pageable pageable);
    
    Page<Lead> findByCreator(User creator, Pageable pageable);
    
    Page<Lead> findByStatus(LeadStatus status, Pageable pageable);
    

    Page<Lead> findByProvince(VietnamProvince province, Pageable pageable);
    
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
    
    Page<Lead> findByAssignedUserId(Long userId, Pageable pageable);
    Page<Lead> findByFullNameContainingIgnoreCaseOrPhoneContainingOrEmailContainingIgnoreCase(
        String fullName, String phone, String email, Pageable pageable);
}
