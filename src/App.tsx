import { useEffect, useState } from 'react';
import { ConnectionScreen } from './components/ConnectionScreen';
import { TerminalScreen } from './components/TerminalScreen';
import { useWebSocketStore } from './stores/websocketStore';
import { Toaster } from './components/ui/toaster';

function App() {
  const { isConnected, connect, connectionError } = useWebSocketStore();
  const [connectionData, setConnectionData] = useState<{ url: string; token: string } | null>(null);

  useEffect(() => {
    // Check if connection data is in URL parameters (from QR code)
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    const token = params.get('token');

    if (url && token) {
      setConnectionData({ url, token });
      // Auto-connect if we have the data
      connect(url, token);
    }

    // Also check if data is in hash (alternative method)
    if (window.location.hash) {
      try {
        const data = JSON.parse(decodeURIComponent(window.location.hash.substring(1)));
        if (data.url && data.token) {
          setConnectionData(data);
          connect(data.url, data.token);
        }
      } catch (error) {
        console.error('Failed to parse connection data from hash:', error);
      }
    }
  }, [connect]);

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      {isConnected ? (
        <TerminalScreen />
      ) : (
        <ConnectionScreen 
          initialData={connectionData}
          error={connectionError}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;