import { useState, useEffect } from 'react';
import { Scan, Wifi, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useWebSocketStore } from '../stores/websocketStore';
import QrScanner from 'qr-scanner';

interface ConnectionScreenProps {
  initialData?: { url: string; token: string } | null;
  error?: string | null;
}

export function ConnectionScreen({ initialData, error }: ConnectionScreenProps) {
  const { connect, isConnecting } = useWebSocketStore();
  const [manualUrl, setManualUrl] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (initialData) {
      setManualUrl(initialData.url);
      setManualToken(initialData.token);
    }
  }, [initialData]);

  const handleManualConnect = () => {
    if (manualUrl && manualToken) {
      connect(manualUrl, manualToken);
    }
  };

  const handleScanQR = async () => {
    try {
      setIsScanning(true);
      setScanError(null);

      // Create file input for QR code image
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          setIsScanning(false);
          return;
        }

        try {
          const result = await QrScanner.scanImage(file);
          const data = JSON.parse(result);
          
          if (data.url && data.token) {
            setManualUrl(data.url);
            setManualToken(data.token);
            connect(data.url, data.token);
          } else {
            setScanError('Invalid QR code format');
          }
        } catch (err) {
          setScanError('Failed to scan QR code');
        } finally {
          setIsScanning(false);
        }
      };

      input.click();
    } catch (err) {
      setScanError('Camera not available');
      setIsScanning(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Connect to VSCode
          </CardTitle>
          <CardDescription>
            Scan the QR code in VSCode or enter connection details manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error || scanError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || scanError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button
              onClick={handleScanQR}
              disabled={isScanning || isConnecting}
              className="w-full"
              size="lg"
            >
              <Scan className="w-4 h-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Scan QR Code'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or connect manually
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="WebSocket URL (e.g., ws://192.168.1.100:50443)"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              disabled={isConnecting}
            />
            <Input
              placeholder="Authentication Token"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              disabled={isConnecting}
              type="password"
            />
            <Button
              onClick={handleManualConnect}
              disabled={!manualUrl || !manualToken || isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Make sure your device is on the same network as your computer
          </div>
        </CardContent>
      </Card>
    </div>
  );
}