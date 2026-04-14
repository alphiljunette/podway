<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import Colors from '../constants/colors';
import BottomNav from '../components/BottomNav';
import PodcastHorizontalCard from '../components/PodcastHorizontalCard';
<<<<<<< HEAD
import { useNetwork } from '../services/NetworkManagerHook';
import PodcastSearchService from '../services/PodcastSearchService';
import { categories } from '../data/mockData';
=======
import { useNetwork } from '../services/NetworkManager';
import { podcasts, categories } from '../data/mockData';
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

export default function ExploreScreen({ navigation }) {
  const { isConnected } = useNetwork();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
<<<<<<< HEAD
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trending, setTrending] = useState([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);

  // Charge le trending uniquement en ligne
  useEffect(() => {
    if (isConnected) loadTrending();
    else setIsLoadingTrending(false);
  }, [isConnected]);

  const loadTrending = async () => {
    setIsLoadingTrending(true);
    try {
      const results = await PodcastSearchService.searchPodcasts('top podcast charts 2025', 30);
      setTrending(results);
    } catch (_) {
      setTrending([]);
    } finally {
      setIsLoadingTrending(false);
    }
  };

  // ── Recherche debounce — même logique que HomeScreen ──
  useEffect(() => {
    if (!search.trim() || !isConnected) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await PodcastSearchService.searchPodcasts(search.trim());
        setSearchResults(results);
      } catch (_) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, isConnected]);

  const isSearchMode = search.trim().length > 0;

  const filtered = isSearchMode
    ? searchResults.filter(p => activeCategory === 'All' || p.category === activeCategory)
    : trending;
=======

  const filtered = podcasts.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

<<<<<<< HEAD
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Explore</Text>

          {/* Search bar — toujours visible */}
          <View style={[styles.searchBar, !isConnected && styles.searchDisabled]}>
            <Text style={styles.searchIcon}>🔍</Text>
            {isConnected ? (
              <TextInput
                style={styles.searchInput}
                placeholder="Search podcasts on iTunes…"
=======
      {/* ── OFFLINE STATE ── */}
      {!isConnected ? (
        <View style={styles.offlineWrap}>
          <Text style={styles.pageTitle}>Explore</Text>

          {/* Disabled search bar */}
          <View style={[styles.searchBar, styles.searchDisabled]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholderDisabled}>Search unavailable</Text>
          </View>

          {/* Error state */}
          <View style={styles.errorState}>
            <View style={styles.errorIcon}>
              <Text style={{ fontSize: 24 }}>📡</Text>
            </View>
            <Text style={styles.errorTitle}>No Connection</Text>
            <Text style={styles.errorSub}>
              Internet is required to explore and search for podcasts.
            </Text>
            <TouchableOpacity style={styles.retryBtn} activeOpacity={0.8}>
              <Text style={styles.retryText}>↺ Retry</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.libraryBtn}
              onPress={() => navigation.navigate('Library')}
              activeOpacity={0.8}
            >
              <Text style={styles.libraryBtnText}>📚 Go to Library</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* ── ONLINE STATE ── */
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.pageTitle}>Explore</Text>

            {/* Search bar */}
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search podcasts…"
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
                placeholderTextColor={Colors.t3}
                value={search}
                onChangeText={setSearch}
                selectionColor={Colors.acc}
<<<<<<< HEAD
                returnKeyType="search"
              />
            ) : (
              <Text style={styles.searchPlaceholderDisabled}>Search unavailable offline</Text>
            )}
            {search.length > 0 && isConnected && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Message hors ligne non bloquant */}
          {!isConnected && (
            <View style={styles.offlineNotice}>
              <Text style={styles.offlineNoticeText}>
                📡 Hors ligne — connectez-vous pour explorer des podcasts
              </Text>
              <TouchableOpacity
                style={styles.libraryBtn}
                onPress={() => navigation.navigate('Library')}
                activeOpacity={0.8}
              >
                <Text style={styles.libraryBtnText}>📚 Aller à la bibliothèque</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Categories */}
          {isConnected && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
=======
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Text style={styles.clearBtn}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categories}
            >
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catTag, activeCategory === cat && styles.catTagActive]}
                  onPress={() => setActiveCategory(cat)}
                >
<<<<<<< HEAD
                  <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {isConnected && (
            <>
              <View style={styles.divider} />
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {isSearchMode
                    ? isSearching ? '🔍 Recherche…' : `🔍 Résultats (${filtered.length})`
                    : '🔥 Trending'}
                </Text>
              </View>

              {/* Résultats de recherche */}
              {isSearchMode ? (
                isSearching ? (
                  <View style={styles.loading}>
                    <Text style={styles.loadingText}>Recherche en cours…</Text>
                  </View>
                ) : filtered.length === 0 ? (
                  <View style={styles.noResult}>
                    <Text style={styles.noResultText}>Aucun résultat pour « {search} »</Text>
                    <Text style={styles.noResultSub}>Essayez d'autres mots-clés</Text>
                  </View>
                ) : (
                  filtered.map(podcast => (
                    <PodcastHorizontalCard
                      key={podcast.id}
                      podcast={podcast}
                      onPress={() => navigation.navigate('Podcast', { podcast })}
                    />
                  ))
                )
              ) : (
                /* Trending */
                isLoadingTrending ? (
                  <View style={styles.loading}>
                    <Text style={styles.loadingText}>Chargement…</Text>
                  </View>
                ) : trending.length === 0 ? (
                  <View style={styles.noResult}>
                    <Text style={styles.noResultText}>Aucun podcast trending trouvé</Text>
                  </View>
                ) : (
                  trending.map((podcast, idx) => (
                    <PodcastHorizontalCard
                      key={podcast.id}
                      podcast={podcast}
                      badge={`#${idx + 1}`}
                      onPress={() => navigation.navigate('Podcast', { podcast })}
                    />
                  ))
                )
              )}
            </>
          )}
        </View>
      </ScrollView>
=======
                  <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Results / Trending */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {search.length > 0 ? `Results (${filtered.length})` : '🔥 Trending'}
              </Text>
              {search.length === 0 && <Text style={styles.tapHint}>Tap to open →</Text>}
            </View>

            {filtered.length === 0 ? (
              <View style={styles.noResult}>
                <Text style={styles.noResultText}>No results for "{search}"</Text>
              </View>
            ) : (
              filtered.map((podcast, idx) => (
                <PodcastHorizontalCard
                  key={podcast.id}
                  podcast={podcast}
                  badge={search.length === 0 ? `#${idx + 1}` : null}
                  onPress={() => navigation.navigate('Podcast', { podcast })}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

      <BottomNav
        active="Explore"
        isConnected={isConnected}
        onPress={tab => navigation.navigate(tab)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingTop: 56 },

<<<<<<< HEAD
  pageTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 14 },
=======
  offlineWrap: { flex: 1, paddingTop: 56 },

  pageTitle: {
    fontSize: 20, fontWeight: '800', color: Colors.text,
    marginBottom: 14, paddingHorizontal: 20,
  },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border,
<<<<<<< HEAD
    borderRadius: 13, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14,
  },
  searchDisabled: { opacity: 0.45, borderColor: Colors.redBorder },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: Colors.text },
  searchPlaceholderDisabled: { flex: 1, fontSize: 13, color: Colors.t3 },
  clearBtn: { fontSize: 16, color: Colors.t3 },

  offlineNotice: {
    backgroundColor: Colors.redDim, borderWidth: 1, borderColor: Colors.redBorder,
    borderRadius: 12, padding: 14, marginBottom: 14, gap: 10, alignItems: 'center',
  },
  offlineNoticeText: { fontSize: 12, color: Colors.red, fontWeight: '600', textAlign: 'center' },
  libraryBtn: {
    backgroundColor: Colors.s3, borderRadius: 100, borderWidth: 1,
    borderColor: Colors.border2, paddingVertical: 8, paddingHorizontal: 20,
  },
  libraryBtnText: { fontSize: 13, fontWeight: '700', color: Colors.text },

  categories: { marginBottom: 14 },
  catTag: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100,
    backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, marginRight: 8,
=======
    borderRadius: 13, paddingHorizontal: 14, paddingVertical: 10,
    marginHorizontal: 20, marginBottom: 14,
  },
  searchDisabled: {
    opacity: 0.35,
    borderColor: Colors.redBorder,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: Colors.text },
  searchPlaceholderDisabled: { fontSize: 13, color: Colors.t3 },
  clearBtn: { fontSize: 16, color: Colors.t3 },

  categories: { paddingLeft: 20, marginBottom: 14 },
  catTag: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 100, backgroundColor: Colors.s3,
    borderWidth: 1, borderColor: Colors.border, marginRight: 8,
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  },
  catTagActive: { backgroundColor: Colors.acc, borderColor: Colors.acc },
  catText: { fontSize: 11, fontWeight: '600', color: Colors.t2 },
  catTextActive: { color: '#fff' },

<<<<<<< HEAD
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },

  loading: { backgroundColor: Colors.s2, borderRadius: 14, padding: 24, alignItems: 'center' },
  loadingText: { fontSize: 13, color: Colors.t2 },

  noResult: { backgroundColor: Colors.s2, borderRadius: 14, padding: 24, alignItems: 'center' },
  noResultText: { fontSize: 13, color: Colors.t2 },
  noResultSub: { fontSize: 11, color: Colors.t3, marginTop: 4 },
=======
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  tapHint: { fontSize: 10, color: Colors.t3 },

  noResult: {
    backgroundColor: Colors.s2, borderRadius: 14,
    padding: 24, alignItems: 'center',
  },
  noResultText: { fontSize: 13, color: Colors.t2 },

  // Offline error state
  errorState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 12, padding: 28, textAlign: 'center',
  },
  errorIcon: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.redDim, borderWidth: 1, borderColor: Colors.redBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  errorTitle: { fontSize: 17, fontWeight: '800', color: Colors.red },
  errorSub: { fontSize: 12, color: Colors.t3, textAlign: 'center', maxWidth: 220, lineHeight: 18 },

  retryBtn: {
    backgroundColor: Colors.acc, borderRadius: 100,
    paddingVertical: 9, paddingHorizontal: 24,
    shadowColor: Colors.acc, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  retryText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  divider: { height: 1, backgroundColor: Colors.border, width: '100%', marginVertical: 4 },

  libraryBtn: {
    backgroundColor: Colors.s3, borderRadius: 100, borderWidth: 1,
    borderColor: Colors.border2, paddingVertical: 9,
    paddingHorizontal: 24, width: '100%', alignItems: 'center',
  },
  libraryBtnText: { fontSize: 13, fontWeight: '700', color: Colors.text },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
});
