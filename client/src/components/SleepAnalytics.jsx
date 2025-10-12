import { useMemo } from "react";
import { differenceInMinutes, parse } from "date-fns";

const SleepAnalytics = ({ entries, goals }) => {
  const analytics = useMemo(() => {
    if (!entries || !entries.length) return null;

    const recentEntries = entries.slice(0, 7); // Last 7 days
    const targetMinutes = (goals?.targetSleepHours || 7) * 60;

    // Calculate sleep debt
    const totalSleepDebt = recentEntries.reduce((debt, entry) => {
      try {
        const duration = entry.duration;
        const [h, m] = duration.replace("h", "").replace("m", "").split(" ");
        const actualMinutes = parseInt(h) * 60 + parseInt(m);
        return debt + Math.max(0, targetMinutes - actualMinutes);
      } catch (error) {
        console.error("Error calculating sleep debt for entry:", entry, error);
        return debt;
      }
    }, 0);

    // Sleep consistency score (how close to target bedtime)
    let consistencyScore = 0;
    if (goals?.targetBedtime) {
      try {
        consistencyScore = recentEntries.reduce((score, entry) => {
          const targetTime = parse(goals.targetBedtime, "HH:mm", new Date());
          const actualTime = parse(entry.sleepTime, "HH:mm", new Date());
          const diff = Math.abs(differenceInMinutes(targetTime, actualTime));
          return score + Math.max(0, 100 - (diff * 2)); // 2 points per minute off
        }, 0) / recentEntries.length;
      } catch (error) {
        console.error("Error calculating consistency score:", error);
        consistencyScore = 0;
      }
    }

    // Sleep quality trends
    const avgSleep = recentEntries.reduce((sum, entry) => {
      try {
        const [h, m] = entry.duration.replace("h", "").replace("m", "").split(" ");
        return sum + (parseInt(h) * 60 + parseInt(m));
      } catch (error) {
        console.error("Error calculating average sleep for entry:", entry, error);
        return sum;
      }
    }, 0) / recentEntries.length;

    const sleepQuality = avgSleep >= targetMinutes ? "Good" : 
                        avgSleep >= targetMinutes * 0.85 ? "Fair" : "Poor";

    // Calculate sleep streak directly inline - NO EXTERNAL FUNCTION
    let sleepStreak = 0;
    try {
      for (const entry of recentEntries) {
        const [h, m] = entry.duration.replace("h", "").replace("m", "").split(" ");
        const actualMinutes = parseInt(h) * 60 + parseInt(m);
        if (actualMinutes >= targetMinutes * 0.9) { // 90% of target counts as success
          sleepStreak++;
        } else {
          break;
        }
      }
    } catch (error) {
      console.error("Error calculating sleep streak:", error);
      sleepStreak = 0;
    }

    return {
      sleepDebt: Math.round(totalSleepDebt / 60 * 10) / 10, // Hours with 1 decimal
      consistencyScore: Math.round(consistencyScore),
      avgSleep: Math.round(avgSleep / 60 * 10) / 10,
      sleepQuality,
      streak: sleepStreak
    };
  }, [entries, goals]);

  const getRecommendations = () => {
    if (!analytics) return [];
    
    const recommendations = [];
    
    try {
      if (analytics.sleepDebt > 2) {
        recommendations.push({
          type: "warning",
          message: `You have ${analytics.sleepDebt}h of sleep debt. Try going to bed 30 minutes earlier tonight.`
        });
      }
      
      if (analytics.consistencyScore < 70) {
        recommendations.push({
          type: "info",
          message: "Your bedtime varies significantly. Try to stick to your target bedtime for better sleep quality."
        });
      }
      
      if (analytics.streak >= 3) {
        recommendations.push({
          type: "success",
          message: `Great job! You've maintained good sleep for ${analytics.streak} days in a row! 🎉`
        });
      }
      
      if (analytics.avgSleep < 6.5) {
        recommendations.push({
          type: "warning",
          message: "You're averaging less than 6.5 hours of sleep. This can impact your academic performance and health."
        });
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }

    return recommendations;
  };

  if (!analytics) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">💡 Sleep Analytics</h2>
        <p className="text-gray-600">Add more sleep entries to see personalized insights!</p>
      </div>
    );
  }

  const recommendations = getRecommendations();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">💡 Sleep Analytics</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded">
          <div className="text-2xl font-bold text-red-600">{analytics.sleepDebt}h</div>
          <div className="text-sm text-gray-600">Sleep Debt</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded">
          <div className="text-2xl font-bold text-blue-600">{analytics.consistencyScore}%</div>
          <div className="text-sm text-gray-600">Consistency</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded">
          <div className="text-2xl font-bold text-green-600">{analytics.avgSleep}h</div>
          <div className="text-sm text-gray-600">Avg Sleep</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded">
          <div className="text-2xl font-bold text-purple-600">{analytics.streak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Sleep Quality Badge */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          analytics.sleepQuality === 'Good' ? 'bg-green-100 text-green-800' :
          analytics.sleepQuality === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          Sleep Quality: {analytics.sleepQuality}
        </span>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-800">Recommendations:</h3>
          {recommendations.map((rec, index) => (
            <div key={index} className={`p-3 rounded text-sm ${
              rec.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              rec.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {rec.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SleepAnalytics;