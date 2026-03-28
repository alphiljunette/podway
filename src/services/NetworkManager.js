
// Hook React compatible Expo 51 + @react-native-community/netinfo

import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetwork() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Vérification initiale
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? true);
    });

    // Écoute les changements réseau en temps réel
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected };
}