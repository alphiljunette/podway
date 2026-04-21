import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { PlayerProvider, usePlayer } from './src/context/PlayerContext';

// Pont entre AppContext et PlayerContext :
// enregistre stopIfEpisodeDeleted dans AppContext dès le montage
function ContextBridge({ children }) {
  const { registerOnEpisodeDeleted } = useAppContext();
  const { stopIfEpisodeDeleted } = usePlayer();

  useEffect(() => {
    registerOnEpisodeDeleted(stopIfEpisodeDeleted);
  }, [registerOnEpisodeDeleted, stopIfEpisodeDeleted]);

  return children;
}

export default function App() {
  return (
    <AppProvider>
      <PlayerProvider>
        <ContextBridge>
          <StatusBar style="light" />
          <AppNavigator />
        </ContextBridge>
      </PlayerProvider>
    </AppProvider>
  );
}
