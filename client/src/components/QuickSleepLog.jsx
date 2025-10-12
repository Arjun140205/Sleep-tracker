import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import { format, differenceInMinutes } from "date-fns";

const QuickSleepLog = ({ onEntryAdded }) => {
  const [isLogging, setIsLogging] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState(null);
  const [error, setError] = useState("");

  const startSleepTracking = () => {
    const now = new Date();
    setSleepStartTime(now);
    setIsLogging(true);
    setError("");
    
    // Store in localStorage in case of page refresh
    localStorage.setItem('sleepStartTime', now.toISOString());
    
    // Show notification if supported
    if (Notification.permission === "granted") {
      new Notification("😴 Sleep tracking started", {
        body: `Started at ${format(now, 'HH:mm')}. Tap 'Wake Up' when you're ready!`,
        icon: "/favicon.ico"
      });
    }
  };

  const stopSleepTracking = async () => {
    if (!sleepStartTime) return;

    const wakeTime = new Date();
    const sleepTime = new Date(sleepStartTime);
    
    // Calculate duration
    const minutes = differenceInMinutes(wakeTime, sleepTime);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const duration = `${hours}h ${mins}m`;

    // Prepare entry data
    const entryData = {
      date: format(sleepTime, 'yyyy-MM-dd'),
      sleepTime: format(sleepTime, 'HH:mm'),
      wakeTime: format(wakeTime, 'HH:mm'),
      duration: duration
    };

    try {
      const token = getToken();
      const response = await fetch("http://localhost:5001/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(entryData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Reset state
      setIsLogging(false);
      setSleepStartTime(null);
      localStorage.removeItem('sleepStartTime');
      
      // Notify parent component
      if (onEntryAdded) {
        onEntryAdded(data.entry);
      }

      // Show success notification
      if (Notification.permission === "granted") {
        new Notification("🌅 Sleep logged successfully!", {
          body: `You slept for ${duration}. Great job tracking your sleep!`,
          icon: "/favicon.ico"
        });
      }

    } catch (err) {
      setError(err.message || "Failed to log sleep entry");
    }
  };

  // Check for existing sleep tracking on component mount
  useEffect(() => {
    const storedStartTime = localStorage.getItem('sleepStartTime');
    if (storedStartTime) {
      setSleepStartTime(new Date(storedStartTime));
      setIsLogging(true);
    }
  }, []);

  const getCurrentDuration = () => {
    if (!sleepStartTime) return "0h 0m";
    
    const now = new Date();
    const minutes = differenceInMinutes(now, new Date(sleepStartTime));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold text-blue-800 mb-3">⚡ Quick Sleep Log</h3>
      
      {!isLogging ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Going to bed? Start tracking your sleep with one tap!
          </p>
          <button
            onClick={startSleepTracking}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            😴 Start Sleep Tracking
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Sleep tracking active since:</p>
            <p className="text-xl font-bold text-blue-600">
              {format(new Date(sleepStartTime), 'HH:mm')}
            </p>
            <p className="text-lg text-gray-700 mt-2">
              Current duration: <span className="font-semibold">{getCurrentDuration()}</span>
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={stopSleepTracking}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
            >
              🌅 Wake Up & Log Sleep
            </button>
            
            <button
              onClick={() => {
                setIsLogging(false);
                setSleepStartTime(null);
                localStorage.removeItem('sleepStartTime');
              }}
              className="w-full bg-gray-400 text-white px-4 py-2 rounded text-sm hover:bg-gray-500 transition-colors"
            >
              Cancel Tracking
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Tip: Keep this tab open or bookmark it for easy sleep tracking!
      </div>
    </div>
  );
};

export default QuickSleepLog;