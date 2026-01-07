import React, { useState } from 'react';
import './adminnotificationbel.css'
import { FaBell } from 'react-icons/fa';

const AdminNotificationBell: React.FC = () => {
  const [notificationCount] = useState(3);

  return (
    <div className="adm-notification-bell">
      <button className="adm-notification-btn">
        <FaBell />
        {notificationCount > 0 && (
          <span className="adm-notification-badge">{notificationCount}</span>
        )}
      </button>
    </div>
  );
};

export default AdminNotificationBell;