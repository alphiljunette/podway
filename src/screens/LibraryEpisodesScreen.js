// ─────────────────────────────────────────────────────
// screens/LibraryEpisodesScreen.js
// ─────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Alert, Image, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import EpisodeItem from '../components/EpisodeItem';
import { useAppContext } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COVER_HEIGHT = Math.round(SCREEN_WIDTH * 0.68);

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

export default function LibraryEpisodesScreen({ route, navigation }) {
  const { podcast } = route.params;
  const { getEpisodesForPodcast, removeDownload } = useAppContext();
  const [imgError, setImgError] = useState(false);

  const episodes = useMemo(() => getEpisodesForPodcast(podcast.id), [getEpisodesForPodcast, podcast.id]);

  const podIdx      = (Number(podcast.id) - 1) % Colors.covers.length;
  const coverColors = Colors.covers[podIdx % Colors.covers.length];
  const emoji       = Colors.coverEmojis[podIdx % Colors.coverEmojis.length];
  const totalMB     = Math.round(episodes.reduce((a, e) => a + (e.fileSize || 0), 0) / 1024 / 1024 * 100) / 100;
  const catStyle    = CATEGORY_COLORS[podcast.category] || DEFAULT_CAT;
  const showRealImage = podcast.imageUrl && !imgError;

  const handleDelete = (episodeId) => {
    Alert.alert(
      'Remove Episode',
      'This will delete the downloaded file. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeDownload(episodeId);
              if (episodes.filter(e => e.id !== episodeId).length === 0) navigation.goBack();
            } catch {
              Alert.alert('Error', 'Failed to remove the episode. Please try again.');
            }
          },
        },
      ]
    );
  };

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

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{episodes.length}</Text>
              <Text style={styles.statLbl}>Saved</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: Colors.teal }]}>{totalMB} MB</Text>
              <Text style={styles.statLbl}>Storage</Text>
            </View>
          </View>

          {/* Offline notice */}
          <View style={styles.offlineNotice}>
            <Text style={styles.offlineNoticeIcon}>📡</Text>
            <View style={styles.offlineNoticeText}>
              <Text style={styles.offlineNoticeTitle}>Offline Library</Text>
              <Text style={styles.offlineNoticeSub}>These episodes are available without internet</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Downloaded Episodes</Text>

          {episodes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📭</Text>
              <Text style={styles.emptyStateTitle}>No episodes saved</Text>
              <Text style={styles.emptyStateSub}>Download episodes to listen offline</Text>
            </View>
          ) : (
            episodes.map((ep, i) => (
              <EpisodeItem
                key={ep.id} episode={ep} index={i} mode="library" downloaded={true}
                onPlay={() => navigation.navigate('Player', { episode: ep, podcast, playlist: episodes, from: 'LibraryEpisodes' })}
                onDelete={() => handleDelete(ep.id)}
                accentColor={Colors.teal}
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
  podAuthor: { fontSize: 12, color: Colors.t2, marginTop: 4, marginBottom: 14 },

  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 12, marginBottom: 14 },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 15, fontWeight: '800', color: Colors.acc },
  statLbl: { fontSize: 9, color: Colors.t3, textTransform: 'uppercase', letterSpacing: 0.5 },
  statSep: { width: 1, height: 26, backgroundColor: Colors.border },

  offlineNotice: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.tealDim, borderWidth: 1, borderColor: Colors.tealBorder,
    borderRadius: 12, padding: 12, marginBottom: 16,
  },
  offlineNoticeIcon: { fontSize: 22 },
  offlineNoticeText: { flex: 1 },
  offlineNoticeTitle: { fontSize: 12, fontWeight: '700', color: Colors.teal },
  offlineNoticeSub: { fontSize: 11, color: Colors.teal, opacity: 0.75, marginTop: 2 },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8 },

  emptyState: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  emptyStateIcon: { fontSize: 36 },
  emptyStateTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  emptyStateSub: { fontSize: 12, color: Colors.t3 },
});
