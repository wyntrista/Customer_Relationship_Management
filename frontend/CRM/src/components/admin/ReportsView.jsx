import React, { useState, useEffect } from "react";
import authHeader from "../../services/auth-header";

const ReportsView = () => {
  const [activeReport, setActiveReport] = useState("users");
  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: "2025-08-02"
  });
  const [realData, setRealData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Load real data from API
  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/reports/stats', {
          headers: authHeader()
        });
        if (response.ok) {
          const data = await response.json();
          setRealData(data);
        } else {
          console.log('Reports API not available, using mock data');
        }
      } catch (error) {
        console.log('Reports API not available, using mock data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const mockData = {
    userStats: {
      totalUsers: 156,
      activeUsers: 134,
      newUsersThisMonth: 12,
      topUsers: [
        { name: "John Doe", loginCount: 45, lastLogin: "2025-08-01" },
        { name: "Jane Smith", loginCount: 42, lastLogin: "2025-08-02" },
        { name: "Bob Johnson", loginCount: 38, lastLogin: "2025-08-01" }
      ]
    },
    systemStats: {
      totalLogins: 2890,
      failedLogins: 45,
      avgSessionTime: "28 minutes",
      peakUsageHour: "10:00 AM"
    },
    salesStats: {
      totalRevenue: 125000,
      totalDeals: 89,
      avgDealSize: 1404,
      conversionRate: 23.5
    }
  };

  // Use real data if available, fallback to mock data
  const currentData = realData || mockData;
  const isUsingRealData = realData !== null;

  const handleExportReport = (format) => {
    alert(`Exporting ${activeReport} report as ${format}...`);
    // TODO: Implement actual export functionality
  };

  const renderUserReport = () => (
    <div className="card">
      <div className="card-header">
        <h6 className="m-0 font-weight-bold text-primary">User Activity Report</h6>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Total Users
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {currentData.userStats.totalUsers}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Active Users
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {currentData.userStats.activeUsers}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                  New This Month
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {currentData.userStats.newUsersThisMonth}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Growth Rate
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  +8.3%
                </div>
              </div>
            </div>
          </div>
        </div>

        <h6>Top Active Users <small className="text-muted">{isUsingRealData ? '(Dữ liệu thật)' : '(Demo Data)'}</small></h6>
        {!isUsingRealData && (
          <div className="alert alert-warning mb-3">
            <i className="fas fa-exclamation-triangle"></i>
            <strong>Lưu ý:</strong> Đây là dữ liệu demo. Tính năng thống kê người dùng thật đang trong quá trình phát triển.
          </div>
        )}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>User</th>
                <th>Login Count</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {currentData.userStats.topUsers.map((user, index) => (
                <tr key={index}>
                  <td>
                    {user.name} 
                    {!isUsingRealData && <span className="badge badge-secondary ml-2">Demo</span>}
                  </td>
                  <td>{user.loginCount}</td>
                  <td>{user.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSystemReport = () => (
    <div className="card">
      <div className="card-header">
        <h6 className="m-0 font-weight-bold text-primary">System Performance Report</h6>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Total Logins
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {currentData.systemStats.totalLogins.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-danger shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                  Failed Logins
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {currentData.systemStats.failedLogins}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                  Avg Session Time
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {currentData.systemStats.avgSessionTime}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Peak Usage
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {currentData.systemStats.peakUsageHour}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info">
          <h6>System Health Summary</h6>
          <ul className="mb-0">
            <li>Database response time: Average 45ms</li>
            <li>Server uptime: 99.8% this month</li>
            <li>Error rate: 0.2% (within acceptable limits)</li>
            <li>Memory usage: 68% average</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSalesReport = () => (
    <div className="card">
      <div className="card-header">
        <h6 className="m-0 font-weight-bold text-primary">Sales Performance Report</h6>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Total Revenue
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  ${currentData.salesStats.totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                  Total Deals
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {currentData.salesStats.totalDeals}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Avg Deal Size
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  ${currentData.salesStats.avgDealSize}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Conversion Rate
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {currentData.salesStats.conversionRate}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-success">
          <h6>Sales Insights</h6>
          <ul className="mb-0">
            <li>Best performing month: July 2025 ($45,000)</li>
            <li>Top sales representative: Jane Smith (15 deals)</li>
            <li>Most popular product category: Enterprise Solutions</li>
            <li>Average sales cycle: 21 days</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeReport) {
      case "system":
        return renderSystemReport();
      case "sales":
        return renderSalesReport();
      default:
        return renderUserReport();
    }
  };

  return (
    <div>
      {/* Data Status Warning */}
      <div className={`alert ${isUsingRealData ? 'alert-success' : 'alert-info'} mb-4`}>
        <div className="d-flex align-items-center">
          <i className={`fas ${isUsingRealData ? 'fa-check-circle' : 'fa-info-circle'} fa-2x mr-3`}></i>
          <div>
            <h5 className="alert-heading mb-1">
              {isUsingRealData ? 'Dữ liệu thật' : 'Tính năng đang phát triển'}
            </h5>
            <p className="mb-0">
              {isUsingRealData 
                ? <><strong>Tuyệt vời!</strong> Trang báo cáo đang hiển thị dữ liệu thực tế từ hệ thống.</>
                : <><strong>Lưu ý:</strong> Trang báo cáo hiện đang hiển thị dữ liệu demo/mẫu. 
                   Các báo cáo thật sẽ được tích hợp với dữ liệu thực tế từ hệ thống trong phiên bản tiếp theo.</>
              }
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h4>Reports & Analytics</h4>
          <div className="btn-group">
            <button 
              className="btn btn-success"
              onClick={() => handleExportReport("excel")}
            >
              <i className="fas fa-file-excel mr-2"></i>
              Export Excel
            </button>
            <button 
              className="btn btn-info"
              onClick={() => handleExportReport("pdf")}
            >
              <i className="fas fa-file-pdf mr-2"></i>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h6>Date Range Filter</h6>
              <div className="row">
                <div className="col-md-6">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeReport === "users" ? "active" : ""}`}
                onClick={() => setActiveReport("users")}
              >
                <i className="fas fa-users mr-2"></i>
                User Report
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeReport === "system" ? "active" : ""}`}
                onClick={() => setActiveReport("system")}
              >
                <i className="fas fa-server mr-2"></i>
                System Report
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeReport === "sales" ? "active" : ""}`}
                onClick={() => setActiveReport("sales")}
              >
                <i className="fas fa-chart-line mr-2"></i>
                Sales Report
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Report Content */}
      {renderContent()}
    </div>
  );
};

export default ReportsView;
