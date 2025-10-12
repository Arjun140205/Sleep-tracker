import React from "react";

// Simple test component to isolate the issue
const TestSleepInsights = ({ entries, goals }) => {
  console.log("🧪 TestSleepInsights rendering with:", { entries, goals });

  if (!entries || !entries.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">🧪 Test Sleep Insights</h2>
        <p className="text-gray-600">No entries available for testing.</p>
      </div>
    );
  }

  // Simple calculation without useMemo to test
  const recentEntries = entries.slice(0, 7);
  const targetMinutes = (goals?.targetSleepHours || 7) * 60;

  let streak = 0;
  for (const entry of recentEntries) {
    try {
      const [h, m] = entry.duration.replace("h", "").replace("m", "").split(" ");
      const actualMinutes = parseInt(h) * 60 + parseInt(m);
      if (actualMinutes >= targetMinutes * 0.9) {
        streak++;
      } else {
        break;
      }
    } catch (error) {
      console.error("Error calculating streak for entry:", entry, error);
      break;
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">🧪 Test Sleep Insights</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded">
          <div className="text-2xl font-bold text-blue-600">{recentEntries.length}</div>
          <div className="text-sm text-gray-600">Entries</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded">
          <div className="text-2xl font-bold text-purple-600">{streak}</div>
          <div className="text-sm text-gray-600">Streak</div>
        </div>
      </div>
    </div>
  );
};

export default TestSleepInsights;