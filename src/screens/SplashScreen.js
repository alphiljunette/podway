import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, StatusBar } from 'react-native';
import Colors from '../constants/colors';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dots = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
  ];

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
    ]).start();

    // Loading dots pulse
    dots.forEach((dot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    });

    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Background glow */}
      <View style={styles.glow} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Logo */}
        <View style={styles.logo}>
          <Text style={styles.logoText}>P</Text>
        </View>

        {/* Brand */}
        <View style={styles.brandWrap}>
          <Text style={styles.brand}>PodWay</Text>
          <Text style={styles.tagline}>Listen. Everywhere. Always.</Text>
        </View>

        {/* Loading dots */}
        <View style={styles.dotsRow}>
          {dots.map((dot, i) => (
            <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
          ))}
        </View>

        <Text style={styles.loadingText}>Checking connection…</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(108,99,255,0.09)',
    top: '20%',
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  logo: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: Colors.acc,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.acc,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  logoText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
  },
  brandWrap: {
    alignItems: 'center',
    gap: 5,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 13,
    color: Colors.t2,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.acc,
  },
  loadingText: {
    fontSize: 11,
    color: Colors.t3,
    marginTop: 4,
  },
});
