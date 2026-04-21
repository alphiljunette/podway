// ─────────────────────────────────────────────────────
// screens/PlayerScreen.js
// ─────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Image, Dimensions, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import { usePlayer } from '../context/PlayerContext';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COVER_SIZE = SCREEN_WIDTH - 64; // pleine largeur moins padding

const WAVE_HEIGHTS = [8, 16, 22, 14, 20, 10, 18, 12];
const SEEK_SECONDS = 15;

const CATEGORY_COLORS = {
  'Tech':       { bg: 'rgba(108,99,255,0.22)', text: '#9b94ff', border: 'rgba(108,99,255,0.4)' },
  'Science':    { bg: 'rgba(0,229,195,0.18)',  text: '#00e5c3', border: 'rgba(0,229,195,0.35)' },
  'Society':    { bg: 'rgba(59,130,246,0.22)', text: '#60a5fa', border: 'rgba(59,130,246,0.4)' },
  'Culture':    { bg: 'rgba(168,85,247,0.22)', text: '#c084fc', border: 'rgba(168,85,247,0.4)' },
  'Business':   { bg: 'rgba(255,181,71,0.22)', text: '#ffb547', border: 'rgba(255,181,71,0.4)' },
  'Health':     { bg: 'rgba(34,197,94,0.22)',  text: '#4ade80', border: 'rgba(34,197,94,0.4)'  },
  'History':    { bg: 'rgba(249,115,22,0.22)', text: '#fb923c', border: 'rgba(249,115,22,0.4)' },
  'Comedy':     { bg: 'rgba(236,72,153,0.22)', text: '#f472b6', border: 'rgba(236,72,153,0.4)' },
  'True Crime': { bg: 'rgba(255,79,110,0.22)', text: '#ff4f6e', border: 'rgba(255,79,110,0.4)' },
  'Sports':     { bg: 'rgba(20,184,166,0.22)', text: '#2dd4bf', border: 'rgba(20,184,166,0.4)' },
  'Education':  { bg: 'rgba(99,102,241,0.22)', text: '#818cf8', border: 'rgba(99,102,241,0.4)' },
};
const DEFAULT_CAT = { bg: 'rgba(136,136,170,0.18)', text: '#8888aa', border: 'rgba(136,136,170,0.35)' };

export default function PlayerScreen({ route, navigation }) {
  const { episode, podcast, playlist: routePlaylist = [], from } = route.params;
  const { getIsDownloaded, getDownloadedUri } = useAppContext();
  const player = usePlayer();
  const [imgError, setImgError] = useState(false);

  const handleBack = () => {
    const currentPod = player.currentPodcast || podcast;
    const isLibraryEpisode =
      from === 'LibraryEpisodes' ||
      (player.currentEpisode && getIsDownloaded(player.currentEpisode.id) && from !== 'Podcast');
    if (isLibraryEpisode) {
      navigation.navigate('LibraryEpisodes', { podcast: currentPod });
    } else {
      navigation.navigate('Podcast', { podcast: currentPod });
    }
  };

  const backLabel = (from === 'LibraryEpisodes') ? 'Library' : 'Podcast';
  const accentIsLibrary = from === 'LibraryEpisodes';
  const waveAnims = useRef(WAVE_HEIGHTS.map(() => new Animated.Value(0.5))).current;

  useEffect(() => {
    const isSameEpisode = player.currentEpisode?.id === episode.id;
    if (!isSameEpisode) {
      player.loadEpisode({
        episode, podcast,
        playlist: routePlaylist.length > 0 ? routePlaylist : [episode],
        getIsDownloaded, getDownloadedUri,
        autoPlay: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.id]);

  useEffect(() => {
    if (player.isPlaying) {
      waveAnims.forEach((anim, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 70),
            Animated.timing(anim, { toValue: 1,    duration: 380, useNativeDriver: true }),
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
  }, [player.isPlaying]);

  const displayEpisode = player.currentEpisode || episode;
  const displayPodcast = player.currentPodcast  || podcast;
  const isDownloaded   = getIsDownloaded(displayEpisode.id);

  // Toujours recalculer depuis displayPodcast pour suivre le podcast courant
  const podIdx      = (Number(displayPodcast.id) - 1) % Colors.covers.length;
  const coverColors = Colors.covers[podIdx % Colors.covers.length];
  const emoji       = Colors.coverEmojis[podIdx % Colors.coverEmojis.length];
  const isFromLibrary = accentIsLibrary;
  const accentColor   = isFromLibrary ? Colors.teal  : Colors.acc;
  const accentDim     = isFromLibrary ? Colors.tealDim : Colors.accDim;
  const accentBorder  = isFromLibrary ? Colors.tealBorder : 'rgba(108,99,255,0.3)';
  const catStyle      = CATEGORY_COLORS[displayPodcast.category] || DEFAULT_CAT;
  const showRealImage = displayPodcast.imageUrl && !imgError;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View style={styles.backWrap}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={[styles.backLabel, { backgroundColor: accentDim, borderColor: accentBorder }]}>
              <Text style={[styles.backLabelText, { color: accentColor }]}>{backLabel}</Text>
            </View>
          </View>
          <View style={styles.nowPlayingWrap}>
            <Text style={styles.nowPlayingCap}>NOW PLAYING</Text>
            <Text style={styles.nowPlayingPod} numberOfLines={1}>{displayPodcast.title}</Text>
          </View>
          <View style={styles.moreBtn}><Text style={styles.moreText}>⋯</Text></View>
        </View>

        {/* COVER — grande image carrée */}
        <View style={styles.coverWrap}>
          {showRealImage ? (
            <Image
              source={{ uri: displayPodcast.imageUrl }}
              style={[styles.cover, { shadowColor: accentColor }]}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <LinearGradient
              colors={coverColors}
              style={[styles.cover, { shadowColor: accentColor }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <Text style={styles.coverEmoji}>{emoji}</Text>
            </LinearGradient>
          )}
        </View>

        {/* TRACK INFO + badges */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={2}>{displayEpisode.title}</Text>
          <Text style={styles.trackSub}>{displayPodcast.title} · {displayPodcast.author}</Text>

          {player.playlist.length > 1 && (
            <Text style={styles.playlistInfo}>
              {player.currentIndex + 1} / {player.playlist.length}
            </Text>
          )}

          {/* Badges: catégorie + streaming/offline + erreur */}
          <View style={styles.badgesRow}>
            {displayPodcast.category && (
              <View style={[styles.catBadge, { backgroundColor: catStyle.bg, borderColor: catStyle.border }]}>
                <Text style={[styles.catBadgeText, { color: catStyle.text }]}>{displayPodcast.category}</Text>
              </View>
            )}
            <View style={styles.badgeTeal}>
              <Text style={styles.badgeTealText}>{isDownloaded ? '⬇ Saved' : '📡 Streaming'}</Text>
            </View>
            {player.isLoading && (
              <View style={styles.badge}><Text style={styles.badgeText}>Loading…</Text></View>
            )}
            {player.error && (
              <View style={styles.badgeRed}><Text style={styles.badgeRedText}>⚠ Error</Text></View>
            )}
          </View>
          {player.error && <Text style={styles.errorText}>{player.error}</Text>}
        </View>

        {/* WAVEFORM */}
        <View style={styles.waveform}>
          {waveAnims.map((anim, i) => (
            <Animated.View key={i} style={[styles.wavebar, {
              height: WAVE_HEIGHTS[i],
              backgroundColor: accentColor,
              transform: [{ scaleY: anim }],
            }]} />
          ))}
        </View>

        {/* PROGRESS BAR */}
        <View style={styles.progressWrap}>
          <TouchableOpacity
            style={styles.progressTrack}
            activeOpacity={0.8}
            onPress={() => {
              if (player.durationMs > 0) player.seekBy(player.durationMs / 1000 * 0.1);
            }}
          >
            <LinearGradient
              colors={isFromLibrary ? [Colors.teal, '#00a896'] : [Colors.acc, Colors.acc2]}
              style={[styles.progressFill, { width: `${Math.min(100, player.progress * 100)}%` }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
          </TouchableOpacity>
          <View style={styles.progressTimes}>
            <Text style={styles.timeText}>{player.fmt(player.positionMs)}</Text>
            <Text style={styles.timeText}>
              {player.fmt(player.durationMs || (displayEpisode.duration || 0) * 60 * 1000)}
            </Text>
          </View>
        </View>

        {/* SPEED */}
        <View style={styles.speedWrap}>
          <TouchableOpacity style={styles.speedChip} onPress={player.cycleSpeed} activeOpacity={0.8}>
            <Text style={styles.speedText}>{player.speeds[player.speedIdx]}× vitesse</Text>
          </TouchableOpacity>
        </View>

        {/* CONTROLS */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.ctrl, !player.hasPrev && styles.ctrlDisabled]}
            onPress={player.playPrev} disabled={player.isLoading} activeOpacity={0.7}
          >
            <Text style={[styles.ctrlIcon, !player.hasPrev && styles.ctrlIconDisabled]}>⏮</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctrl}
            onPress={() => player.seekBy(-SEEK_SECONDS)} disabled={player.isLoading} activeOpacity={0.7}
          >
            <Text style={styles.ctrlSmall}>-{SEEK_SECONDS}s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ctrlPlay,
              { backgroundColor: accentColor, shadowColor: accentColor },
              (player.isLoading || !!player.error) && { opacity: 0.5 },
            ]}
            onPress={player.togglePlayback}
            disabled={player.isLoading || !!player.error}
            activeOpacity={0.85}
          >
            <Text style={styles.ctrlPlayIcon}>
              {player.isLoading ? '…' : (player.isPlaying ? '⏸' : '▶')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctrl}
            onPress={() => player.seekBy(SEEK_SECONDS)} disabled={player.isLoading} activeOpacity={0.7}
          >
            <Text style={styles.ctrlSmall}>+{SEEK_SECONDS}s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ctrl, !player.hasNext && styles.ctrlDisabled]}
            onPress={player.playNext} disabled={player.isLoading} activeOpacity={0.7}
          >
            <Text style={[styles.ctrlIcon, !player.hasNext && styles.ctrlIconDisabled]}>⏭</Text>
          </TouchableOpacity>
        </View>

        {isDownloaded && (
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineBadgeText}>✅ Available offline</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 56, marginBottom: 22 },
  backWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 15, color: Colors.text },
  backLabel: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 100, borderWidth: 1 },
  backLabelText: { fontSize: 9, fontWeight: '700' },
  nowPlayingWrap: { alignItems: 'center', flex: 1, paddingHorizontal: 8 },
  nowPlayingCap: { fontSize: 8, color: Colors.t3, letterSpacing: 1.5, textTransform: 'uppercase' },
  nowPlayingPod: { fontSize: 11, color: Colors.t2, marginTop: 2 },
  moreBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  moreText: { fontSize: 16, color: Colors.text },

  /* Cover grande — COVER_SIZE = largeur écran - 64px de padding */
  coverWrap: { alignItems: 'center', marginBottom: 28 },
  cover: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 36,
    elevation: 20,
    overflow: 'hidden',
  },
  coverEmoji: { fontSize: 90 },

  trackInfo: { alignItems: 'center', marginBottom: 16, gap: 4 },
  trackTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, textAlign: 'center', lineHeight: 24 },
  trackSub: { fontSize: 11, color: Colors.t3 },
  playlistInfo: { fontSize: 10, color: Colors.t3, backgroundColor: Colors.s3, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100, marginTop: 2 },
  badgesRow: { flexDirection: 'row', gap: 7, marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' },
  catBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 100, borderWidth: 1 },
  catBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.4 },
  badgeTeal: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: Colors.tealDim, borderWidth: 1, borderColor: Colors.tealBorder },
  badgeTealText: { fontSize: 9, fontWeight: '700', color: Colors.teal },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: Colors.accDim },
  badgeText: { fontSize: 9, fontWeight: '700', color: Colors.acc },
  badgeRed: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: Colors.redDim },
  badgeRedText: { fontSize: 9, fontWeight: '700', color: Colors.red },
  errorText: { fontSize: 11, color: Colors.red, textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },

  waveform: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, height: 30, marginBottom: 18 },
  wavebar: { width: 4, borderRadius: 4 },

  progressWrap: { marginBottom: 14 },
  progressTrack: { height: 4, backgroundColor: Colors.s4, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressTimes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  timeText: { fontSize: 10, color: Colors.t3 },

  speedWrap: { alignItems: 'center', marginBottom: 20 },
  speedChip: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 100, backgroundColor: Colors.tealDim },
  speedText: { fontSize: 11, fontWeight: '700', color: Colors.teal },

  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  ctrl: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  ctrlDisabled: { opacity: 0.35 },
  ctrlIcon: { fontSize: 14, color: Colors.text },
  ctrlIconDisabled: { color: Colors.t3 },
  ctrlSmall: { fontSize: 10, color: Colors.text, fontWeight: '700' },
  ctrlPlay: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 12 },
  ctrlPlayIcon: { fontSize: 24, color: '#fff' },

  offlineBadge: { alignItems: 'center', marginTop: 14 },
  offlineBadgeText: { fontSize: 10, color: Colors.teal, fontWeight: '600' },
});
