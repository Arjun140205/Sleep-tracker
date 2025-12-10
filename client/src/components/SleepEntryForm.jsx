import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import { calculateDuration } from "../utils/timeUtils";

import API_URL from "../apiConfig";

const SleepEntryForm = ({ visible, onClose, setEntries, initialValues }) => {
  const [date, setDate] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible && initialValues) {
      if (initialValues.date) setDate(initialValues.date);
      if (initialValues.sleepTime) setSleepTime(initialValues.sleepTime);
      if (initialValues.wakeTime) setWakeTime(initialValues.wakeTime);
    }
  }, [visible, initialValues]);

  if (!visible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = getToken();
    const duration = calculateDuration(sleepTime, wakeTime);
    const newEntry = { date, sleepTime, wakeTime, duration };

    try {
      const res = await fetch(`${API_URL}/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setEntries((prev) => [data.entry, ...prev]);
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add entry");
    }
  };

  const resetForm = () => {
    setDate("");
    setSleepTime("");
    setWakeTime("");
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-6">Add New Sleep Entry</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-zinc-300 font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-zinc-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 text-zinc-300 font-medium">Sleep Time</label>
            <input
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              required
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-zinc-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 text-zinc-300 font-medium">Wake Time</label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              required
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-zinc-600 focus:outline-none transition-colors"
            />
          </div>

          {sleepTime && wakeTime && (
            <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
              <p className="text-zinc-300">
                Estimated Duration: <span className="text-white font-semibold">{calculateDuration(sleepTime, wakeTime)}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SleepEntryForm;