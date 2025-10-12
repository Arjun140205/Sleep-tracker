import { useState, useEffect } from "react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check server connectivity
    const checkServerStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('http://localhost:5001/api/health', {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setServerStatus('connected');
        } else {
          setServerStatus('error');
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          setServerStatus('disconnected');
        } else {
          setServerStatus('disconnected');
        }
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && serverStatus === 'connected') {
    return null; // Don't show anything when everything is working
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isOnline && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center">
            <span className="mr-2">🔴</span>
            <span className="text-sm font-medium">No Internet Connection</span>
          </div>
          <p className="text-xs mt-1">App will sync when connection is restored</p>
        </div>
      )}

      {isOnline && serverStatus === 'disconnected' && (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <span className="text-sm font-medium">Server Disconnected</span>
          </div>
          <p className="text-xs mt-1">Check if the server is running on port 5001</p>
        </div>
      )}

      {isOnline && serverStatus === 'error' && (
        <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center">
            <span className="mr-2">🔶</span>
            <span className="text-sm font-medium">Server Error</span>
          </div>
          <p className="text-xs mt-1">Server is running but experiencing issues</p>
        </div>
      )}

      {serverStatus === 'checking' && (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center">
            <span className="mr-2">🔄</span>
            <span className="text-sm font-medium">Checking Connection...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;