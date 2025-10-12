import { useState, useEffect } from "react";

const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Override console.log to capture performance logs
    const originalLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('ms') || message.includes('🔐') || message.includes('📡')) {
        setLogs(prev => [...prev.slice(-9), {
          timestamp: new Date().toLocaleTimeString(),
          message: message
        }]);
      }
      originalLog(...args);
    };

    // Keyboard shortcut to toggle monitor (Ctrl+Shift+P)
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      console.log = originalLog;
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
          title="Performance Monitor (Ctrl+Shift+P)"
        >
          📊 Perf
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black text-green-400 p-4 rounded-lg shadow-lg max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-gray-500">No performance logs yet...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex">
              <span className="text-gray-500 mr-2">{log.timestamp}</span>
              <span className="flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-500">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;