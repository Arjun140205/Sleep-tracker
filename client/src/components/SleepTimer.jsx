import { useState, useEffect } from 'react';
import { HiPlay, HiStop, HiClock } from 'react-icons/hi2';
import { formatTimeStr } from '../utils/timeUtils';

const SleepTimer = ({ onSleepComplete }) => {
    const [isSleeping, setIsSleeping] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);

    // Load state from local storage on mount
    useEffect(() => {
        const savedStart = localStorage.getItem('sleepStartTime');
        if (savedStart) {
            const start = new Date(parseInt(savedStart));
            setStartTime(start);
            setIsSleeping(true);
        }
    }, []);

    // Update timer
    useEffect(() => {
        let interval;
        if (isSleeping && startTime) {
            interval = setInterval(() => {
                setElapsed(Date.now() - startTime.getTime());
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSleeping, startTime]);

    const toggleSleep = () => {
        if (!isSleeping) {
            // Start Sleeping
            const now = new Date();
            setStartTime(now);
            setIsSleeping(true);
            localStorage.setItem('sleepStartTime', now.getTime().toString());
        } else {
            // Wake Up
            const endTime = new Date();
            const sleepStr = formatTimeStr(startTime);
            const wakeStr = formatTimeStr(endTime);

            // Calculate basic duration for preview or auto-fill
            // Remove from storage
            localStorage.removeItem('sleepStartTime');
            setIsSleeping(false);
            setStartTime(null);
            setElapsed(0);

            // Trigger completion callback
            if (onSleepComplete) {
                onSleepComplete(sleepStr, wakeStr, new Date());
            }
        }
    };

    const formatElapsed = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`p-6 rounded-lg border transition-all duration-300 ${isSleeping ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-zinc-900/50 border-zinc-800'}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {isSleeping ? (
                        <>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                            Sleep Session Active
                        </>
                    ) : (
                        <>
                            <HiClock className="text-zinc-400" />
                            Real-time Tracker
                        </>
                    )}
                </h3>
                {isSleeping && (
                    <div className="text-blue-400 font-mono text-xl font-bold tabular-nums">
                        {formatElapsed(elapsed)}
                    </div>
                )}
            </div>

            <p className="text-zinc-400 text-sm mb-6">
                {isSleeping
                    ? `Started at ${startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}. restful sleep in progress...`
                    : "Ready for bed? Start the timer to track your sleep accurately without manual entry."
                }
            </p>

            <button
                onClick={toggleSleep}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isSleeping
                        ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                    }`}
            >
                {isSleeping ? (
                    <>
                        <HiStop className="text-xl" />
                        I'm Awake
                    </>
                ) : (
                    <>
                        <HiPlay className="text-xl" />
                        Start Sleeping
                    </>
                )}
            </button>
        </div>
    );
};

export default SleepTimer;
