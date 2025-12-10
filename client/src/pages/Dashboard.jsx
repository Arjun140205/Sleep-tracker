import { useState, useEffect } from "react";
import { getToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiMoon, HiChartBar } from "react-icons/hi2";

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
import DigitalClock from "../components/DigitalClock";
import SleepTimer from "../components/SleepTimer";
import SleepHeatmap from "../components/SleepHeatmap";
import SleepDebtChart from "../components/SleepDebtChart";
import CircadianDriftChart from "../components/CircadianDriftChart";
import { format } from "date-fns";

import API_URL from "../apiConfig";

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
        .get(`${API_URL}/entries`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEntries(res.data))
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });

      // Load user goals
      axios
        .get(`${API_URL}/user/goals`, {
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

  const [initialFormValues, setInitialFormValues] = useState(null);

  const handleSleepComplete = (sleepTime, wakeTime, endDate) => {
    // Open form with pre-filled values
    setInitialFormValues({
      date: format(endDate, 'yyyy-MM-dd'),
      sleepTime,
      wakeTime
    });
    setShowForm(true);
  };

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
                <HiMoon className="text-xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Sleep Tracker</h1>
                <p className="text-zinc-400 text-sm">Neural Sleep Analysis System</p>
              </div>
            </div>

            <div className="hidden md:block">
              <DigitalClock />
            </div>

            <div className="flex gap-4 items-center">

              <button
                onClick={handleLogout}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Clock */}
        <div className="md:hidden mt-4">
          <DigitalClock />
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
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 flex flex-col gap-4">
          <SleepTimer onSleepComplete={handleSleepComplete} />

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Manual Actions</h3>
            <button
              onClick={() => {
                setInitialFormValues(null); // Clear previous auto-fill
                setShowForm(true);
              }}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + New Entry
            </button>
            <ExportButton entries={entries} />
            <button
              onClick={() => setShowWeeklyReport(true)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <HiChartBar className="text-lg" />
              Weekly Report
            </button>
          </div>
        </div>

      </div>

      {/* Advanced Analytics Deep Dive */}
      <h2 className="text-2xl font-bold text-white mb-6">Deep Dive Analytics</h2>

      {/* Heatmap */}
      <div className="mb-6">
        <SleepHeatmap entries={entries} goals={userGoals} />
      </div>

      {/* Advanced Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <SleepDebtChart entries={entries} goals={userGoals} />
        <CircadianDriftChart entries={entries} />
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
      <SleepEntryForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        setEntries={setEntries}
        initialValues={initialFormValues}
      />
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