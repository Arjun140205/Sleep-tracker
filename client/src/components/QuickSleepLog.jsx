import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import { format, differenceInMinutes } from "date-fns";
import { HiMoon, HiSun, HiLightBulb } from "react-icons/hi2";

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
      new Notification("Sleep tracking started", {
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
        new Notification("Sleep logged successfully!", {
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
    <div className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Quick Sleep Log</h3>
      
      {!isLogging ? (
        <div className="text-center">
          <p className="text-zinc-400 mb-6">
            Going to bed? Start tracking your sleep with one tap!
          </p>
          <button
            onClick={startSleepTracking}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <HiMoon className="text-xl" />
            Start Sleep Tracking
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <p className="text-zinc-400 mb-3">Sleep tracking active since:</p>
            <p className="text-2xl font-bold text-white mb-3">
              {format(new Date(sleepStartTime), 'HH:mm')}
            </p>
            <p className="text-zinc-300">
              Current duration: <span className="font-semibold">{getCurrentDuration()}</span>
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={stopSleepTracking}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <HiSun className="text-xl" />
              Wake Up & Log Sleep
            </button>
            
            <button
              onClick={() => {
                setIsLogging(false);
                setSleepStartTime(null);
                localStorage.removeItem('sleepStartTime');
              }}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Cancel Tracking
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-800 text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 text-xs text-zinc-500 text-center flex items-center justify-center gap-2">
        <HiLightBulb className="text-sm" />
        Tip: Keep this tab open or bookmark it for easy sleep tracking!
      </div>
    </div>
  );
};

export default QuickSleepLog;