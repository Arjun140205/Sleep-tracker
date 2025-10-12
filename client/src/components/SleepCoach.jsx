import { useState, useEffect } from "react";
import { isToday, parseISO } from "date-fns";

const SleepCoach = ({ entries, goals }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [showCoaching, setShowCoaching] = useState(true);

  const sleepTips = [
    {
      title: "Create a Sleep Schedule",
      content: "Go to bed and wake up at the same time every day, even on weekends. This helps regulate your body's internal clock.",
      icon: "⏰"
    },
    {
      title: "Limit Screen Time Before Bed",
      content: "Avoid phones, laptops, and TV for at least 1 hour before bedtime. Blue light can interfere with melatonin production.",
      icon: "📱"
    },
    {
      title: "Create a Bedtime Routine",
      content: "Develop a relaxing pre-sleep routine like reading, gentle stretching, or meditation to signal your body it's time to wind down.",
      icon: "🧘‍♀️"
    },
    {
      title: "Optimize Your Sleep Environment",
      content: "Keep your room cool (60-67°F), dark, and quiet. Consider blackout curtains, eye masks, or white noise machines.",
      icon: "🌙"
    },
    {
      title: "Watch Your Caffeine Intake",
      content: "Avoid caffeine 6 hours before bedtime. This includes coffee, tea, soda, and chocolate.",
      icon: "☕"
    },
    {
      title: "Get Natural Light Exposure",
      content: "Spend time in bright light during the day, especially in the morning. This helps maintain your circadian rhythm.",
      icon: "☀️"
    },
    {
      title: "Exercise Regularly",
      content: "Regular physical activity can help you fall asleep faster and enjoy deeper sleep. Just avoid vigorous exercise close to bedtime.",
      icon: "🏃‍♀️"
    },
    {
      title: "Manage Stress and Worry",
      content: "Try journaling, deep breathing, or meditation before bed to clear your mind of daily stresses.",
      icon: "📝"
    }
  ];

  const getPersonalizedMessage = () => {
    if (!entries.length) {
      return {
        type: "welcome",
        message: "Welcome to your sleep journey! Start by logging your sleep patterns to get personalized insights.",
        action: "Log your first sleep entry to begin!"
      };
    }

    const lastEntry = entries[0];
    const isLastEntryToday = isToday(parseISO(lastEntry.date + 'T00:00:00'));
    
    if (!isLastEntryToday) {
      return {
        type: "reminder",
        message: "Haven't logged your sleep today yet?",
        action: "Don't forget to track last night's sleep!"
      };
    }

    // Analyze recent sleep pattern
    const recentEntries = entries.slice(0, 7);
    const avgSleep = recentEntries.reduce((sum, entry) => {
      const [h, m] = entry.duration.replace("h", "").replace("m", "").split(" ");
      return sum + (parseInt(h) + parseInt(m) / 60);
    }, 0) / recentEntries.length;

    const targetHours = goals?.targetSleepHours || 7;

    if (avgSleep < targetHours - 1) {
      return {
        type: "concern",
        message: `You're averaging ${avgSleep.toFixed(1)} hours of sleep, which is below your ${targetHours}h goal.`,
        action: "Try going to bed 30 minutes earlier tonight!"
      };
    } else if (avgSleep >= targetHours) {
      return {
        type: "success",
        message: `Great job! You're meeting your sleep goals with an average of ${avgSleep.toFixed(1)} hours.`,
        action: "Keep up the excellent sleep habits!"
      };
    } else {
      return {
        type: "progress",
        message: `You're close to your goal! Currently averaging ${avgSleep.toFixed(1)} hours.`,
        action: "Just a little more consistency and you'll reach your target!"
      };
    }
  };

  const personalizedMessage = getPersonalizedMessage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % sleepTips.length);
    }, 10000); // Change tip every 10 seconds

    return () => clearInterval(interval);
  }, [sleepTips.length]);

  if (!showCoaching) {
    return (
      <button
        onClick={() => setShowCoaching(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
      >
        💡
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow-md mb-6 border border-blue-100">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-blue-800">🎓 Your Sleep Coach</h2>
        <button
          onClick={() => setShowCoaching(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Personalized Message */}
      <div className={`p-4 rounded-lg mb-4 ${
        personalizedMessage.type === 'success' ? 'bg-green-100 border border-green-200' :
        personalizedMessage.type === 'concern' ? 'bg-red-100 border border-red-200' :
        personalizedMessage.type === 'progress' ? 'bg-yellow-100 border border-yellow-200' :
        'bg-blue-100 border border-blue-200'
      }`}>
        <p className={`font-medium ${
          personalizedMessage.type === 'success' ? 'text-green-800' :
          personalizedMessage.type === 'concern' ? 'text-red-800' :
          personalizedMessage.type === 'progress' ? 'text-yellow-800' :
          'text-blue-800'
        }`}>
          {personalizedMessage.message}
        </p>
        <p className={`text-sm mt-1 ${
          personalizedMessage.type === 'success' ? 'text-green-600' :
          personalizedMessage.type === 'concern' ? 'text-red-600' :
          personalizedMessage.type === 'progress' ? 'text-yellow-600' :
          'text-blue-600'
        }`}>
          {personalizedMessage.action}
        </p>
      </div>

      {/* Sleep Tip Carousel */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800">💡 Sleep Tip of the Moment</h3>
          <div className="flex space-x-1">
            {sleepTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTip(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentTip ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{sleepTips[currentTip].icon}</span>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">
              {sleepTips[currentTip].title}
            </h4>
            <p className="text-sm text-gray-600">
              {sleepTips[currentTip].content}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">
          📚 Sleep Education
        </button>
        <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200">
          🧘‍♀️ Relaxation Exercises
        </button>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('openWeeklyReport'))}
          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
        >
          📊 Weekly Report
        </button>
      </div>
    </div>
  );
};

export default SleepCoach;