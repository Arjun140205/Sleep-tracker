import { Tooltip as ReactTooltip } from 'recharts'; // using recharts tooltip style logic manually or simple title
import { format, subDays, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { calculateDurationMinutes } from '../utils/timeUtils';

const SleepHeatmap = ({ entries, goals }) => {
    // Generate last 365 days (or fewer for mobile)
    const today = new Date();
    const startDate = subDays(today, 364); // ~1 year

    const days = eachDayOfInterval({ start: startDate, end: today });

    // Create a map for fast lookup
    const entryMap = new Map();
    entries.forEach(entry => {
        // entry.date is YYYY-MM-DD
        entryMap.set(entry.date, entry);
    });

    const getIntensity = (day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const entry = entryMap.get(dateStr);

        if (!entry) return 'bg-zinc-800/50'; // No data

        const minutes = calculateDurationMinutes(entry.sleepTime, entry.wakeTime);
        const targetMinutes = (goals?.targetSleepHours || 8) * 60;

        // Logic: 
        // > 100% target = Dark Green
        // > 85% target = Green
        // > 70% target = Yellow/Orange
        // < 70% target = Red

        const ratio = minutes / targetMinutes;

        if (ratio >= 1.0) return 'bg-emerald-500';
        if (ratio >= 0.85) return 'bg-emerald-500/60';
        if (ratio >= 0.70) return 'bg-amber-500/80';
        return 'bg-red-500/80';
    };

    const getTooltip = (day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const entry = entryMap.get(dateStr);
        if (!entry) return `${format(day, 'MMM d')}: No Record`;
        return `${format(day, 'MMM d')}: ${entry.duration}`;
    };

    return (
        <div className="p-6 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Sleep Consistency</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-zinc-800/50"></div>
                        <div className="w-3 h-3 rounded-sm bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-sm bg-amber-500/80"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-500/60"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            {/* Grid Container - Flex wrap for responsive density */}
            <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all hover:scale-125 cursor-help ${getIntensity(day)}`}
                        title={getTooltip(day)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default SleepHeatmap;
