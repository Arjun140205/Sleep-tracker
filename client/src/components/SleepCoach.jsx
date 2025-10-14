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
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-white">Your Sleep Coach</h2>
        <button
          onClick={() => setShowCoaching(false)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Personalized Message */}
      <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg mb-6">
        <p className="font-medium text-white">
          {personalizedMessage.message}
        </p>
        <p className="text-sm mt-2 text-zinc-400">
          {personalizedMessage.action}
        </p>
      </div>

      {/* Sleep Tip Carousel */}
      <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-white">💡 Sleep Tip of the Moment</h3>
          <div className="flex space-x-2">
            {sleepTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTip(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTip ? 'bg-white' : 'bg-zinc-600 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <span className="text-2xl">{sleepTips[currentTip].icon}</span>
          <div>
            <h4 className="font-medium text-white mb-2">
              {sleepTips[currentTip].title}
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {sleepTips[currentTip].content}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors">
          📚 Sleep Education
        </button>
        <button className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors">
          🧘‍♀️ Relaxation Exercises
        </button>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('openWeeklyReport'))}
          className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"
        >
          📊 Weekly Report
        </button>
      </div>
    </div>
  );
};

export default SleepCoach;