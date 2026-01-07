import React from 'react';
import './adminprofileheader.css'

const AdminProfileHeader: React.FC = () => {
  return (
    <div className="adm-profile-header">
      <div className="adm-profile-info">
        <div className="adm-profile-avatar">
          <span>AD</span>
        </div>
        <div className="adm-profile-details">
          <span className="adm-profile-name">Administrator</span>
          <span className="adm-profile-role">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileHeader;