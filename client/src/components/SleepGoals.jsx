import { useState } from "react";
import { getToken } from "../utils/auth";

import API_URL from "../apiConfig";

const SleepGoals = ({ userGoals, onGoalsUpdate }) => {
  const [goals, setGoals] = useState({
    targetSleepHours: 7,
    targetBedtime: "23:00",
    targetWakeTime: "07:00",
    reminderEnabled: true,
    ...userGoals
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/user/goals`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goals),
      });

      if (response.ok) {
        onGoalsUpdate(goals);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save goals:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Sleep Goals</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-zinc-400 hover:text-white transition-colors font-medium"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">Target Sleep Hours</label>
            <input
              type="number"
              min="6"
              max="12"
              step="0.5"
              value={goals.targetSleepHours}
              onChange={(e) => setGoals({ ...goals, targetSleepHours: parseFloat(e.target.value) })}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:border-zinc-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Target Bedtime</label>
              <input
                type="time"
                value={goals.targetBedtime}
                onChange={(e) => setGoals({ ...goals, targetBedtime: e.target.value })}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-zinc-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Target Wake Time</label>
              <input
                type="time"
                value={goals.targetWakeTime}
                onChange={(e) => setGoals({ ...goals, targetWakeTime: e.target.value })}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-zinc-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="reminders"
              checked={goals.reminderEnabled}
              onChange={(e) => setGoals({ ...goals, reminderEnabled: e.target.checked })}
              className="mr-3 w-4 h-4 text-white bg-zinc-800 border-zinc-700 rounded focus:ring-zinc-600"
            />
            <label htmlFor="reminders" className="text-sm text-zinc-300">Enable sleep reminders</label>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Save Goals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-2xl font-bold text-white mb-1">{goals.targetSleepHours}h</div>
            <div className="text-sm text-zinc-400">Target Sleep</div>
          </div>
          <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-lg font-semibold text-white mb-1">{goals.targetBedtime}</div>
            <div className="text-sm text-zinc-400">Bedtime Goal</div>
          </div>
          <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-lg font-semibold text-white mb-1">{goals.targetWakeTime}</div>
            <div className="text-sm text-zinc-400">Wake Goal</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepGoals;