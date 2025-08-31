import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // We will create this file for styling
import logo from '../../assets/aee0867d-798f-45d0-b353-8fb60cf9c308.svg';

const Sidebar = ({ currentUser, onLogout }) => {
  const getMenuItems = () => {
    const level = currentUser?.permissionLevel ?? 0;
    const roles = currentUser?.roles || [];
    const isAdmin = level >= 8 || roles.includes('ROLE_ADMIN');
    
    let items = [
      { path: '/dashboard', icon: 'fa-home', label: 'Overview' },
      { path: '/profile', icon: 'fa-user', label: 'My Profile' },
      { path: '/statistics', icon: 'fa-chart-pie', label: 'Statistics' },
      { path: '/export', icon: 'fa-file-excel', label: 'Export Excel' },
    ];

    // Admin has all permissions
    if (isAdmin) { 
      items.push({ path: '/dashboard/leads', icon: 'fa-user-plus', label: 'Leads' });
      items.push({ path: '/dashboard/opportunities', icon: 'fa-briefcase', label: 'Opportunities' });
      items.push({ path: '/dashboard/campaigns', icon: 'fa-bullhorn', label: 'Campaigns' });
      items.push({ path: '/dashboard/calls', icon: 'fa-phone', label: 'Call Queues' });
      items.push({ path: '/dashboard/users', icon: 'fa-users-cog', label: 'User Management' });
      items.push({ path: '/dashboard/settings', icon: 'fa-cogs', label: 'System Settings' });
    }
    else if (level >= 4 || roles.includes('ROLE_MARKETING')) { // Marketing
      items.push({ path: '/dashboard/campaigns', icon: 'fa-bullhorn', label: 'Campaigns' });
      items.push({ path: '/dashboard/leads', icon: 'fa-user-plus', label: 'Leads' });
    }
    else if (level >= 2 || roles.includes('ROLE_SALES')) { // Sales
      items.push({ path: '/dashboard/leads', icon: 'fa-user-plus', label: 'Leads' });
      items.push({ path: '/dashboard/opportunities', icon: 'fa-briefcase', label: 'Opportunities' });
    }
    else if (level >= 1 || roles.includes('ROLE_TELESALES')) { // Telesales
        items.push({ path: '/dashboard/calls', icon: 'fa-phone', label: 'Call Queues' });
        items.push({ path: '/dashboard/leads', icon: 'fa-user-plus', label: 'Leads' });
    }

    return items;
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <img src={logo} alt="CRM Pro Logo" className="sidebar-logo" />
      </div>
      <ul className="sidebar-menu">
        {getMenuItems().map((item, index) => (
          <li key={index}>
            <Link to={item.path}>
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      {/* User Info Section */}
      <Link to="/profile" className="sidebar-user-info">
        <div className="user-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="user-details">
          <div className="user-name">{currentUser?.fullName || currentUser?.username || 'User'}</div>
          <div className="user-role">
            {currentUser?.roles?.includes('ROLE_ADMIN') ? 'Admin' :
             currentUser?.roles?.includes('ROLE_MARKETING') ? 'Marketing' :
             currentUser?.roles?.includes('ROLE_SALES') ? 'Sales' :
             currentUser?.roles?.includes('ROLE_TELESALES') ? 'Telesales' :
             'User'}
          </div>
        </div>
      </Link>
      
      <div className="sidebar-footer">
        <Link to="/login" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
