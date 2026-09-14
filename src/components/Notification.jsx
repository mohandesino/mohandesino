import { useEffect, useState } from "react";

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("mohandesino_notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const clearNotifications = () => {
    localStorage.setItem("mohandesino_notifications", JSON.stringify([]));
    setNotifications([]);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-bell">
      <span className="bell-icon">🔔</span>
      <span className="bell-count">{notifications.length}</span>
      <div className="notification-dropdown">
        {notifications.slice().reverse().map((n, i) => (
          <div key={i} className="notification-item">
            {n.message}
          </div>
        ))}
        <button onClick={clearNotifications} className="notification-clear">
          پاک کردن همه
        </button>
      </div>
    </div>
  );
}

export default Notification;
const addNotification = (message) => {
  const saved = localStorage.getItem("mohandesino_notifications");
  const notifications = saved ? JSON.parse(saved) : [];
  notifications.push({ message, time: Date.now() });
  localStorage.setItem("mohandesino_notifications", JSON.stringify(notifications));
};