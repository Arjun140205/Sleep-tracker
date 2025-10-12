import { useMemo } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const WeeklyReport = ({ entries, goals, visible, onClose }) => {
  const weeklyData = useMemo(() => {
    try {
      if (!entries.length) return null;

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const weeklyEntries = entries.filter(entry => {
      const entryDate = parseISO(entry.date + 'T00:00:00');
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    });

    const dailyData = weekDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayEntry = weeklyEntries.find(entry => entry.date === dayStr);
      
      let sleepMinutes = 0;
      let bedtimeScore = 0;
      
      if (dayEntry) {
        const [h, m] = dayEntry.duration.replace("h", "").replace("m", "").split(" ");
        sleepMinutes = parseInt(h) * 60 + parseInt(m);
        
        // Calculate bedtime score (how close to target)
        if (goals?.targetBedtime) {
          const targetMinutes = goals.targetBedtime.split(':').reduce((h, m) => h * 60 + parseInt(m), 0);
          const actualMinutes = dayEntry.sleepTime.split(':').reduce((h, m) => h * 60 + parseInt(m), 0);
          const diff = Math.abs(targetMinutes - actualMinutes);
          bedtimeScore = Math.max(0, 100 - (diff * 2)); // 2 points per minute off
        }
      }

      return {
        day: format(day, 'EEE'),
        date: dayStr,
        sleepHours: sleepMinutes / 60,
        sleepMinutes,
        bedtimeScore,
        hasEntry: !!dayEntry,
        targetHours: goals?.targetSleepHours || 7
      };
    });

    // Calculate weekly stats
    const totalSleep = dailyData.reduce((sum, day) => sum + day.sleepMinutes, 0);
    const avgSleep = totalSleep / (dailyData.filter(d => d.hasEntry).length || 1);
    const daysWithGoodSleep = dailyData.filter(d => d.sleepHours >= (goals?.targetSleepHours || 7) * 0.9).length;
    const avgBedtimeScore = dailyData.reduce((sum, day) => sum + day.bedtimeScore, 0) / dailyData.length;
    
    return {
      dailyData,
      stats: {
        avgSleep: avgSleep / 60,
        totalSleep: totalSleep / 60,
        daysWithGoodSleep,
        avgBedtimeScore,
        weekRange: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
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
            <h2 className="text-2xl font-bold text-blue-800">📊 Weekly Sleep Report</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
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
                  Week of {weeklyData.stats.weekRange}
                </h3>
              </div>

              {/* Weekly Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {weeklyData.stats.avgBedtimeScore.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Bedtime Score</div>
                </div>
              </div>

              {/* Sleep Hours Chart */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Daily Sleep Hours</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyData.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value, name) => [`${value.toFixed(1)}h`, 'Sleep Hours']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="sleepHours" fill="#3b82f6" />
                    <Line 
                      type="monotone" 
                      dataKey="targetHours" 
                      stroke="#ef4444" 
                      strokeDasharray="5 5"
                      name="Target"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Bedtime Consistency Chart */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Bedtime Consistency Score</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyData.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} label={{ value: 'Score %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(0)}%`, 'Consistency Score']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bedtimeScore" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Insights */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">Weekly Insights</h4>
                <div className="space-y-2 text-sm">
                  {weeklyData.stats.avgSleep >= (goals?.targetSleepHours || 7) ? (
                    <p className="text-green-700">✅ Great job! You're meeting your sleep goals this week.</p>
                  ) : (
                    <p className="text-red-700">⚠️ You're averaging {((goals?.targetSleepHours || 7) - weeklyData.stats.avgSleep).toFixed(1)} hours less sleep than your goal.</p>
                  )}
                  
                  {weeklyData.stats.daysWithGoodSleep >= 5 ? (
                    <p className="text-green-700">🎉 Excellent consistency! You had good sleep on {weeklyData.stats.daysWithGoodSleep} days.</p>
                  ) : (
                    <p className="text-yellow-700">📈 Try to improve consistency. Aim for at least 5 days of good sleep per week.</p>
                  )}
                  
                  {weeklyData.stats.avgBedtimeScore >= 80 ? (
                    <p className="text-green-700">🕘 Your bedtime consistency is excellent!</p>
                  ) : weeklyData.stats.avgBedtimeScore >= 60 ? (
                    <p className="text-yellow-700">🕘 Your bedtime is fairly consistent, but there's room for improvement.</p>
                  ) : (
                    <p className="text-red-700">🕘 Try to stick closer to your target bedtime for better sleep quality.</p>
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

export default WeeklyReport;