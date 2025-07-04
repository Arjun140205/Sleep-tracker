import { useState, useEffect } from "react";
import { getToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SleepEntryForm from "../components/SleepEntryForm";
import SleepEntryList from "../components/SleepEntryList";
import SleepStats from "../components/SleepStats";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:5001/api/entries", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEntries(res.data))
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">🛌 Sleep Tracker Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
      >
        + New Entry
      </button>

      <SleepEntryList entries={entries} />
      <SleepStats entries={entries} />
      <SleepEntryForm visible={showForm} onClose={() => setShowForm(false)} setEntries={setEntries} />
    </div>
  );
};

export default Dashboard;