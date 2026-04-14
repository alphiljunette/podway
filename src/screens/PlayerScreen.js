<<<<<<< HEAD
// ─────────────────────────────────────────────────────
// screens/PlayerScreen.js
// Lecteur connecté au PlayerContext global
// ─────────────────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
=======
import React, { useState, useRef, useEffect } from 'react';
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
<<<<<<< HEAD
import { usePlayer } from '../context/PlayerContext';
import { useAppContext } from '../context/AppContext';

const WAVE_HEIGHTS = [8, 16, 22, 14, 20, 10, 18, 12];
const SEEK_SECONDS = 15;

export default function PlayerScreen({ route, navigation }) {
  const { episode, podcast, playlist: routePlaylist = [], from } = route.params;
  const { getIsDownloaded, getDownloadedUri } = useAppContext();
  const player = usePlayer();

  // Le bouton retour pointe toujours vers la liste des épisodes du podcast EN COURS,
  // peu importe le chemin d'entrée (MiniPlayer, Library, Podcast…)
  const handleBack = () => {
    const currentPod = player.currentPodcast || podcast;
    // Si l'épisode vient de la librairie (téléchargé), retour vers LibraryEpisodes
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

  // ── Charger l'épisode si différent de celui en cours ──
  useEffect(() => {
    const isSameEpisode = player.currentEpisode?.id === episode.id;
    if (!isSameEpisode) {
      player.loadEpisode({
        episode,
        podcast,
        playlist: routePlaylist.length > 0 ? routePlaylist : [episode],
        getIsDownloaded,
        getDownloadedUri,
        autoPlay: true,
      });
    }
  // On ne réexécute que si l'id de l'épisode change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.id]);

  // ── Animation waveform ────────────────────────────
  useEffect(() => {
    if (player.isPlaying) {
=======

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
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
      waveAnims.forEach((anim, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 70),
<<<<<<< HEAD
            Animated.timing(anim, { toValue: 1,    duration: 380, useNativeDriver: true }),
=======
            Animated.timing(anim, { toValue: 1, duration: 380, useNativeDriver: true }),
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
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
<<<<<<< HEAD
  }, [player.isPlaying]);

  // ── Dériver les infos visuelles depuis le contexte ──
  const displayEpisode = player.currentEpisode || episode;
  const displayPodcast = player.currentPodcast  || podcast;
  const isDownloaded   = getIsDownloaded(displayEpisode.id);

  const podIdx      = (Number(displayPodcast.id) - 1) % Colors.covers.length;
  const coverColors = Colors.covers[podIdx % Colors.covers.length];
  const emoji       = Colors.coverEmojis[podIdx % Colors.coverEmojis.length];
  const isFromLibrary = accentIsLibrary;

  const accentColor  = isFromLibrary ? Colors.teal    : Colors.acc;
  const accentDim    = isFromLibrary ? Colors.tealDim : Colors.accDim;
  const accentBorder = isFromLibrary ? Colors.tealBorder : 'rgba(108,99,255,0.3)';

  // ── Render ────────────────────────────────────────
=======
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

>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

<<<<<<< HEAD
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.backWrap}>
          <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.8}
        >
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

      {/* COVER */}
      <View style={styles.coverWrap}>
        <LinearGradient
          colors={coverColors}
          style={[styles.cover, isFromLibrary && { shadowColor: Colors.teal }]}
=======
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
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <Text style={styles.coverEmoji}>{emoji}</Text>
        </LinearGradient>
      </View>

<<<<<<< HEAD
      {/* TRACK INFO */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={2}>{displayEpisode.title}</Text>
        <Text style={styles.trackSub}>{displayPodcast.title} · {displayPodcast.author}</Text>

        {/* Indicateur playlist */}
        {player.playlist.length > 1 && (
          <Text style={styles.playlistInfo}>
            {player.currentIndex + 1} / {player.playlist.length}
          </Text>
        )}

        <View style={styles.badgesRow}>
          <View style={styles.badgeTeal}>
            <Text style={styles.badgeTealText}>{isDownloaded ? '⬇ Téléchargé' : '📡 Streaming'}</Text>
          </View>
          {player.isLoading && (
            <View style={styles.badge}><Text style={styles.badgeText}>Chargement…</Text></View>
          )}
          {player.error && (
            <View style={styles.badgeRed}><Text style={styles.badgeRedText}>⚠ Erreur</Text></View>
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
          onPress={(e) => {
            // Seek en appuyant sur la barre
            if (player.durationMs > 0) {
              // Approximatif — pour un seek précis il faudrait mesurer la largeur
              // On utilise simplement le tap comme toggle 10%
              player.seekBy(player.durationMs / 1000 * 0.1);
            }
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

        {/* ⏮ Épisode précédent */}
        <TouchableOpacity
          style={[styles.ctrl, !player.hasPrev && styles.ctrlDisabled]}
          onPress={player.playPrev}
          disabled={player.isLoading}
          activeOpacity={0.7}
        >
          <Text style={[styles.ctrlIcon, !player.hasPrev && styles.ctrlIconDisabled]}>⏮</Text>
        </TouchableOpacity>

        {/* -15s */}
        <TouchableOpacity
          style={styles.ctrl}
          onPress={() => player.seekBy(-SEEK_SECONDS)}
          disabled={player.isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.ctrlSmall}>-{SEEK_SECONDS}s</Text>
        </TouchableOpacity>

        {/* ▶ / ⏸ Play/Pause */}
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

        {/* +15s */}
        <TouchableOpacity
          style={styles.ctrl}
          onPress={() => player.seekBy(SEEK_SECONDS)}
          disabled={player.isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.ctrlSmall}>+{SEEK_SECONDS}s</Text>
        </TouchableOpacity>

        {/* ⏭ Épisode suivant */}
        <TouchableOpacity
          style={[styles.ctrl, !player.hasNext && styles.ctrlDisabled]}
          onPress={player.playNext}
          disabled={player.isLoading}
          activeOpacity={0.7}
        >
          <Text style={[styles.ctrlIcon, !player.hasNext && styles.ctrlIconDisabled]}>⏭</Text>
        </TouchableOpacity>

      </View>

      {/* Mini note offline si téléchargé */}
      {isDownloaded && (
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineBadgeText}>✅ Disponible hors ligne</Text>
        </View>
      )}

=======
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

>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
      <View style={{ height: 36 }} />
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: 20 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 56, marginBottom: 22 },
  backWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 15, color: Colors.text },
  backLabel: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 100, borderWidth: 1 },
=======
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
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  backLabelText: { fontSize: 9, fontWeight: '700' },
  nowPlayingWrap: { alignItems: 'center', flex: 1, paddingHorizontal: 8 },
  nowPlayingCap: { fontSize: 8, color: Colors.t3, letterSpacing: 1.5, textTransform: 'uppercase' },
  nowPlayingPod: { fontSize: 11, color: Colors.t2, marginTop: 2 },
<<<<<<< HEAD
  moreBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  moreText: { fontSize: 16, color: Colors.text },

  coverWrap: { alignItems: 'center', marginBottom: 24 },
  cover: { width: 170, height: 170, borderRadius: 26, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.acc, shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.3, shadowRadius: 28, elevation: 14 },
  coverEmoji: { fontSize: 68 },

  trackInfo: { alignItems: 'center', marginBottom: 16, gap: 4 },
  trackTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, textAlign: 'center', lineHeight: 22 },
  trackSub: { fontSize: 11, color: Colors.t3 },
  playlistInfo: { fontSize: 10, color: Colors.t3, backgroundColor: Colors.s3, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100, marginTop: 2 },
  badgesRow: { flexDirection: 'row', gap: 7, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' },
=======
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
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  badgeTeal: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: Colors.tealDim },
  badgeTealText: { fontSize: 9, fontWeight: '700', color: Colors.teal },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: Colors.accDim },
  badgeText: { fontSize: 9, fontWeight: '700', color: Colors.acc },
  badgeRed: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: Colors.redDim },
  badgeRedText: { fontSize: 9, fontWeight: '700', color: Colors.red },
<<<<<<< HEAD
  errorText: { fontSize: 11, color: Colors.red, textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },

  waveform: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, height: 30, marginBottom: 18 },
  wavebar: { width: 4, borderRadius: 4 },

  progressWrap: { marginBottom: 14 },
  progressTrack: { height: 4, backgroundColor: Colors.s4, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
=======

  waveform: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, height: 30, marginBottom: 18,
  },
  wavebar: { width: 4, borderRadius: 4 },

  progressWrap: { marginBottom: 14 },
  progressTrack: { height: 3, backgroundColor: Colors.s4, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  progressTimes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  timeText: { fontSize: 10, color: Colors.t3 },

  speedWrap: { alignItems: 'center', marginBottom: 20 },
<<<<<<< HEAD
  speedChip: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 100, backgroundColor: Colors.tealDim },
  speedText: { fontSize: 11, fontWeight: '700', color: Colors.teal },

  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  ctrl: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  ctrlDisabled: { opacity: 0.35 },
  ctrlIcon: { fontSize: 14, color: Colors.text },
  ctrlIconDisabled: { color: Colors.t3 },
  ctrlSmall: { fontSize: 10, color: Colors.text, fontWeight: '700' },
  ctrlPlay: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  ctrlPlayIcon: { fontSize: 22, color: '#fff' },

  offlineBadge: { alignItems: 'center', marginTop: 14 },
  offlineBadgeText: { fontSize: 10, color: Colors.teal, fontWeight: '600' },
=======
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
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
});
