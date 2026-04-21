import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import BottomNav from '../components/BottomNav';
import { useNetwork } from '../services/NetworkManagerHook';
import { useAppContext } from '../context/AppContext';

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

function PodcastCover({ podcast, size = 52, radius = 12 }) {
  const [imgError, setImgError] = React.useState(false);
  const podIdx = (Number(podcast.id) - 1) % Colors.covers.length;
  const cols   = Colors.covers[podIdx];
  const emoji  = Colors.coverEmojis[podIdx];
  return podcast.imageUrl && !imgError ? (
    <Image source={{ uri: podcast.imageUrl }} style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden' }} resizeMode="cover" onError={() => setImgError(true)} />
  ) : (
    <LinearGradient colors={cols} style={{ width: size, height: size, borderRadius: radius, alignItems: 'center', justifyContent: 'center' }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <Text style={{ fontSize: size * 0.38 }}>{emoji}</Text>
    </LinearGradient>
  );
}

export default function LibraryScreen({ navigation }) {
  const { isConnected } = useNetwork();
  const { groupedDownloads: downloaded, storageInfo, totalDownloadedEpisodes } = useAppContext();
  const { usedByApp, remainingFree, totalSpace } = storageInfo;
  const pct = totalSpace > 0 ? ((totalSpace - remainingFree) / totalSpace) * 100 : 0;
  const isStorageCritical = remainingFree <= 0.999;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Text style={styles.pageTitle}>My Library</Text>
          {!isConnected && (
            <View style={styles.chip}>
              <View style={styles.chipDot} />
              <Text style={styles.chipText}>Offline</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{downloaded.length}</Text>
            <Text style={styles.statLbl}>PODCASTS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{totalDownloadedEpisodes}</Text>
            <Text style={styles.statLbl}>EPISODES</Text>
          </View>
        </View>

        {/* Storage */}
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <Text style={styles.storageTitle}>💾  Storage</Text>
            <Text style={styles.storageInfo}>{usedByApp} GB used · {remainingFree} GB free</Text>
          </View>
          <View style={styles.storageTrack}>
            <LinearGradient
              colors={isStorageCritical ? [Colors.red, Colors.redDim] : [Colors.acc, Colors.accDim]}
              style={[styles.storageFill, { width: `${pct}%` }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
          </View>
          <View style={styles.storageMeta}>
            <View>
              <Text style={styles.storageLabel}>App Downloads</Text>
              <Text style={[styles.storageValue, { color: Colors.acc }]}>{usedByApp} GB</Text>
            </View>
            <View>
              <Text style={styles.storageLabel}>Phone Available</Text>
              <Text style={[styles.storageValue, { color: isStorageCritical ? Colors.red : Colors.teal }]}>{remainingFree} GB</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Downloaded Podcasts</Text>
        <Text style={styles.tapHint}>Tap a podcast to see its episodes</Text>

        {downloaded.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📥</Text>
            <Text style={styles.emptyTitle}>No downloads yet</Text>
            <Text style={styles.emptySub}>Download episodes to listen without internet.</Text>
            {isConnected && (
              <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate('Explore')} activeOpacity={0.8}>
                <Text style={styles.exploreBtnText}>🔍  Explore Podcasts</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          downloaded.map(group => {
            const catStyle = CATEGORY_COLORS[group.podcast.category] || DEFAULT_CAT;
            return (
              <TouchableOpacity
                key={group.podcast.id} style={styles.podCard} activeOpacity={0.8}
                onPress={() => navigation.navigate('LibraryEpisodes', { podcast: group.podcast, episodes: group.episodes })}
              >
                <PodcastCover podcast={group.podcast} size={54} radius={13} />
                <View style={styles.podInfo}>
                  <Text style={styles.podTitle}>{group.podcast.title}</Text>
                  <Text style={styles.podSub}>
                    {group.episodes.length} episode{group.episodes.length > 1 ? 's' : ''} · {group.totalSizeMB} MB
                  </Text>
                  {group.podcast.category && (
                    <View style={[styles.catBadge, { backgroundColor: catStyle.bg, borderColor: catStyle.border }]}>
                      <Text style={[styles.catBadgeText, { color: catStyle.text }]}>{group.podcast.category}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
      <BottomNav active="Library" isConnected={isConnected} onPress={tab => navigation.navigate(tab)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingTop: 56 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, backgroundColor: Colors.redDim },
  chipDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.red },
  chipText: { fontSize: 10, fontWeight: '700', color: Colors.red },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 12, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '800', color: Colors.acc },
  statLbl: { fontSize: 9, color: Colors.t3, marginTop: 2, letterSpacing: 0.5 },

  storageCard: { backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 14, marginBottom: 20 },
  storageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  storageTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  storageInfo: { fontSize: 11, color: Colors.teal },
  storageTrack: { height: 5, backgroundColor: Colors.s4, borderRadius: 5, overflow: 'hidden', marginBottom: 12 },
  storageFill: { height: '100%', borderRadius: 5 },
  storageMeta: { flexDirection: 'row', justifyContent: 'space-around' },
  storageLabel: { fontSize: 9, color: Colors.t3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  storageValue: { fontSize: 13, fontWeight: '700', color: Colors.text },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  tapHint: { fontSize: 10, color: Colors.t3, fontStyle: 'italic', marginBottom: 12 },

  podCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 12, marginBottom: 10 },
  podInfo: { flex: 1, minWidth: 0, gap: 3 },
  podTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  podSub: { fontSize: 10, color: Colors.t3 },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100, borderWidth: 1, marginTop: 2 },
  catBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.3 },
  arrow: { fontSize: 18, color: Colors.t3 },

  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  emptySub: { fontSize: 12, color: Colors.t2, textAlign: 'center' },
  exploreBtn: { marginTop: 8, backgroundColor: Colors.acc, borderRadius: 100, paddingVertical: 9, paddingHorizontal: 20 },
  exploreBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
