import { useState } from "react";
import { differenceInMinutes, parse } from "date-fns";

const SleepEntryForm = ({ visible, onClose, setEntries }) => {
  const [date, setDate] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [error, setError] = useState("");

  if (!visible) return null;

  const calculateDuration = () => {
    try {
      const sleep = parse(sleepTime, "HH:mm", new Date());
      const wake = parse(wakeTime, "HH:mm", new Date());
      let minutes = differenceInMinutes(wake, sleep);
      if (minutes < 0) minutes += 1440;

      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hrs}h ${mins}m`;
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    const duration = calculateDuration();
    const newEntry = { date, sleepTime, wakeTime, duration };

    try {
      const res = await fetch("http://localhost:5000/api/entries", {
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Sleep Entry</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full mb-4 p-2 border rounded"
          />

          <label className="block mb-2">Sleep Time</label>
          <input
            type="time"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
            required
            className="w-full mb-4 p-2 border rounded"
          />

          <label className="block mb-2">Wake Time</label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            required
            className="w-full mb-4 p-2 border rounded"
          />

          {sleepTime && wakeTime && (
            <p className="mb-4 text-gray-700">
              Estimated Duration: <strong>{calculateDuration()}</strong>
            </p>
          )}

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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