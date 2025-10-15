import { useMemo } from "react";
import { HiChartBar, HiXMark, HiCheckCircle, HiExclamationTriangle, HiSparkles, HiArrowTrendingUp } from "react-icons/hi2";

const WeeklyReportFixed = ({ entries, goals, visible, onClose }) => {
  const weeklyData = useMemo(() => {
    try {
      if (!entries.length) return null;

      // Simple weekly stats without complex date calculations
      const recentEntries = entries.slice(0, 7); // Last 7 entries
      
      const totalSleep = recentEntries.reduce((sum, entry) => {
        const [h, m] = entry.duration.replace("h", "").replace("m", "").split(" ");
        return sum + (parseInt(h) * 60 + parseInt(m));
      }, 0);
      
      const avgSleep = totalSleep / (recentEntries.length || 1);
      const daysWithGoodSleep = recentEntries.filter(entry => {
        const [h] = entry.duration.replace("h", "").replace("m", "").split(" ");
        return parseInt(h) >= (goals?.targetSleepHours || 7) * 0.9;
      }).length;
      
      return {
        stats: {
          avgSleep: avgSleep / 60,
          totalSleep: totalSleep / 60,
          daysWithGoodSleep,
          weekRange: "Last 7 entries"
        }
      };
    } catch (error) {
      console.error('Error calculating weekly data:', error);
      return null;
    }
  }, [entries, goals]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <HiChartBar className="text-2xl text-blue-800" />
              <h2 className="text-2xl font-bold text-blue-800">Weekly Sleep Report</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              <HiXMark />
            </button>
          </div>

          {!weeklyData ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No sleep data available for this week.</p>
            </div>
          ) : (
            <>
              {/* Week Range */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-700">
                  {weeklyData.stats.weekRange}
                </h3>
              </div>

              {/* Weekly Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyData.stats.avgSleep.toFixed(1)}h
                  </div>
                  <div className="text-sm text-gray-600">Avg Sleep</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {weeklyData.stats.daysWithGoodSleep}/7
                  </div>
                  <div className="text-sm text-gray-600">Good Sleep Days</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {weeklyData.stats.totalSleep.toFixed(1)}h
                  </div>
                  <div className="text-sm text-gray-600">Total Sleep</div>
                </div>
              </div>

              {/* Weekly Insights */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">Weekly Insights</h4>
                <div className="space-y-2 text-sm">
                  {weeklyData.stats.avgSleep >= (goals?.targetSleepHours || 7) ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <HiCheckCircle className="text-base" />
                      <p>Great job! You're meeting your sleep goals this week.</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-700">
                      <HiExclamationTriangle className="text-base" />
                      <p>You're averaging {((goals?.targetSleepHours || 7) - weeklyData.stats.avgSleep).toFixed(1)} hours less sleep than your goal.</p>
                    </div>
                  )}
                  
                  {weeklyData.stats.daysWithGoodSleep >= 5 ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <HiSparkles className="text-base" />
                      <p>Excellent consistency! You had good sleep on {weeklyData.stats.daysWithGoodSleep} days.</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-yellow-700">
                      <HiArrowTrendingUp className="text-base" />
                      <p>Try to improve consistency. Aim for at least 5 days of good sleep per week.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportFixed;