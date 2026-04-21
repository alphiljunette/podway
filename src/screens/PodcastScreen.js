// ─────────────────────────────────────────────────────
// screens/PodcastScreen.js
// ─────────────────────────────────────────────────────
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Alert, Animated,
  Image, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import Colors from '../constants/colors';
import EpisodeItem from '../components/EpisodeItem';
import { useNetwork } from '../services/NetworkManagerHook';
import { useAppContext } from '../context/AppContext';
import PodcastSearchService from '../services/PodcastSearchService';
import { episodes as mockEpisodes } from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COVER_HEIGHT = Math.round(SCREEN_WIDTH * 0.72);

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

export default function PodcastScreen({ route, navigation }) {
  const { podcast } = route.params;
  const { isConnected } = useNetwork();
  const { getIsDownloaded, getDownloadStatus, getDownloadedUri, downloadEpisode } = useAppContext();

  const [episodes, setEpisodes]                   = useState([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(true);
  const [imgError, setImgError]                   = useState(false);

  const [isDownloadingAll, setIsDownloadingAll]       = useState(false);
  const [downloadAllProgress, setDownloadAllProgress] = useState(0);
  const [downloadAllCurrent, setDownloadAllCurrent]   = useState(0);
  const [downloadAllTotal, setDownloadAllTotal]       = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cancelRef    = useRef(false);

  const isMockPodcast = typeof podcast.id === 'number' && podcast.id <= 6;

  useEffect(() => { loadEpisodes(); }, [podcast.id]);

  const loadEpisodes = async () => {
    setIsLoadingEpisodes(true);
    try {
      if (isMockPodcast) {
        setEpisodes(mockEpisodes.filter(e => e.podcastId === podcast.id));
      } else {
        setEpisodes(await PodcastSearchService.getPodcastEpisodes(podcast.id));
      }
    } catch { setEpisodes([]); }
    finally { setIsLoadingEpisodes(false); }
  };

  const podIdx      = (Number(podcast.id) - 1) % Colors.covers.length;
  const coverColors = Colors.covers[podIdx % Colors.covers.length];
  const emoji       = Colors.coverEmojis[podIdx % Colors.coverEmojis.length];
  const catStyle    = CATEGORY_COLORS[podcast.category] || DEFAULT_CAT;
  const showRealImage = podcast.imageUrl && !imgError;

  const handlePlay = (episode) => {
    const localUri = getDownloadedUri(episode.id);
    const audioUri = localUri || episode.audioUrl || episode.episodeUrl || episode.previewUrl || null;
    if (!audioUri) {
      Alert.alert('No Audio', "This episode has no accessible audio URL.", [{ text: 'OK' }]);
      return;
    }
    const playable = localUri ? { ...episode, _resolvedUri: localUri } : episode;
    navigation.navigate('Player', { episode: playable, podcast, playlist: episodes, from: 'Podcast' });
  };

  const handleDownload = async (episode) => {
    if (!isConnected) {
      Alert.alert('You\'re Offline', 'Connect to the internet to download episodes.');
      return;
    }
    const audioUri = episode.audioUrl || episode.episodeUrl || episode.previewUrl || null;
    if (!audioUri) {
      Alert.alert('Download Failed', "This episode has no accessible audio URL.");
      return;
    }
    try {
      await downloadEpisode(episode, podcast);
      Alert.alert('Downloaded! ✓', 'This episode is now available offline.');
    } catch {
      Alert.alert('Download Error', 'Download failed. Please try again later.');
    }
  };

  const computeSpaceInfo = async (list) => {
    let freeBytes = 0;
    try { freeBytes = (await FileSystem.getFreeDiskStorageAsync()) ?? 0; } catch {}
    const totalBytes = list.reduce((s, ep) => s + (ep.fileSize || 30 * 1024 * 1024), 0);
    return {
      freeGB:  (freeBytes / 1024 / 1024 / 1024).toFixed(2),
      neededGB:(totalBytes / 1024 / 1024 / 1024).toFixed(2),
      hasEnough: freeBytes >= totalBytes,
    };
  };

  const handleDownloadAll = async () => {
    if (!isConnected) { Alert.alert('You\'re Offline', 'Connect to download episodes.'); return; }
    const toDownload = episodes.filter(ep =>
      !!(ep.audioUrl || ep.episodeUrl || ep.previewUrl) && !getIsDownloaded(ep.id)
    );
    if (!toDownload.length) { Alert.alert('All Downloaded', 'All available episodes are already saved.'); return; }
    const space = await computeSpaceInfo(toDownload);
    if (!space.hasEnough) {
      Alert.alert('Not Enough Space',
        `Free space: ${space.freeGB} GB\nEstimated needed: ${space.neededGB} GB\n\nFree up some space and try again.`,
        [{ text: 'OK' }]
      );
      return;
    }
    Alert.alert('Download All',
      `${toDownload.length} episode(s) to download.\nEstimated: ${space.neededGB} GB\nFree: ${space.freeGB} GB`,
      [{ text: 'Cancel', style: 'cancel' }, { text: 'Download', onPress: () => runDownloadAll(toDownload) }]
    );
  };

  const runDownloadAll = async (toDownload) => {
    cancelRef.current = false;
    setIsDownloadingAll(true);
    setDownloadAllTotal(toDownload.length);
    setDownloadAllCurrent(0);
    setDownloadAllProgress(0);
    progressAnim.setValue(0);
    let done = 0;
    for (let i = 0; i < toDownload.length; i++) {
      if (cancelRef.current) break;
      let free = 0;
      try { free = (await FileSystem.getFreeDiskStorageAsync()) ?? 0; } catch {}
      if (free < (toDownload[i].fileSize || 30 * 1024 * 1024) * 1.1) {
        Alert.alert('Not Enough Space', `Download stopped at episode ${i + 1}/${toDownload.length}.`, [{ text: 'OK' }]);
        break;
      }
      setDownloadAllCurrent(i + 1);
      try { await downloadEpisode(toDownload[i], podcast); done++; } catch {}
      const prog = (i + 1) / toDownload.length;
      setDownloadAllProgress(prog);
      Animated.timing(progressAnim, { toValue: prog, duration: 300, useNativeDriver: false }).start();
    }
    setIsDownloadingAll(false);
    if (!cancelRef.current) Alert.alert('Done! ✓', `${done} of ${toDownload.length} episode(s) downloaded.`);
    setDownloadAllProgress(0);
    progressAnim.setValue(0);
  };

  const alreadyDownloadedCount = episodes.filter(ep => getIsDownloaded(ep.id)).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── COVER PLEINE LARGEUR ── */}
        <View style={[styles.coverWrap, { height: COVER_HEIGHT }]}>
          {showRealImage ? (
            <Image
              source={{ uri: podcast.imageUrl }}
              style={styles.coverImage}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <LinearGradient colors={coverColors} style={styles.coverImage} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={styles.coverEmoji}>{emoji}</Text>
            </LinearGradient>
          )}
          <LinearGradient
            colors={['rgba(8,8,16,0.65)', 'transparent', 'transparent', Colors.bg]}
            style={styles.coverOverlay}
            locations={[0, 0.22, 0.62, 1]}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          {podcast.category && (
            <View style={[styles.coverCatBadge, { backgroundColor: catStyle.bg, borderColor: catStyle.border }]}>
              <Text style={[styles.coverCatText, { color: catStyle.text }]}>{podcast.category}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.podTitle}>{podcast.title}</Text>
          <Text style={styles.podAuthor}>by {podcast.author}</Text>
          <Text style={styles.podDesc}>{podcast.description}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{episodes.length}</Text>
              <Text style={styles.statLbl}>Episodes</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: Colors.gold }]}>⭐ {podcast.rating || '—'}</Text>
              <Text style={styles.statLbl}>Rating</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>~{podcast.avgDuration || '?'}m</Text>
              <Text style={styles.statLbl}>Avg. Length</Text>
            </View>
          </View>

          <View style={styles.hint}>
            <Text style={styles.hintText}>
              {isConnected
                ? '▶  Play now   ·   ⬇  Save for offline'
                : '📡  Offline mode — only downloaded episodes can play'}
            </Text>
          </View>

          {/* ── Section header + Download All ── */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Episodes</Text>
            {!isLoadingEpisodes && episodes.length > 0 && isConnected && (
              isDownloadingAll ? (
                <TouchableOpacity style={styles.cancelAllBtn} onPress={() => { cancelRef.current = true; }} activeOpacity={0.8}>
                  <Text style={styles.cancelAllText}>✕  Cancel</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.downloadAllBtn, alreadyDownloadedCount === episodes.length && styles.downloadAllBtnDone]}
                  onPress={handleDownloadAll} activeOpacity={0.8}
                >
                  <Text style={[styles.downloadAllText, alreadyDownloadedCount === episodes.length && { color: Colors.teal }]}>
                    {alreadyDownloadedCount === episodes.length ? '✓  All Saved' : '⬇  Download All'}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* ── Progress bar download all ── */}
          {isDownloadingAll && (
            <View style={styles.globalProgressWrap}>
              <View style={styles.globalProgressHeader}>
                <Text style={styles.globalProgressLabel}>Downloading {downloadAllCurrent} of {downloadAllTotal}…</Text>
                <Text style={styles.globalProgressPct}>{Math.round(downloadAllProgress * 100)}%</Text>
              </View>
              <View style={styles.globalProgressTrack}>
                <Animated.View style={[styles.globalProgressBar, {
                  width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                }]} />
              </View>
            </View>
          )}

          {isLoadingEpisodes ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>⏳</Text>
              <Text style={styles.emptyStateTitle}>Loading episodes…</Text>
              <Text style={styles.emptyStateSub}>Fetching the latest content</Text>
            </View>
          ) : episodes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🎙</Text>
              <Text style={styles.emptyStateTitle}>No episodes found</Text>
              <Text style={styles.emptyStateSub}>Check back later for new content</Text>
            </View>
          ) : (
            episodes.map((ep, i) => (
              <EpisodeItem
                key={ep.id} episode={ep} index={i} mode="online"
                downloaded={getIsDownloaded(ep.id)}
                downloadStatus={getDownloadStatus(ep.id)}
                hasAudio={!!(ep.audioUrl || ep.episodeUrl || ep.previewUrl || getIsDownloaded(ep.id))}
                onPlay={() => handlePlay(ep)}
                onDownload={() => handleDownload(ep)}
                accentColor={Colors.acc}
              />
            ))
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  coverWrap: { width: SCREEN_WIDTH, position: 'relative', overflow: 'hidden' },
  coverImage: { position: 'absolute', top: 0, left: 0, width: SCREEN_WIDTH, height: '100%', alignItems: 'center', justifyContent: 'center' },
  coverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  coverEmoji: { fontSize: 90 },
  backBtn: {
    position: 'absolute', top: 52, left: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(8,8,16,0.6)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 16, color: Colors.text },
  coverCatBadge: { position: 'absolute', bottom: 14, right: 14, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, borderWidth: 1 },
  coverCatText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  content: { padding: 18, paddingTop: 14 },
  podTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.3 },
  podAuthor: { fontSize: 12, color: Colors.t2, marginTop: 4 },
  podDesc: { fontSize: 13, color: Colors.t2, marginTop: 10, lineHeight: 20 },

  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 12, marginTop: 14 },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 15, fontWeight: '800', color: Colors.acc },
  statLbl: { fontSize: 9, color: Colors.t3, textTransform: 'uppercase', letterSpacing: 0.5 },
  statSep: { width: 1, height: 26, backgroundColor: Colors.border },

  hint: { backgroundColor: Colors.tealDim, borderWidth: 1, borderColor: Colors.tealBorder, borderRadius: 10, padding: 9, marginTop: 12, marginBottom: 14 },
  hintText: { fontSize: 11, fontWeight: '600', color: Colors.teal, textAlign: 'center' },

  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },

  downloadAllBtn: { backgroundColor: Colors.accDim, borderWidth: 1, borderColor: Colors.acc, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  downloadAllBtnDone: { backgroundColor: 'rgba(0,229,195,0.12)', borderColor: Colors.teal },
  downloadAllText: { fontSize: 11, fontWeight: '700', color: Colors.acc },
  cancelAllBtn: { backgroundColor: Colors.redDim, borderWidth: 1, borderColor: Colors.redBorder, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  cancelAllText: { fontSize: 11, fontWeight: '700', color: Colors.red },

  globalProgressWrap: { backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 12, marginBottom: 12 },
  globalProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  globalProgressLabel: { fontSize: 11, fontWeight: '600', color: Colors.t2 },
  globalProgressPct: { fontSize: 11, fontWeight: '700', color: Colors.acc },
  globalProgressTrack: { height: 6, backgroundColor: Colors.s3, borderRadius: 3, overflow: 'hidden' },
  globalProgressBar: { height: '100%', backgroundColor: Colors.acc, borderRadius: 3 },

  emptyState: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  emptyStateIcon: { fontSize: 36 },
  emptyStateTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  emptyStateSub: { fontSize: 12, color: Colors.t3 },
});
