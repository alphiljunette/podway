import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const WAVE_HEIGHTS = [8, 16, 22, 14, 20, 10, 18, 12];

export default function PlayerScreen({ route, navigation }) {
  const { episode, podcast, from } = route.params;
  // from: 'PodcastScreen' | 'LibraryEpisodes'

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.38);
  const [speedIdx, setSpeedIdx] = useState(2);

  const waveAnims = useRef(WAVE_HEIGHTS.map(() => new Animated.Value(0.5))).current;
  const podIdx = (podcast.id - 1) % Colors.covers.length;
  const coverColors = Colors.covers[podIdx];
  const emoji = Colors.coverEmojis[podIdx];

  const totalSec = episode.duration * 60;
  const currentSec = Math.floor(progress * totalSec);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Waveform animation
  useEffect(() => {
    if (isPlaying) {
      waveAnims.forEach((anim, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 70),
            Animated.timing(anim, { toValue: 1, duration: 380, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.15, duration: 380, useNativeDriver: true }),
          ])
        ).start();
      });
    } else {
      waveAnims.forEach(anim => {
        anim.stopAnimation();
        Animated.timing(anim, { toValue: 0.5, duration: 200, useNativeDriver: true }).start();
      });
    }
  }, [isPlaying]);

  // Contextual back: go back to wherever we came from
  const handleBack = () => {
    navigation.goBack();
    // goBack() automatically returns to the correct screen
    // because React Navigation keeps the stack
  };

  // Label shown next to back button
  const backLabel = from === 'LibraryEpisodes' ? 'Library' : 'Podcast Page';
  const backLabelColor = from === 'LibraryEpisodes' ? Colors.teal : Colors.acc;
  const backLabelBg = from === 'LibraryEpisodes' ? Colors.tealDim : Colors.accDim;
  const backLabelBorder = from === 'LibraryEpisodes' ? Colors.tealBorder : 'rgba(108,99,255,0.3)';

  const isFromLibrary = from === 'LibraryEpisodes';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        {/* Back button with contextual label */}
        <View style={styles.backWrap}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={[styles.backLabel, { backgroundColor: backLabelBg, borderColor: backLabelBorder }]}>
            <Text style={[styles.backLabelText, { color: backLabelColor }]}>{backLabel}</Text>
          </View>
        </View>

        <View style={styles.nowPlayingWrap}>
          <Text style={styles.nowPlayingCap}>NOW PLAYING</Text>
          <Text style={styles.nowPlayingPod} numberOfLines={1}>{podcast.title}</Text>
        </View>

        <View style={styles.moreBtn}>
          <Text style={styles.moreText}>⋯</Text>
        </View>
      </View>

      {/* ── COVER ── */}
      <View style={styles.coverWrap}>
        <LinearGradient
          colors={coverColors}
          style={[styles.cover, isFromLibrary && styles.coverLibrary]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <Text style={styles.coverEmoji}>{emoji}</Text>
        </LinearGradient>
      </View>

      {/* ── TRACK INFO ── */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={2}>{episode.title}</Text>
        <Text style={styles.trackSub}>{podcast.title} · {podcast.author}</Text>
        <View style={styles.badgesRow}>
          <View style={styles.badgeTeal}>
            <Text style={styles.badgeTealText}>Downloaded ✓</Text>
          </View>
          {isFromLibrary && (
            <View style={styles.badgeRed}>
              <Text style={styles.badgeRedText}>Offline mode</Text>
            </View>
          )}
          {!isFromLibrary && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Offline ready</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── WAVEFORM ── */}
      <View style={styles.waveform}>
        {waveAnims.map((anim, i) => {
          const isPast = i >= 4;
          return (
            <Animated.View
              key={i}
              style={[
                styles.wavebar,
                {
                  height: WAVE_HEIGHTS[i],
                  backgroundColor: isPast ? Colors.t3 : (isFromLibrary ? Colors.teal : Colors.acc),
                  transform: [{ scaleY: anim }],
                },
              ]}
            />
          );
        })}
      </View>

      {/* ── PROGRESS ── */}
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={isFromLibrary ? [Colors.teal, '#00a896'] : [Colors.acc, Colors.acc2]}
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          />
        </View>
        <View style={styles.progressTimes}>
          <Text style={styles.timeText}>{fmt(currentSec)}</Text>
          <Text style={styles.timeText}>{fmt(totalSec)}</Text>
        </View>
      </View>

      {/* ── SPEED ── */}
      <View style={styles.speedWrap}>
        <TouchableOpacity
          style={styles.speedChip}
          onPress={() => setSpeedIdx(p => (p + 1) % SPEEDS.length)}
          activeOpacity={0.8}
        >
          <Text style={styles.speedText}>{SPEEDS[speedIdx]}× speed</Text>
        </TouchableOpacity>
      </View>

      {/* ── CONTROLS ── */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrl} onPress={() => setProgress(0)}>
          <Text style={styles.ctrlIcon}>⏮</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrl} onPress={() => setProgress(p => Math.max(0, p - 0.05))}>
          <Text style={styles.ctrlIcon}>⏪</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctrlPlay, isFromLibrary && { backgroundColor: Colors.teal, shadowColor: Colors.teal }]}
          onPress={() => setIsPlaying(p => !p)}
          activeOpacity={0.85}
        >
          <Text style={styles.ctrlPlayIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrl} onPress={() => setProgress(p => Math.min(1, p + 0.05))}>
          <Text style={styles.ctrlIcon}>⏩</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrl} onPress={() => setProgress(1)}>
          <Text style={styles.ctrlIcon}>⏭</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 36 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.bg,
    paddingHorizontal: 20,
  },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 56, marginBottom: 22,
  },
  backWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 15, color: Colors.text },
  backLabel: {
    paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: 100, borderWidth: 1,
  },
  backLabelText: { fontSize: 9, fontWeight: '700' },
  nowPlayingWrap: { alignItems: 'center', flex: 1, paddingHorizontal: 8 },
  nowPlayingCap: { fontSize: 8, color: Colors.t3, letterSpacing: 1.5, textTransform: 'uppercase' },
  nowPlayingPod: { fontSize: 11, color: Colors.t2, marginTop: 2 },
  moreBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  moreText: { fontSize: 16, color: Colors.text },

  coverWrap: { alignItems: 'center', marginBottom: 24 },
  cover: {
    width: 170, height: 170, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.acc, shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.3, shadowRadius: 28, elevation: 14,
  },
  coverLibrary: {
    shadowColor: Colors.teal,
  },
  coverEmoji: { fontSize: 68 },

  trackInfo: { alignItems: 'center', marginBottom: 18, gap: 5 },
  trackTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, textAlign: 'center', lineHeight: 22 },
  trackSub: { fontSize: 11, color: Colors.t3 },
  badgesRow: { flexDirection: 'row', gap: 7, marginTop: 4 },
  badgeTeal: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: Colors.tealDim },
  badgeTealText: { fontSize: 9, fontWeight: '700', color: Colors.teal },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: Colors.accDim },
  badgeText: { fontSize: 9, fontWeight: '700', color: Colors.acc },
  badgeRed: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: Colors.redDim },
  badgeRedText: { fontSize: 9, fontWeight: '700', color: Colors.red },

  waveform: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, height: 30, marginBottom: 18,
  },
  wavebar: { width: 4, borderRadius: 4 },

  progressWrap: { marginBottom: 14 },
  progressTrack: { height: 3, backgroundColor: Colors.s4, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressTimes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  timeText: { fontSize: 10, color: Colors.t3 },

  speedWrap: { alignItems: 'center', marginBottom: 20 },
  speedChip: {
    paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 100, backgroundColor: Colors.tealDim,
  },
  speedText: { fontSize: 11, fontWeight: '700', color: Colors.teal },

  controls: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 14,
  },
  ctrl: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  ctrlIcon: { fontSize: 14, color: Colors.text },
  ctrlPlay: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.acc,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.acc, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },
  ctrlPlayIcon: { fontSize: 22, color: '#fff' },
});
