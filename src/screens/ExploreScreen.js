import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator,
} from 'react-native';
import Colors from '../constants/colors';
import BottomNav from '../components/BottomNav';
import PodcastHorizontalCard from '../components/PodcastHorizontalCard';
import { useNetwork } from '../services/NetworkManagerHook';
import PodcastSearchService from '../services/PodcastSearchService';
import { categories } from '../data/mockData';

const CATEGORY_QUERIES = {
  'All':        'top podcast 2025',
  'Tech':       'technology AI programming podcast',
  'Science':    'science nature space biology podcast',
  'Society':    'society politics sociology podcast',
  'Culture':    'culture arts music podcast',
  'Business':   'business entrepreneurship finance podcast',
  'Health':     'health wellness fitness mental health podcast',
  'History':    'history documentary stories podcast',
  'Comedy':     'comedy humor stand up podcast',
  'True Crime': 'true crime mystery investigation podcast',
  'Sports':     'sports football basketball athletics podcast',
  'Education':  'education learning skills podcast',
};

export default function ExploreScreen({ navigation }) {
  const { isConnected } = useNetwork();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trending, setTrending] = useState([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (isConnected) loadTrending('All');
    else setIsLoadingTrending(false);
  }, [isConnected]);

  const loadTrending = async (cat = 'All') => {
    setIsLoadingTrending(true);
    try {
      const q = CATEGORY_QUERIES[cat] || CATEGORY_QUERIES['All'];
      setTrending(await PodcastSearchService.searchPodcasts(q, 30));
    } catch { setTrending([]); }
    finally { setIsLoadingTrending(false); }
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (isConnected && !isSearchMode) loadTrending(cat);
  };

  const handleRetry = useCallback(async () => {
    setRetrying(true);
    await new Promise(r => setTimeout(r, 700));
    setRetrying(false);
    if (isConnected) loadTrending(activeCategory);
  }, [isConnected, activeCategory]);

  useEffect(() => {
    if (!search.trim() || !isConnected) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setIsSearching(true);
      try { setSearchResults(await PodcastSearchService.searchPodcasts(search.trim())); }
      catch { setSearchResults([]); }
      finally { setIsSearching(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [search, isConnected]);

  const isSearchMode = search.trim().length > 0;
  const filtered = isSearchMode
    ? searchResults.filter(p => activeCategory === 'All' || p.category === activeCategory)
    : trending;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Explore</Text>

          {/* Search */}
          <View style={[styles.searchBar, !isConnected && styles.searchDisabled]}>
            <Text style={styles.searchIcon}>🔍</Text>
            {isConnected ? (
              <TextInput
                style={styles.searchInput}
                placeholder="Search podcasts…"
                placeholderTextColor={Colors.t3}
                value={search} onChangeText={setSearch}
                selectionColor={Colors.acc} returnKeyType="search"
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

          {/* Category chips — always visible, dimmed offline */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catsScroll}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catTag, activeCategory === cat && styles.catTagActive, !isConnected && styles.catTagOff]}
                onPress={() => isConnected && handleCategoryChange(cat)}
                activeOpacity={isConnected ? 0.8 : 1}
              >
                <Text style={[styles.catText, activeCategory === cat && styles.catTextActive, !isConnected && styles.catTextOff]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* OFFLINE STATE */}
          {!isConnected && (
            <View style={styles.offlineContainer}>
              <View style={styles.offlineIconWrap}>
                <Text style={styles.offlineIcon}>🔍</Text>
              </View>
              <Text style={styles.offlineTitle}>No Internet Connection</Text>
              <Text style={styles.offlineDesc}>
                Exploring requires an internet connection.{'\n'}Connect and tap Retry to load podcasts.
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

          {isConnected && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>
                {isSearchMode
                  ? isSearching ? '🔍  Searching…' : `🔍  Results (${filtered.length})`
                  : `🔥  ${activeCategory === 'All' ? 'Trending' : activeCategory}`}
              </Text>

              {isSearchMode ? (
                isSearching ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color={Colors.acc} size="small" />
                    <Text style={styles.loadingText}>Searching podcasts…</Text>
                  </View>
                ) : filtered.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🎙</Text>
                    <Text style={styles.emptyTitle}>No results for "{search}"</Text>
                    <Text style={styles.emptySub}>
                      {activeCategory !== 'All' ? `Try a different category or keyword` : 'Try different keywords'}
                    </Text>
                  </View>
                ) : (
                  filtered.map(p => (
                    <PodcastHorizontalCard key={p.id} podcast={p} onPress={() => navigation.navigate('Podcast', { podcast: p })} />
                  ))
                )
              ) : (
                isLoadingTrending ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color={Colors.acc} size="small" />
                    <Text style={styles.loadingText}>Loading trending podcasts…</Text>
                  </View>
                ) : trending.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📡</Text>
                    <Text style={styles.emptyTitle}>Nothing found</Text>
                    <Text style={styles.emptySub}>Couldn't load trending podcasts</Text>
                  </View>
                ) : (
                  trending.map((p, idx) => (
                    <PodcastHorizontalCard key={p.id} podcast={p} badge={`#${idx + 1}`} onPress={() => navigation.navigate('Podcast', { podcast: p })} />
                  ))
                )
              )}
            </>
          )}
        </View>
      </ScrollView>

      <BottomNav active="Explore" isConnected={isConnected} onPress={tab => navigation.navigate(tab)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingTop: 56 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 14 },

  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14 },
  searchDisabled: { opacity: 0.4, borderColor: Colors.redBorder },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: Colors.text },
  searchPlaceholderOff: { flex: 1, fontSize: 13, color: Colors.t3 },
  clearBtn: { fontSize: 16, color: Colors.t3 },

  catsScroll: { marginBottom: 14 },
  catTag: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  catTagActive: { backgroundColor: Colors.acc, borderColor: Colors.acc },
  catTagOff: { opacity: 0.4 },
  catText: { fontSize: 11, fontWeight: '600', color: Colors.t2 },
  catTextActive: { color: '#fff' },
  catTextOff: { color: Colors.t3 },

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

  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, backgroundColor: Colors.s2, borderRadius: 14 },
  loadingText: { fontSize: 12, color: Colors.t2 },

  emptyState: { alignItems: 'center', paddingVertical: 28, gap: 6 },
  emptyIcon: { fontSize: 30 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  emptySub: { fontSize: 12, color: Colors.t3, textAlign: 'center' },
});
