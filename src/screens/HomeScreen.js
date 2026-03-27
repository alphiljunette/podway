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
import { mockPodcasts } from '../data/mockData';

export default function HomeScreen({ navigation }) {
  const { isConnected } = useNetwork();

  const handlePodcastPress = (podcast) => {
    navigation.navigate('Podcast', { podcast });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={[styles.sub, { color: isConnected ? Colors.t3 : Colors.red }]}>
              {isConnected ? 'Discover podcasts' : "You're offline"}
            </Text>
          </View>
          {/* Status chip */}
          <View style={[styles.chip, isConnected ? styles.chipOn : styles.chipOff]}>
            <View style={[styles.chipDot, { backgroundColor: isConnected ? Colors.teal : Colors.red }]} />
            <Text style={[styles.chipText, { color: isConnected ? Colors.teal : Colors.red }]}>
              {isConnected ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

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
            data={mockPodcasts.slice(0, 5)}
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
          mockPodcasts.slice(0, 4).map(podcast => (
            <PodcastHorizontalCard
              key={podcast.id}
              podcast={podcast}
              onPress={() => handlePodcastPress(podcast)}
            />
          ))
        ) : (
          <View style={styles.offlinePlaceholder}>
            <View style={[styles.linePlaceholder, { marginBottom: 8 }]} />
            <View style={styles.linePlaceholder} />
          </View>
        )}
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 11, marginTop: 3 },

  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  chipOn: { backgroundColor: Colors.tealDim },
  chipOff: { backgroundColor: Colors.redDim },
  chipDot: { width: 5, height: 5, borderRadius: 3 },
  chipText: { fontSize: 10, fontWeight: '700' },

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
  linePlaceholder: { height: 48, backgroundColor: Colors.s3, borderRadius: 12 },
});
