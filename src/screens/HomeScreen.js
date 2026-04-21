// ─────────────────────────────────────────────────────
// screens/HomeScreen.js
// ─────────────────────────────────────────────────────
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, ActivityIndicator,
} from 'react-native';
import Colors from '../constants/colors';
import BottomNav from '../components/BottomNav';
import PodcastHorizontalCard from '../components/PodcastHorizontalCard';
import { useNetwork } from '../services/NetworkManagerHook';
import { useAppContext } from '../context/AppContext';
import PodcastSearchService from '../services/PodcastSearchService';

export default function HomeScreen({ navigation }) {
  const { isConnected }             = useNetwork();
  const { totalDownloadedEpisodes } = useAppContext();

  const [search, setSearch]               = useState('');
  const [recommended, setRecommended]     = useState([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching]     = useState(false);
  const [retrying, setRetrying]           = useState(false);

  useEffect(() => {
    if (isConnected) loadRecommended();
  }, [isConnected]);

  const loadRecommended = async () => {
    setIsLoadingRecommended(true);
    try {
      const results = await PodcastSearchService.searchPodcasts('storytelling documentary podcast recommendations', 30);
      setRecommended(results);
    } catch { setRecommended([]); }
    finally { setIsLoadingRecommended(false); }
  };

  const handleRetry = useCallback(async () => {
    setRetrying(true);
    await new Promise(r => setTimeout(r, 700));
    setRetrying(false);
    if (isConnected) loadRecommended();
  }, [isConnected]);

  useEffect(() => {
    if (!search.trim() || !isConnected) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setIsSearching(true);
      try { setSearchResults(await PodcastSearchService.searchPodcasts(search.trim(), 10)); }
      catch { setSearchResults([]); }
      finally { setIsSearching(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [search, isConnected]);

  const isSearchMode = search.trim().length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={[styles.sub, { color: isConnected ? Colors.t3 : Colors.red }]}>
              {isConnected ? `Discover podcasts · ${totalDownloadedEpisodes} saved` : 'You\'re offline'}
            </Text>
          </View>
          <View style={[styles.chip, isConnected ? styles.chipOn : styles.chipOff]}>
            <View style={[styles.chipDot, { backgroundColor: isConnected ? Colors.teal : Colors.red }]} />
            <Text style={[styles.chipText, { color: isConnected ? Colors.teal : Colors.red }]}>
              {isConnected ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* SEARCH */}
        <View style={[styles.searchBar, !isConnected && styles.searchDisabled]}>
          <Text style={styles.searchIcon}>🔍</Text>
          {isConnected ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Search podcasts…"
              placeholderTextColor={Colors.t3}
              value={search}
              onChangeText={setSearch}
              selectionColor={Colors.acc}
              returnKeyType="search"
            />
          ) : (
            <Text style={styles.searchPlaceholderOff}>Search unavailable offline</Text>
          )}
          {search.length > 0 && isConnected && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* OFFLINE STATE */}
        {!isConnected && (
          <View style={styles.offlineContainer}>
            <View style={styles.offlineIconWrap}>
              <Text style={styles.offlineIcon}>📡</Text>
            </View>
            <Text style={styles.offlineTitle}>No Internet Connection</Text>
            <Text style={styles.offlineDesc}>
              Podcast content isn't available offline.{'\n'}Check your connection and try again.
            </Text>
            <TouchableOpacity
              style={[styles.retryBtn, retrying && styles.retryBtnLoading]}
              onPress={handleRetry} activeOpacity={0.8} disabled={retrying}
            >
              {retrying
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.retryBtnText}>↺   Retry</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.libraryLink} onPress={() => navigation.navigate('Library')} activeOpacity={0.8}>
              <Text style={styles.libraryLinkText}>📚  Go to my downloads</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SEARCH RESULTS */}
        {isConnected && isSearchMode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isSearching ? 'Searching…' : `Results (${searchResults.length})`}
            </Text>
            {isSearching ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={Colors.acc} size="small" />
                <Text style={styles.loadingText}>Searching…</Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySub}>Try different keywords</Text>
              </View>
            ) : (
              searchResults.map(p => (
                <PodcastHorizontalCard key={p.id} podcast={p} onPress={() => navigation.navigate('Podcast', { podcast: p })} />
              ))
            )}
          </View>
        )}

        {/* RECOMMENDED */}
        {isConnected && !isSearchMode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            {isLoadingRecommended ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={Colors.acc} size="small" />
                <Text style={styles.loadingText}>Loading…</Text>
              </View>
            ) : recommended.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🎙</Text>
                <Text style={styles.emptyTitle}>Nothing to show</Text>
                <Text style={styles.emptySub}>Couldn't load recommendations</Text>
              </View>
            ) : (
              recommended.map(p => (
                <PodcastHorizontalCard key={p.id} podcast={p} onPress={() => navigation.navigate('Podcast', { podcast: p })} />
              ))
            )}
          </View>
        )}

      </ScrollView>

      <BottomNav active="Home" isConnected={isConnected} onPress={tab => navigation.navigate(tab)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingTop: 56 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 11, marginTop: 3 },

  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20 },
  searchDisabled: { opacity: 0.4, borderColor: Colors.redBorder },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: Colors.text },
  searchPlaceholderOff: { flex: 1, fontSize: 13, color: Colors.t3 },
  clearBtn: { fontSize: 16, color: Colors.t3 },

  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  chipOn: { backgroundColor: Colors.tealDim },
  chipOff: { backgroundColor: Colors.redDim },
  chipDot: { width: 5, height: 5, borderRadius: 3 },
  chipText: { fontSize: 10, fontWeight: '700' },

  /* Offline state */
  offlineContainer: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20 },
  offlineIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.redDim, borderWidth: 1, borderColor: Colors.redBorder, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  offlineIcon: { fontSize: 34 },
  offlineTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 8, textAlign: 'center' },
  offlineDesc: { fontSize: 13, color: Colors.t2, textAlign: 'center', lineHeight: 20, marginBottom: 26 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.acc, borderRadius: 100, paddingVertical: 12, paddingHorizontal: 36, marginBottom: 12, minWidth: 130, minHeight: 44 },
  retryBtnLoading: { opacity: 0.7 },
  retryBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  libraryLink: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100, borderWidth: 1, borderColor: Colors.border2, backgroundColor: Colors.s3 },
  libraryLinkText: { fontSize: 13, fontWeight: '600', color: Colors.t2 },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, backgroundColor: Colors.s2, borderRadius: 14 },
  loadingText: { fontSize: 12, color: Colors.t2 },

  emptyState: { alignItems: 'center', paddingVertical: 28, gap: 6 },
  emptyIcon: { fontSize: 30 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  emptySub: { fontSize: 12, color: Colors.t3 },
});
