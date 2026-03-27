import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

// Hook — use anywhere to get connection state
export function useNetwork() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Initial check
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? true);
    });

    // Subscribe to changes
    const unsub = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsub();
  }, []);

  return { isConnected };
}
