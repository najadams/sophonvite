// import React from 'react'

// const Notifications = () => {
//   return (
//       <div className='page'>
//           <div className="heading">
//               <div>
//                   <h1 style={{padding: 10, fontWeight: 200}}>Notifications</h1>
//               </div>
//           </div>
//     </div>
//   )
// }

// export default Notifications

import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = ({ companyId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/notifications/${companyId}`);
        const data = response.data;

        // Ensure data is an array
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setNotifications([]);
          console.error("Fetched data is not an array:", data);
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [companyId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading notifications: {error.message}</div>;

  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1 style={{ padding: 10, fontWeight: 200 }}>Notifications</h1>
        </div>
      </div>
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification._id} className="notification">
              <p>{notification.message}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No notifications to display</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
