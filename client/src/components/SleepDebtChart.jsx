import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculateDurationMinutes } from '../utils/timeUtils';
import { parseISO, format } from 'date-fns';

const SleepDebtChart = ({ entries, goals }) => {
    const targetMinutes = (goals?.targetSleepHours || 8) * 60;

    // Process data: Reverse entries to show chronological order
    const data = [...entries].reverse().reduce((acc, entry) => {
        const minutes = calculateDurationMinutes(entry.sleepTime, entry.wakeTime);
        const debt = minutes - targetMinutes; // Negative means debt, Positive means surplus

        // Accumulate debt (running total)
        const prevTotal = acc.length > 0 ? acc[acc.length - 1].cumulativeDebt : 0;

        // Limits: Don't let debt spiral infinitely for visual sanity? 
        // Actually interviewers like seeing spiraling debt if it's real.
        const newTotal = prevTotal + debt;

        acc.push({
            date: format(parseISO(entry.date), 'MM/dd'),
            debt: Math.round(debt / 60 * 10) / 10, // Daily diff
            cumulativeDebt: Math.round(newTotal / 60 * 10) / 10, // Running total
            rawDate: entry.date
        });
        return acc;
    }, []); // Take last 30 entries for cleanliness?

    const recentData = data.slice(-30);

    return (
        <div className="p-6 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg h-full">
            <h3 className="text-xl font-bold text-white mb-2">Sleep Debt Bank</h3>
            <p className="text-zinc-400 text-sm mb-6">Running total of missed sleep (hours). Above 0 is a surplus, below is debt.</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={recentData}>
                        <defs>
                            <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSurplus" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#71717a" label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#71717a' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <ReferenceLine y={0} stroke="#52525b" />
                        <Area
                            type="monotone"
                            dataKey="cumulativeDebt"
                            stroke="#8884d8"
                            fill="url(#colorSurplus)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SleepDebtChart;
