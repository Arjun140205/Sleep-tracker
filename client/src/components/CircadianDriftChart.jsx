import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { parse, getHours, getMinutes, parseISO, format } from 'date-fns';

const CircadianDriftChart = ({ entries }) => {
    // We want to plot two points for every date: Sleep Time and Wake Time.
    // Y-Axis: Time of day (0 - 24).
    // Problem: 23:00 is "high" and 01:00 is "low", looking disjointed.
    // Trick: Map 00:00-12:00 to 24-36. 
    // Wait, simpler: Center the night. Noon is 0. Midnight is 12. Noon next day is 24.
    // Let's stick to standard 0-24h for simple interviewing explanations, or just raw hours.

    const data = entries.slice(0, 30).map(entry => {
        // entry.date is YYYY-MM-DD
        const dateNum = new Date(entry.date).getTime();

        const getDecimalHour = (timeStr) => {
            const d = parse(timeStr, 'HH:mm', new Date());
            return getHours(d) + getMinutes(d) / 60;
        };

        let sleepY = getDecimalHour(entry.sleepTime);
        let wakeY = getDecimalHour(entry.wakeTime);

        // Adjust for better visualization (Drift Plot usually puts sleep near top, wake near bottom or vice versa)
        // If we want Night in the middle, we can map Noon (12) -> 0, Midnight (24) -> 12, Noon(12) -> 24.
        // Let's just do standard 0-24. 

        return {
            date: format(parseISO(entry.date), 'MM/dd'),
            sleepTime: sleepY, // e.g. 23.5
            wakeTime: wakeY,   // e.g. 7.5
            rawDate: entry.date,
            displaySleep: entry.sleepTime,
            displayWake: entry.wakeTime
        };
    }).reverse(); // Chronological

    return (
        <div className="p-6 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg h-full">
            <h3 className="text-xl font-bold text-white mb-2">Circadian Drift</h3>
            <p className="text-zinc-400 text-sm mb-6">Visualizing your sleep/wake timings. Look for "drifting" patterns.</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" type="category" stroke="#71717a" interval={2} />
                        <YAxis
                            type="number"
                            domain={[0, 24]}
                            stroke="#71717a"
                            unit="h"
                            ticks={[0, 6, 12, 18, 24]}
                            reversed={true} // 0 (midnight/morning) at top? No usually 0 is midnight. 
                        // Let's keep 0 at bottom. 12 noon middle. 24 midnight top.
                        />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-zinc-900 border border-zinc-700 p-2 rounded text-white text-sm">
                                            <p className="font-bold">{data.date}</p>
                                            <p className="text-blue-400">Sleep: {data.displaySleep}</p>
                                            <p className="text-amber-400">Wake: {data.displayWake}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Scatter name="Sleep Onset" data={data} fill="#60a5fa" line shape="circle" dataKey="sleepTime" />
                        <Scatter name="Wake Up" data={data} fill="#fbbf24" line shape="square" dataKey="wakeTime" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CircadianDriftChart;
