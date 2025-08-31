package com.example.crm.auth.repository;

import com.example.crm.auth.model.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByEmailAndCodeAndType(String email, String code, String type);
    List<VerificationCode> findByEmailAndType(String email, String type);
    void deleteByEmail(String email);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM VerificationCode v WHERE v.email = :email AND v.type = :type")
    void deleteByEmailAndType(@Param("email") String email, @Param("type") String type);
}
