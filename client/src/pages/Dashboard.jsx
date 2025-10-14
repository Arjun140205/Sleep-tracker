import { useState, useEffect } from "react";
import { getToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import components gradually
import SleepEntryForm from "../components/SleepEntryForm";
import SleepEntryList from "../components/SleepEntryList";
import ExportButton from "../components/ExportButton";
import SleepGoals from "../components/SleepGoals";
import SleepStats from "../components/SleepStats";
import QuickSleepLog from "../components/QuickSleepLog";
import WeeklyReportFixed from "../components/WeeklyReportFixed";
import SleepCoach from "../components/SleepCoach";
import NotificationManager from "../components/NotificationManager";

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
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                <span className="text-xl">🛌</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Sleep Tracker</h1>
                <p className="text-zinc-400 text-sm">Neural Sleep Analysis System</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Basic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Sleep Goals */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
          {userGoals && (
            <SleepGoals 
              userGoals={userGoals} 
              onGoalsUpdate={setUserGoals} 
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + New Entry
            </button>
            <ExportButton entries={entries} />
            <button
              onClick={() => setShowWeeklyReport(true)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              📊 Weekly Report
            </button>
          </div>
        </div>

      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Sleep Entry List */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg">
          <SleepEntryList entries={entries} />
        </div>

        {/* Sleep Stats */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg">
          <SleepStats entries={entries} />
        </div>

      </div>

      {/* Quick Sleep Log */}
      <div className="mb-8">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg">
          <QuickSleepLog onEntryAdded={(newEntry) => setEntries(prev => [newEntry, ...prev])} />
        </div>
      </div>

      {/* Sleep Coach */}
      <div className="mb-8">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg">
          <SleepCoach entries={entries} goals={userGoals} />
        </div>
      </div>

      {/* Notification Manager */}
      {userGoals && (
        <div className="mb-8">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg">
            <NotificationManager 
              goals={userGoals} 
              lastEntry={entries[0]} 
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <SleepEntryForm visible={showForm} onClose={() => setShowForm(false)} setEntries={setEntries} />
      <WeeklyReportFixed 
        entries={entries} 
        goals={userGoals} 
        visible={showWeeklyReport} 
        onClose={() => setShowWeeklyReport(false)} 
      />
    </div>
  );
};

export default Dashboard;