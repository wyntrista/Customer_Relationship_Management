package com.example.crm.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.crm.user.model.ERole;
import com.example.crm.user.model.Role;
import com.example.crm.user.model.User;
import com.example.crm.user.repository.RoleRepository;
import com.example.crm.user.repository.UserRepository;

import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.Set;

import javax.sql.DataSource;

@Component
@AllArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private final JdbcTemplate jdbcTemplate;
    
    @Autowired
    private final DataSource dataSource;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final RoleRepository roleRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Checking Database Initialization ===");
        
        if (isDatabaseEmpty()) {
            System.out.println("Database is empty. Running SQL scripts...");
            executeSqlScript("schema.sql");
            executeSqlScript("data.sql");
            
            verifyDataInsertion();
            System.out.println("=== Database Initialization Completed ===");
        } else {
            System.out.println("Database already has data. Checking for leads...");
            
            // Check if leads exist, if not, insert sample leads
            try {
                Integer leadCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM leads", Integer.class);
                System.out.println("Existing leads count: " + leadCount);
                
                if (leadCount == null || leadCount == 0) {
                    System.out.println("No leads found. Inserting sample leads...");
                    insertSampleLeads();
                }
            } catch (Exception e) {
                System.out.println("Leads table doesn't exist or error checking leads: " + e.getMessage());
            }
        }

        initializeUsers();
    }
    
    private boolean isDatabaseEmpty() {
        try {
            Integer roleCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM roles", Integer.class);
            Integer userCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
            Integer leadCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM leads", Integer.class);
            
            System.out.println("Existing roles count: " + roleCount);
            System.out.println("Existing users count: " + userCount);
            System.out.println("Existing leads count: " + leadCount);
            
            return (roleCount == null || roleCount == 0) && 
                   (userCount == null || userCount == 0) && 
                   (leadCount == null || leadCount == 0);
            
        } catch (Exception e) {
            System.out.println("Tables don't exist. Database is empty.");
            return true;
        }
    }
    
    private void executeSqlScript(String scriptPath) {
        try {
            System.out.println("Executing " + scriptPath + "...");
            
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(new ClassPathResource(scriptPath));
            populator.setContinueOnError(true);
            populator.setIgnoreFailedDrops(true);
            populator.execute(dataSource);
            
            System.out.println("Successfully executed " + scriptPath);
        } catch (Exception e) {
            System.err.println("Error executing " + scriptPath + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void verifyDataInsertion() {
        try {
            Integer roleCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM roles", Integer.class);
            Integer userCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
            Integer leadCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM leads", Integer.class);
            
            System.out.println("Verification Results:");
            System.out.println("- Roles inserted: " + (roleCount != null ? roleCount : 0));
            System.out.println("- Users inserted: " + (userCount != null ? userCount : 0));
            System.out.println("- Leads inserted: " + (leadCount != null ? leadCount : 0));
            
            if ((roleCount == null || roleCount == 0) || 
                (userCount == null || userCount == 0)) {
                System.err.println("Data insertion seems to have failed!");
            } else {
                System.out.println("Data insertion successful!");
            }
        } catch (Exception e) {
            System.err.println("Error verifying data insertion: " + e.getMessage());
        }
    }

    private void initializeUsers() {
        if (!userRepository.existsByUsername("admin01")) {
            User admin = new User();
            admin.setUsername("admin01");
            admin.setEmail("admin01@crm.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(ERole.ROLE_ADMIN);
            
            Set<Role> adminRoles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));
            adminRoles.add(adminRole);
            admin.setRoles(adminRoles);
            
            userRepository.save(admin);
            System.out.println("Created admin user: admin01/admin123");
        }

        if (!userRepository.existsByUsername("marketing01")) {
            User marketingUser = new User();
            marketingUser.setUsername("marketing01");
            marketingUser.setEmail("marketing01@crm.com");
            marketingUser.setPassword(passwordEncoder.encode("marketing123"));
            marketingUser.setRole(ERole.ROLE_MARKETING);

            Set<Role> marketingRoles = new HashSet<>();
            Role marketingRole = roleRepository.findByName(ERole.ROLE_MARKETING)
                .orElseThrow(() -> new RuntimeException("Marketing role not found"));
            marketingRoles.add(marketingRole);
            marketingUser.setRoles(marketingRoles);

            userRepository.save(marketingUser);
            System.out.println("Created marketing user: marketing01/marketing123");
        }

        if (!userRepository.existsByUsername("telesales01")) {
            User telesalesUser = new User();
            telesalesUser.setUsername("telesales01");
            telesalesUser.setEmail("telesales01@crm.com");
            telesalesUser.setPassword(passwordEncoder.encode("telesales123"));
            telesalesUser.setRole(ERole.ROLE_TELESALES);

            Set<Role> telesalesRoles = new HashSet<>();
            Role telesalesRole = roleRepository.findByName(ERole.ROLE_TELESALES)
                .orElseThrow(() -> new RuntimeException("Telesales role not found"));
            telesalesRoles.add(telesalesRole);
            telesalesUser.setRoles(telesalesRoles);

            userRepository.save(telesalesUser);
            System.out.println("Created telesales user: telesales01/telesales123");
        }

        if (!userRepository.existsByUsername("user01")) {
            User user = new User();
            user.setUsername("user01");
            user.setEmail("user01@crm.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(ERole.ROLE_USER);
            
            Set<Role> userRoles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("User role not found"));
            userRoles.add(userRole);
            user.setRoles(userRoles);
            
            userRepository.save(user);
            System.out.println("Created regular user: user/user123");
        }
    }
    
    private void insertSampleLeads() {
        try {
            // Insert sample leads
            jdbcTemplate.update("INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                "Nguyễn Văn A", "HO_CHI_MINH", "0912345678", "nguyenvana@example.com", "Công ty ABC", "PHONE", "CHUA_GOI", "Lead mới", 1, null, "2025-01-01 00:00:00", "2025-01-01 00:00:00");
            
            jdbcTemplate.update("INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                "Trần Thị B", "HA_NOI", "0987654321", "tranthib@example.com", "Công ty XYZ", "EMAIL", "CHUA_LIEN_HE_DUOC", "Lead tiềm năng", 2, 3, "2025-01-02 00:00:00", "2025-01-02 00:00:00");
            
            jdbcTemplate.update("INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                "Lê Văn C", "DA_NANG", "0901234567", "levanc@example.com", "Công ty DEF", "WEBSITE", "WARM_LEAD", "Đã liên hệ", 3, 4, "2025-01-03 00:00:00", "2025-01-03 00:00:00");
            
            System.out.println("Inserted sample leads successfully");
        } catch (Exception e) {
            System.out.println("Error inserting sample leads: " + e.getMessage());
        }
    }
}