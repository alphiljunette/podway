<<<<<<< HEAD
// ─────────────────────────────────────────────────────
// screens/HomeScreen.js
// ─────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, TextInput, StyleSheet, StatusBar, ActivityIndicator,
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
  const [popular, setPopular]             = useState([]);
  const [recommended, setRecommended]     = useState([]);
  const [isLoadingPopular, setIsLoadingPopular]         = useState(false);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching]     = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    loadPopular();
    loadRecommended();
  }, [isConnected]);

  const loadPopular = async () => {
    setIsLoadingPopular(true);
    try {
      const results = await PodcastSearchService.searchPodcasts('top podcast 2024', 6);
      setPopular(results);
    } catch (_) { setPopular([]); }
    finally { setIsLoadingPopular(false); }
  };

  const loadRecommended = async () => {
    setIsLoadingRecommended(true);
    try {
      const results = await PodcastSearchService.searchPodcasts('storytelling documentary podcast recommendations', 30);
      setRecommended(results);
    } catch (_) { setRecommended([]); }
    finally { setIsLoadingRecommended(false); }
  };

  // Recherche debounce
  useEffect(() => {
    if (!search.trim() || !isConnected) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await PodcastSearchService.searchPodcasts(search.trim(), 10);
        setSearchResults(res);
      } catch (_) { setSearchResults([]); }
      finally { setIsSearching(false); }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, isConnected]);

  const isSearchMode = search.trim().length > 0;

=======
import React from 'react';
import {
  View, Text, ScrollView, FlatList,
  TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import Colors from '../constants/colors';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import PodcastVerticalCard from '../components/PodcastVerticalCard';
import PodcastHorizontalCard from '../components/PodcastHorizontalCard';
import { useNetwork } from '../services/NetworkManager';
import { podcasts } from '../data/mockData';

export default function HomeScreen({ navigation }) {
  const { isConnected } = useNetwork();

  const handlePodcastPress = (podcast) => {
    navigation.navigate('Podcast', { podcast });
  };

>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={[styles.sub, { color: isConnected ? Colors.t3 : Colors.red }]}>
<<<<<<< HEAD
              {isConnected ? `Discover podcasts · ${totalDownloadedEpisodes} saved` : "You're offline"}
            </Text>
          </View>
=======
              {isConnected ? 'Discover podcasts' : "You're offline"}
            </Text>
          </View>
          {/* Status chip */}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
          <View style={[styles.chip, isConnected ? styles.chipOn : styles.chipOff]}>
            <View style={[styles.chipDot, { backgroundColor: isConnected ? Colors.teal : Colors.red }]} />
            <Text style={[styles.chipText, { color: isConnected ? Colors.teal : Colors.red }]}>
              {isConnected ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

<<<<<<< HEAD
        {/* ── SEARCH — toujours visible, désactivée hors ligne ── */}
        <View style={[styles.searchWrapper]}>
          <View style={[styles.searchBar, !isConnected && styles.searchDisabled]}>
            <Text style={styles.searchIcon}>🔍</Text>
            {isConnected ? (
              <TextInput
                style={styles.searchInput}
                placeholder="Search podcasts..."
                placeholderTextColor={Colors.t3}
                value={search}
                onChangeText={setSearch}
                selectionColor={Colors.acc}
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
        </View>

        {/* Bandeau hors ligne non bloquant */}
        {!isConnected && (
          <View style={styles.offlineNotice}>
            <Text style={styles.offlineNoticeText}>
              📡 Hors ligne — contenu non disponible
            </Text>
            <TouchableOpacity
              style={styles.libraryBtn}
              onPress={() => navigation.navigate('Library')}
              activeOpacity={0.8}
            >
              <Text style={styles.libraryBtnText}>📚 Go to Library</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── RÉSULTATS DE RECHERCHE ── */}
        {isConnected && isSearchMode && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {isSearching ? 'Searching…' : `Results (${searchResults.length})`}
              </Text>
            </View>
            {isSearching ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={Colors.acc} size="small" />
                <Text style={styles.loadingText}>Searching…</Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.noResult}>
                <Text style={styles.noResultText}>Aucun résultat trouvé</Text>
              </View>
            ) : (
              searchResults.map(podcast => (
                <PodcastHorizontalCard
                  key={podcast.id}
                  podcast={podcast}
                  onPress={() => navigation.navigate('Podcast', { podcast })}
                />
              ))
            )}
          </View>
        )}

        {/* ── RECOMMANDÉS (quand pas en mode recherche et en ligne) ── */}
        {isConnected && !isSearchMode && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended</Text>
            </View>
            {isLoadingRecommended ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={Colors.acc} size="small" />
                <Text style={styles.loadingText}>Loading…</Text>
              </View>
            ) : recommended.length === 0 ? (
              <View style={styles.noResult}>
                <Text style={styles.noResultText}>Aucun podcast trouvé</Text>
              </View>
            ) : (
              recommended.map(podcast => (
                <PodcastHorizontalCard
                  key={podcast.id}
                  podcast={podcast}
                  onPress={() => navigation.navigate('Podcast', { podcast })}
                />
              ))
            )}
          </View>
        )}

        {/* Placeholder visuel hors ligne */}
        {!isConnected && (
=======
        {/* ── OFFLINE BANNER ── */}
        {!isConnected && (
          <OfflineBanner onGoToLibrary={() => navigation.navigate('Library')} />
        )}

        {/* ── GO TO LIBRARY BUTTON (offline only) ── */}
        {!isConnected && (
          <TouchableOpacity
            style={styles.libraryBtn}
            onPress={() => navigation.navigate('Library')}
            activeOpacity={0.8}
          >
            <Text style={styles.libraryBtnText}>📚 Go to Library</Text>
          </TouchableOpacity>
        )}

        {/* ── POPULAR ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular</Text>
          {isConnected && (
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          )}
        </View>

        {isConnected ? (
          <FlatList
            horizontal
            data={podcasts.slice(0, 5)}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <PodcastVerticalCard podcast={item} onPress={() => handlePodcastPress(item)} />
            )}
            style={styles.horizontalList}
          />
        ) : (
          /* Greyed placeholder when offline */
          <View style={styles.placeholderRow}>
            {[0, 1, 2].map(i => (
              <View key={i} style={styles.placeholder} />
            ))}
          </View>
        )}

        <View style={styles.divider} />

        {/* ── RECOMMENDED ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended</Text>
        </View>

        {isConnected ? (
          podcasts.slice(0, 4).map(podcast => (
            <PodcastHorizontalCard
              key={podcast.id}
              podcast={podcast}
              onPress={() => handlePodcastPress(podcast)}
            />
          ))
        ) : (
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
          <View style={styles.offlinePlaceholder}>
            <View style={[styles.linePlaceholder, { marginBottom: 8 }]} />
            <View style={styles.linePlaceholder} />
          </View>
        )}
<<<<<<< HEAD

=======
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
      </ScrollView>

      <BottomNav
        active="Home"
        isConnected={isConnected}
        onPress={tab => navigation.navigate(tab)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingTop: 56 },

<<<<<<< HEAD
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 11, marginTop: 3 },

  searchWrapper: { marginBottom: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 10 },
  searchDisabled: { opacity: 0.45, borderColor: Colors.redBorder },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: Colors.text },
  searchPlaceholderDisabled: { flex: 1, fontSize: 13, color: Colors.t3 },
  clearBtn: { fontSize: 16, color: Colors.t3 },

=======
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 11, marginTop: 3 },

>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  chipOn: { backgroundColor: Colors.tealDim },
  chipOff: { backgroundColor: Colors.redDim },
  chipDot: { width: 5, height: 5, borderRadius: 3 },
  chipText: { fontSize: 10, fontWeight: '700' },

<<<<<<< HEAD
  offlineNotice: {
    backgroundColor: Colors.redDim, borderWidth: 1, borderColor: Colors.redBorder,
    borderRadius: 12, padding: 14, marginBottom: 16, gap: 10, alignItems: 'center',
  },
  offlineNoticeText: { fontSize: 12, color: Colors.red, fontWeight: '600', textAlign: 'center' },
  libraryBtn: {
    backgroundColor: Colors.s3, borderRadius: 100, borderWidth: 1,
    borderColor: Colors.border2, paddingVertical: 8, paddingHorizontal: 20,
  },
  libraryBtnText: { fontSize: 13, fontWeight: '700', color: Colors.text },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },

  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, backgroundColor: Colors.s2, borderRadius: 14, marginBottom: 16 },
  loadingText: { fontSize: 12, color: Colors.t2 },

  noResult: { backgroundColor: Colors.s2, borderRadius: 14, padding: 20, alignItems: 'center', marginBottom: 16 },
  noResultText: { fontSize: 13, color: Colors.t2 },

  sectionBlock: { marginBottom: 20 },

  offlinePlaceholder: { opacity: 0.2, marginTop: 12 },
=======
  libraryBtn: {
    backgroundColor: Colors.acc,
    borderRadius: 100,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: Colors.acc,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  libraryBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  seeAll: { fontSize: 11, color: Colors.acc, fontWeight: '600' },

  horizontalList: { marginBottom: 16 },

  placeholderRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  placeholder: { width: 96, height: 130, borderRadius: 16, backgroundColor: Colors.s3, opacity: 0.3 },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 16 },

  offlinePlaceholder: { opacity: 0.2 },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  linePlaceholder: { height: 48, backgroundColor: Colors.s3, borderRadius: 12 },
});
