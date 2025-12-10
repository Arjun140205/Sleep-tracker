import { useState, useEffect } from 'react';
import { HiClock } from 'react-icons/hi2';

const DigitalClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatWithSeconds = (date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const getDayDate = (date) => {
        return date.toLocaleDateString([], {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
                <HiClock className="text-zinc-400" />
                <span className="text-zinc-400 text-sm tracking-widest uppercase">Current Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white tabular-nums tracking-tight">
                {formatWithSeconds(time)}
            </div>
            <div className="text-zinc-500 mt-2 font-medium">
                {getDayDate(time)}
            </div>
        </div>
    );
};

export default DigitalClock;
