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
    <div className="bg-white mt-6 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">📊 Sleep Summary</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <p><strong>Average Duration:</strong> {avgHrs}h {avgMins}m</p>
          <p><strong>Days &lt; 6h:</strong> {lessThan6}</p>
          <p><strong>Days &gt; 8h:</strong> {moreThan8}</p>
        </div>
        <div>
          <p><strong>Avg Sleep Time:</strong> {formatTime(avgSleepTimeMins)}</p>
          <p><strong>Avg Wake Time:</strong> {formatTime(avgWakeTimeMins)}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={entries}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey={(entry) => toMinutes(entry.duration)} fill="#4299e1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepStats;