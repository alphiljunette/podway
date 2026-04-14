<<<<<<< HEAD
import React from 'react';
=======
import React, { useMemo } from 'react';
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import BottomNav from '../components/BottomNav';
<<<<<<< HEAD
import { useNetwork } from '../services/NetworkManagerHook';
import { useAppContext } from '../context/AppContext';

export default function LibraryScreen({ navigation }) {
  const { isConnected } = useNetwork();
  const {
    groupedDownloads: downloaded,
    storageInfo,
    totalDownloadedEpisodes,
    totalDownloadedPodcasts,
  } = useAppContext();

  const { usedByApp, remainingFree, totalSpace } = storageInfo;
  const totalEpisodes = totalDownloadedEpisodes;
  const pct = totalSpace > 0 ? ((totalSpace - remainingFree) / totalSpace) * 100 : 0;
  const isStorageCritical = remainingFree <= 0.999;
=======
import { useNetwork } from '../services/NetworkManager';
import LibraryService from '../services/LibraryService';
import StorageManager from '../services/StorageManager';

export default function LibraryScreen({ navigation }) {
  const { isConnected } = useNetwork();
  
  const downloaded = LibraryService.getGrouped();
  const { usedSpace, totalSpace } = StorageManager.getStorageInfo();

  const totalEpisodes = downloaded.reduce((acc, g) => acc + g.episodes.length, 0);
  const pct = (usedSpace / totalSpace) * 100;
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>My Library</Text>
          {!isConnected && (
            <View style={styles.chip}>
              <View style={styles.chipDot} />
              <Text style={styles.chipText}>Offline</Text>
            </View>
          )}
        </View>

        {/* ── STAT CARDS ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{downloaded.length}</Text>
            <Text style={styles.statLbl}>PODCASTS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{totalEpisodes}</Text>
            <Text style={styles.statLbl}>EPISODES</Text>
          </View>
        </View>

        {/* ── STORAGE ── */}
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <Text style={styles.storageTitle}>💾 Storage</Text>
<<<<<<< HEAD
            <Text style={styles.storageInfo}>{usedByApp} GB used · {remainingFree} GB free</Text>
          </View>
          <View style={styles.storageTrack}>
            <LinearGradient
              colors={isStorageCritical ? [Colors.red, Colors.redDim] : [Colors.acc, Colors.accDim]}
=======
            <Text style={styles.storageInfo}>{usedSpace} / {totalSpace} GB</Text>
          </View>
          <View style={styles.storageTrack}>
            <LinearGradient
              colors={[Colors.acc, Colors.teal]}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
              style={[styles.storageFill, { width: `${pct}%` }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
          </View>
<<<<<<< HEAD
          <View style={styles.storageInfo2}>
            <View>
              <Text style={styles.storageLabel}>App Downloads</Text>
              <Text style={[styles.storageValue, { color: Colors.acc }]}>{usedByApp} GB</Text>
            </View>
            <View>
              <Text style={styles.storageLabel}>Phone Available</Text>
              <Text style={[styles.storageValue, { color: isStorageCritical ? Colors.red : Colors.teal }]}>{remainingFree} GB</Text>
            </View>
=======
          <View style={styles.storageLabels}>
            <Text style={styles.storageUsed}>{usedSpace} GB used</Text>
            <Text style={styles.storageFree}>{(totalSpace - usedSpace).toFixed(1)} GB free</Text>
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
          </View>
        </View>

        {/* ── PODCAST LIST ── */}
        <Text style={styles.sectionTitle}>Downloaded Podcasts</Text>
        <Text style={styles.tapHint}>Tap a podcast to see its episodes</Text>

        {downloaded.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📥</Text>
            <Text style={styles.emptyTitle}>No downloads yet</Text>
            <Text style={styles.emptySub}>Download episodes to listen offline.</Text>
            {isConnected && (
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('Explore')}
                activeOpacity={0.8}
              >
                <Text style={styles.exploreBtnText}>🔍 Explore Podcasts</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          downloaded.map(group => {
            const podIdx = (group.podcast.id - 1) % Colors.covers.length;
            const coverColors = Colors.covers[podIdx];
            const emoji = Colors.coverEmojis[podIdx];
<<<<<<< HEAD
=======
            const totalMB = group.episodes.reduce((acc, e) => acc + e.fileSize, 0);
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

            return (
              <TouchableOpacity
                key={group.podcast.id}
                style={styles.podCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('LibraryEpisodes', {
                  podcast: group.podcast,
                  episodes: group.episodes,
                })}
              >
                <LinearGradient colors={coverColors} style={styles.podCover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Text style={styles.podEmoji}>{emoji}</Text>
                </LinearGradient>
                <View style={styles.podInfo}>
                  <Text style={styles.podTitle}>{group.podcast.title}</Text>
                  <Text style={styles.podSub}>
<<<<<<< HEAD
                    {group.episodes.length} episode{group.episodes.length > 1 ? 's' : ''} downloaded · {group.totalSizeMB} MB
=======
                    {group.episodes.length} episode{group.episodes.length > 1 ? 's' : ''} downloaded · {totalMB} MB
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <BottomNav
        active="Library"
        isConnected={isConnected}
        onPress={tab => {
          if (!isConnected && (tab === 'Home' || tab === 'Explore')) return;
          navigation.navigate(tab);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingTop: 56 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  pageTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, backgroundColor: Colors.redDim },
  chipDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.red },
  chipText: { fontSize: 10, fontWeight: '700', color: Colors.red },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1, backgroundColor: Colors.s2, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 13, padding: 12, alignItems: 'center',
  },
  statVal: { fontSize: 22, fontWeight: '800', color: Colors.acc },
  statLbl: { fontSize: 9, color: Colors.t3, marginTop: 2, letterSpacing: 0.5 },

  storageCard: {
    backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 13, padding: 14, marginBottom: 20,
  },
  storageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  storageTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  storageInfo: { fontSize: 11, color: Colors.teal },
<<<<<<< HEAD
  storageTrack: { height: 5, backgroundColor: Colors.s4, borderRadius: 5, overflow: 'hidden', marginBottom: 12 },
  storageFill: { height: '100%', borderRadius: 5 },
  storageInfo2: { flexDirection: 'row', justifyContent: 'space-around' },
  storageLabel: { fontSize: 9, color: Colors.t3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  storageValue: { fontSize: 13, fontWeight: '700', color: Colors.text },
=======
  storageTrack: { height: 5, backgroundColor: Colors.s4, borderRadius: 5, overflow: 'hidden' },
  storageFill: { height: '100%', borderRadius: 5 },
  storageLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  storageUsed: { fontSize: 10, color: Colors.acc },
  storageFree: { fontSize: 10, color: Colors.t3 },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  tapHint: { fontSize: 10, color: Colors.t3, fontStyle: 'italic', marginBottom: 12 },

  podCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14, padding: 12, marginBottom: 10,
  },
  podCover: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  podEmoji: { fontSize: 20 },
  podInfo: { flex: 1, minWidth: 0 },
  podTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  podSub: { fontSize: 10, color: Colors.t3, marginTop: 3 },
  arrow: { fontSize: 18, color: Colors.t3 },

  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  emptySub: { fontSize: 12, color: Colors.t2, textAlign: 'center' },
  exploreBtn: {
    marginTop: 8, backgroundColor: Colors.acc, borderRadius: 100,
    paddingVertical: 9, paddingHorizontal: 20,
  },
  exploreBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
