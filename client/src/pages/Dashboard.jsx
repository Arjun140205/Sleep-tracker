import { useState, useEffect } from "react";
import { getToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SleepEntryForm from "../components/SleepEntryForm";
import SleepEntryList from "../components/SleepEntryList";
import SleepStats from "../components/SleepStats";
import ExportButton from "../components/ExportButton";
import SleepGoals from "../components/SleepGoals";
import SleepAnalytics from "../components/SleepAnalytics";
import NotificationManager from "../components/NotificationManager";
import SleepCoach from "../components/SleepCoach";
import QuickSleepLog from "../components/QuickSleepLog";
import WeeklyReport from "../components/WeeklyReport";
import NetworkStatus from "../components/NetworkStatus";
import PerformanceMonitor from "../components/PerformanceMonitor";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [userGoals, setUserGoals] = useState(null);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    } else {
      // Load entries
      axios
        .get("http://localhost:5001/api/entries", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEntries(res.data))
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });

      // Load user goals
      axios
        .get("http://localhost:5001/api/user/goals", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUserGoals(res.data))
        .catch((err) => {
          console.log("No user goals found, using defaults");
          setUserGoals({
            targetSleepHours: 7,
            targetBedtime: "23:00",
            targetWakeTime: "07:00",
            reminderEnabled: true
          });
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <NetworkStatus />
      <PerformanceMonitor />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">🛌 Sleep Tracker Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Sleep Goals Section */}
      {userGoals && (
        <SleepGoals 
          userGoals={userGoals} 
          onGoalsUpdate={setUserGoals} 
        />
      )}

      {/* Quick Sleep Log */}
      <QuickSleepLog onEntryAdded={(newEntry) => setEntries(prev => [newEntry, ...prev])} />

      {/* Sleep Coach */}
      <SleepCoach entries={entries} goals={userGoals} />

      {/* Notification Manager */}
      {userGoals && (
        <NotificationManager 
          goals={userGoals} 
          lastEntry={entries[0]} 
        />
      )}

      {/* Sleep Analytics */}
      <SleepAnalytics entries={entries} goals={userGoals} />

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        >
          + New Entry
        </button>
        <ExportButton entries={entries} />
        <button
          onClick={() => setShowWeeklyReport(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded shadow hover:bg-purple-700"
        >
          📊 Weekly Report
        </button>
      </div>

      <SleepEntryList entries={entries} />
      <SleepStats entries={entries} />
      <SleepEntryForm visible={showForm} onClose={() => setShowForm(false)} setEntries={setEntries} />
      <WeeklyReport 
        entries={entries} 
        goals={userGoals} 
        visible={showWeeklyReport} 
        onClose={() => setShowWeeklyReport(false)} 
      />
    </div>
  );
};

export default Dashboard;