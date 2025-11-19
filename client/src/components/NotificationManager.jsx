import { useEffect, useState, useCallback, useRef } from "react";
import { HiMoon } from "react-icons/hi2";

const NotificationManager = ({ goals, lastEntry }) => {
  const [permission, setPermission] = useState(Notification.permission);
  const notificationsRef = useRef([]);

  useEffect(() => {
    // Request notification permission on component mount
    if (permission === "default") {
      Notification.requestPermission().then(setPermission);
    }
  }, [permission]);

  const showNotification = useCallback((title, body, type) => {
    if (permission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: type,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  }, [permission]);

  useEffect(() => {
    if (!goals?.reminderEnabled || permission !== "granted") return;

    // Clear existing notifications
    notificationsRef.current.forEach(id => clearTimeout(id));
    notificationsRef.current = [];

    const now = new Date();
    const bedtimeReminder = new Date();
    const [bedHour, bedMin] = goals.targetBedtime.split(':');
    bedtimeReminder.setHours(parseInt(bedHour) - 1, parseInt(bedMin), 0, 0); // 1 hour before bedtime

    const wakeReminder = new Date();
    const [wakeHour, wakeMin] = goals.targetWakeTime.split(':');
    wakeReminder.setHours(parseInt(wakeHour), parseInt(wakeMin), 0, 0);

    // If bedtime reminder is in the past, schedule for tomorrow
    if (bedtimeReminder < now) {
      bedtimeReminder.setDate(bedtimeReminder.getDate() + 1);
    }

    // If wake reminder is in the past, schedule for tomorrow
    if (wakeReminder < now) {
      wakeReminder.setDate(wakeReminder.getDate() + 1);
    }

    // Schedule bedtime reminder
    const bedtimeTimeout = setTimeout(() => {
      showNotification(
        "Bedtime Reminder",
        `Time to start winding down! Your target bedtime is ${goals.targetBedtime}`,
        "bedtime"
      );
    }, bedtimeReminder.getTime() - now.getTime());

    // Schedule wake reminder
    const wakeTimeout = setTimeout(() => {
      showNotification(
        "☀️ Good Morning!",
        "Time to wake up and start your day!",
        "wake"
      );
    }, wakeReminder.getTime() - now.getTime());

    notificationsRef.current = [bedtimeTimeout, wakeTimeout];

    // Cleanup on unmount
    return () => {
      notificationsRef.current.forEach(id => clearTimeout(id));
    };
  }, [goals, permission, showNotification]);



  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Sleep Reminders</h3>
      
      {permission === "default" && (
        <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg mb-4">
          <p className="text-sm text-zinc-300 mb-3">
            Enable notifications to get bedtime and wake-up reminders!
          </p>
          <button
            onClick={requestPermission}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Enable Notifications
          </button>
        </div>
      )}

      {permission === "denied" && (
        <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg mb-4">
          <p className="text-sm text-red-300">
            Notifications are blocked. Please enable them in your browser settings to receive sleep reminders.
          </p>
        </div>
      )}

      {permission === "granted" && goals?.reminderEnabled && (
        <div className="p-4 bg-green-900/50 border border-green-800 rounded-lg">
          <p className="text-sm text-green-300">
            ✅ Sleep reminders are active! You'll get notified 1 hour before your bedtime ({goals.targetBedtime}) 
            and at your wake time ({goals.targetWakeTime}).
          </p>
        </div>
      )}

      {permission === "granted" && !goals?.reminderEnabled && (
        <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
          <p className="text-sm text-zinc-400">
            Notifications are enabled but reminders are turned off in your sleep goals.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationManager;