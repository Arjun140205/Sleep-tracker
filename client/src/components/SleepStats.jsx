import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { parse, getHours, getMinutes } from "date-fns";

const SleepStats = ({ entries }) => {
  if (!entries.length) return null;

  // Convert duration string to minutes (e.g., "7h 30m" -> 450)
  const toMinutes = (durationStr) => {
    const [h, m] = durationStr.replace("h", "").replace("m", "").split(" ");
    return parseInt(h) * 60 + parseInt(m);
  };

  const durations = entries.map((e) => toMinutes(e.duration));
  const avgMinutes = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
  const avgHrs = Math.floor(avgMinutes / 60);
  const avgMins = avgMinutes % 60;

  const lessThan6 = durations.filter((d) => d < 360).length;
  const moreThan8 = durations.filter((d) => d > 480).length;

  // Avg sleep/wake time
  const toMinutesSinceMidnight = (t) => {
    const parsed = parse(t, "HH:mm", new Date());
    return getHours(parsed) * 60 + getMinutes(parsed);
  };

  const avgSleepTimeMins = Math.round(
    entries.reduce((sum, e) => sum + toMinutesSinceMidnight(e.sleepTime), 0) / entries.length
  );
  const avgWakeTimeMins = Math.round(
    entries.reduce((sum, e) => sum + toMinutesSinceMidnight(e.wakeTime), 0) / entries.length
  );

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Sleep Summary</h2>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <p className="text-zinc-300"><span className="text-white font-semibold">Average Duration:</span> {avgHrs}h {avgMins}m</p>
          </div>
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <p className="text-zinc-300"><span className="text-white font-semibold">Days &lt; 6h:</span> {lessThan6}</p>
          </div>
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <p className="text-zinc-300"><span className="text-white font-semibold">Days &gt; 8h:</span> {moreThan8}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <p className="text-zinc-300"><span className="text-white font-semibold">Avg Sleep Time:</span> {formatTime(avgSleepTimeMins)}</p>
          </div>
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <p className="text-zinc-300"><span className="text-white font-semibold">Avg Wake Time:</span> {formatTime(avgWakeTimeMins)}</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={entries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#52525b" />
            <XAxis dataKey="date" stroke="#a1a1aa" />
            <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} stroke="#a1a1aa" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#27272a', 
                border: '1px solid #52525b', 
                borderRadius: '6px',
                color: '#f4f4f5'
              }} 
            />
            <Bar dataKey={(entry) => toMinutes(entry.duration)} fill="#71717a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SleepStats;