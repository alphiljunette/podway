import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import LibraryScreen from '../screens/LibraryScreen';
import LibraryEpisodesScreen from '../screens/LibraryEpisodesScreen';
import PodcastScreen from '../screens/PodcastScreen';
import PlayerScreen from '../screens/PlayerScreen';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../context/PlayerContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const navigationRef = createNavigationContainerRef();

// Bottom tabs — hidden tab bar (custom BottomNav used inside each screen)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const player = usePlayer();
  const [currentRoute, setCurrentRoute] = useState('Splash');
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(true);
  const routeNameRef = useRef('Splash');
  const lastEpisodeIdRef = useRef(null);

  // Réafficher le MiniPlayer quand un nouvel épisode est joué
  useEffect(() => {
    if (player.currentEpisode?.id && lastEpisodeIdRef.current !== player.currentEpisode.id) {
      lastEpisodeIdRef.current = player.currentEpisode.id;
      setMiniPlayerVisible(true);
    }
  }, [player.currentEpisode?.id]);

  return (
    <View style={styles.app}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          const route = navigationRef.getCurrentRoute();
          if (route?.name) {
            routeNameRef.current = route.name;
            setCurrentRoute(route.name);
          }
        }}
        onStateChange={() => {
          const route = navigationRef.getCurrentRoute();
          if (route?.name) {
            routeNameRef.current = route.name;
            setCurrentRoute(route.name);
          }
        }}
      >
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#080810' },
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />

          {/* Main tab screens */}
          <Stack.Screen name="Main" component={MainTabs} />

          {/* Detail screens */}
          <Stack.Screen
            name="Podcast"
            component={PodcastScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="LibraryEpisodes"
            component={LibraryEpisodesScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Player"
            component={PlayerScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {player.currentEpisode && currentRoute !== 'Player' && currentRoute !== 'Splash' && miniPlayerVisible && (
        <MiniPlayer
          style={styles.miniOverlay}
          onOpen={() => {
            setMiniPlayerVisible(true);
            if (!navigationRef.isReady()) return;
            // Détecter si l'épisode courant vient de la librairie
            const ep = player.currentEpisode;
            const pod = player.currentPodcast;
            navigationRef.navigate('Player', {
              episode: ep,
              podcast: pod,
              playlist: player.playlist,
              // On passe 'Podcast' par défaut — PlayerScreen calcule lui-même
              // la destination retour selon le contexte
              from: 'Podcast',
            });
          }}
          onClose={() => setMiniPlayerVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1 },
  miniOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 20,
    zIndex: 100,
  },
});
