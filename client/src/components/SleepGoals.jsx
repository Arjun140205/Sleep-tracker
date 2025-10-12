import { useState } from "react";
import { getToken } from "../utils/auth";

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
      const response = await fetch("http://localhost:5001/api/user/goals", {
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800">🎯 Sleep Goals</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-600 hover:text-blue-800"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Target Sleep Hours</label>
            <input
              type="number"
              min="6"
              max="12"
              step="0.5"
              value={goals.targetSleepHours}
              onChange={(e) => setGoals({...goals, targetSleepHours: parseFloat(e.target.value)})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target Bedtime</label>
              <input
                type="time"
                value={goals.targetBedtime}
                onChange={(e) => setGoals({...goals, targetBedtime: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Wake Time</label>
              <input
                type="time"
                value={goals.targetWakeTime}
                onChange={(e) => setGoals({...goals, targetWakeTime: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="reminders"
              checked={goals.reminderEnabled}
              onChange={(e) => setGoals({...goals, reminderEnabled: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="reminders" className="text-sm">Enable sleep reminders</label>
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Goals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{goals.targetSleepHours}h</div>
            <div className="text-sm text-gray-600">Target Sleep</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-lg font-semibold text-green-600">{goals.targetBedtime}</div>
            <div className="text-sm text-gray-600">Bedtime Goal</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-lg font-semibold text-orange-600">{goals.targetWakeTime}</div>
            <div className="text-sm text-gray-600">Wake Goal</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepGoals;