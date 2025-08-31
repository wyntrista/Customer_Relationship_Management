package com.example.crm.reports.dto;

import lombok.Data;
import java.util.List;

@Data
public class ReportsStatsResponse {
    private UserStats userStats;
    private SystemStats systemStats;
    private SalesStats salesStats;

    @Data
    public static class UserStats {
        private Long totalUsers;
        private Long activeUsers;
        private Long newUsersThisMonth;
        private List<TopUser> topUsers;
    }

    @Data
    public static class TopUser {
        private String name;
        private String username;
        private Long loginCount;
        private String lastLogin;
    }

    @Data
    public static class SystemStats {
        private Long totalLogins;
        private Long failedLogins;
        private String avgSessionTime;
        private String peakUsageHour;
        private Double uptime;
        private Double errorRate;
        private String memoryUsage;
    }

    @Data
    public static class SalesStats {
        private Double totalRevenue;
        private Long totalDeals;
        private Double avgDealSize;
        private Double conversionRate;
        private Double growthRate;
    }
}
