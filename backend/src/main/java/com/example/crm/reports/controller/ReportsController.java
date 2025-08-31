package com.example.crm.reports.controller;

import com.example.crm.reports.dto.ReportsStatsResponse;
import com.example.crm.reports.service.ReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportsController {

    @Autowired
    private ReportsService reportsService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportsStatsResponse> getReportsStats() {
        ReportsStatsResponse stats = reportsService.getReportsStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/user-activity")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserActivityReport(
            @RequestParam(defaultValue = "30") int days) {
        // TODO: Implement user activity report
        return ResponseEntity.ok("User activity report for last " + days + " days");
    }

    @GetMapping("/system-performance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSystemPerformanceReport(
            @RequestParam(defaultValue = "30") int days) {
        // TODO: Implement system performance report
        return ResponseEntity.ok("System performance report for last " + days + " days");
    }

    @GetMapping("/sales-performance")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES') or hasRole('MARKETING')")
    public ResponseEntity<?> getSalesPerformanceReport(
            @RequestParam(defaultValue = "30") int days) {
        // TODO: Implement sales performance report
        return ResponseEntity.ok("Sales performance report for last " + days + " days");
    }
}
