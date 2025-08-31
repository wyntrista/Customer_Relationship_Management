package com.example.crm.reports.service;

import com.example.crm.reports.dto.ReportsStatsResponse;
import com.example.crm.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportsService {

    @Autowired
    private UserRepository userRepository;

    public ReportsStatsResponse getReportsStats() {
        ReportsStatsResponse response = new ReportsStatsResponse();

        // User Stats
        ReportsStatsResponse.UserStats userStats = new ReportsStatsResponse.UserStats();
        userStats.setTotalUsers(userRepository.count());
        userStats.setActiveUsers(userRepository.countByEnabledTrue());
        
        // Calculate new users this month (simplified - you might want to add createdAt field to User)
        userStats.setNewUsersThisMonth(0L);
        
        // Top users (placeholder - you'd need to track login counts)
        List<ReportsStatsResponse.TopUser> topUsers = getTopUsers();
        userStats.setTopUsers(topUsers);
        
        response.setUserStats(userStats);

        // System Stats (placeholder values - you'd implement tracking)
        ReportsStatsResponse.SystemStats systemStats = new ReportsStatsResponse.SystemStats();
        systemStats.setTotalLogins(0L);
        systemStats.setFailedLogins(0L);
        systemStats.setAvgSessionTime("N/A");
        systemStats.setPeakUsageHour("N/A");
        systemStats.setUptime(99.9);
        systemStats.setErrorRate(0.1);
        systemStats.setMemoryUsage("N/A");
        
        response.setSystemStats(systemStats);

        // Sales Stats (placeholder - you'd implement based on your sales data)
        ReportsStatsResponse.SalesStats salesStats = new ReportsStatsResponse.SalesStats();
        salesStats.setTotalRevenue(0.0);
        salesStats.setTotalDeals(0L);
        salesStats.setAvgDealSize(0.0);
        salesStats.setConversionRate(0.0);
        salesStats.setGrowthRate(0.0);
        
        response.setSalesStats(salesStats);

        return response;
    }

    private List<ReportsStatsResponse.TopUser> getTopUsers() {
        List<ReportsStatsResponse.TopUser> topUsers = new ArrayList<>();
        
        // For now, return actual users but with no login data
        // In a real implementation, you'd track login history
        userRepository.findAll().stream()
            .limit(5)
            .forEach(user -> {
                ReportsStatsResponse.TopUser topUser = new ReportsStatsResponse.TopUser();
                topUser.setName(user.getUsername()); // You might want to add fullName field to User
                topUser.setUsername(user.getUsername());
                topUser.setLoginCount(0L); // Placeholder - implement login tracking
                topUser.setLastLogin("N/A"); // Placeholder - implement last login tracking
                topUsers.add(topUser);
            });

        return topUsers;
    }
}
