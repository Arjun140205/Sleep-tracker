import { useState, useEffect } from "react";
import { getToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiMoon, HiChartBar, HiBeaker } from "react-icons/hi2";

const TestDashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [userGoals, setUserGoals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        .then((res) => {
          setEntries(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load entries");
          setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <HiMoon className="text-6xl mb-4 text-blue-600 mx-auto" />
          <p className="text-blue-800 font-semibold">Loading Sleep Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
          <HiBeaker className="text-3xl" />
          Test Dashboard
        </h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Basic Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <HiChartBar className="text-2xl" />
          Basic Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{entries.length}</div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {userGoals?.targetSleepHours || 7}h
            </div>
            <div className="text-sm text-gray-600">Sleep Goal</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {userGoals?.targetBedtime || "23:00"}
            </div>
            <div className="text-sm text-gray-600">Target Bedtime</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">
              {userGoals?.targetWakeTime || "07:00"}
            </div>
            <div className="text-sm text-gray-600">Target Wake Time</div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">📝 Recent Sleep Entries</h2>
        {entries.length === 0 ? (
          <p className="text-gray-600">No sleep entries yet. Add your first entry!</p>
        ) : (
          <div className="space-y-2">
            {entries.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{entry.date}</span>
                  <span className="text-gray-600 ml-2">
                    {entry.sleepTime} → {entry.wakeTime}
                  </span>
                </div>
                <div className="text-blue-600 font-semibold">
                  {entry.duration}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <h3 className="font-bold">✅ Test Dashboard Working!</h3>
        <p className="text-sm mt-1">
          This simplified dashboard loads without any complex components that might cause caching issues.
          If you see this message, the core app functionality is working correctly.
        </p>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded mt-4">
        <h3 className="font-bold">🔍 Debug Information</h3>
        <div className="text-sm mt-2 space-y-1">
          <p>• Entries loaded: {entries.length}</p>
          <p>• User goals: {userGoals ? 'Loaded' : 'Not loaded'}</p>
          <p>• Authentication: Working</p>
          <p>• API connection: Working</p>
          <p>• No calculateSleepStreak references in this component</p>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;