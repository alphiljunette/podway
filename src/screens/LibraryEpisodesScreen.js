import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import EpisodeItem from '../components/EpisodeItem';
import { useNetwork } from '../services/NetworkManager';

export default function LibraryEpisodesScreen({ route, navigation }) {
  const { podcast, episodes: initialEpisodes } = route.params;
  const { isConnected } = useNetwork();
  const [episodes, setEpisodes] = useState(initialEpisodes);

  const podIdx = (podcast.id - 1) % Colors.covers.length;
  const coverColors = Colors.covers[podIdx];
  const emoji = Colors.coverEmojis[podIdx];
  const totalMB = episodes.reduce((acc, e) => acc + e.fileSize, 0);

  const handleDelete = (episodeId) => {
    Alert.alert(
      'Delete Episode',
      'This will remove the downloaded file. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = episodes.filter(e => e.id !== episodeId);
            setEpisodes(updated);
            if (updated.length === 0) {
              navigation.goBack(); // back to Library if no episodes left
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── BACK + TITLE ── */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle} numberOfLines={1}>{podcast.title}</Text>
        </View>

        {/* ── PODCAST MINI CARD ── */}
        <View style={styles.miniCard}>
          <LinearGradient colors={coverColors} style={styles.miniCover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.miniEmoji}>{emoji}</Text>
          </LinearGradient>
          <View>
            <Text style={styles.miniTitle}>{podcast.title}</Text>
            <Text style={styles.miniSub}>
              {episodes.length} episode{episodes.length > 1 ? 's' : ''} · {totalMB} MB
            </Text>
          </View>
        </View>

        {/* ── HINT OFFLINE ── */}
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            📡 Offline mode · Only downloaded episodes available
          </Text>
        </View>

        {/* ── EPISODES ── */}
        <Text style={styles.sectionTitle}>Downloaded Episodes</Text>

        {episodes.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No episodes downloaded for this podcast.</Text>
          </View>
        ) : (
          episodes.map((ep, i) => (
            <EpisodeItem
              key={ep.id}
              episode={ep}
              index={i}
              mode="library"
              downloaded={true}
              onPlay={() =>
                navigation.navigate('Player', {
                  episode: ep,
                  podcast,
                  from: 'LibraryEpisodes', // contextual back navigation → Library
                })
              }
              onDelete={() => handleDelete(ep.id)}
              accentColor={Colors.teal}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 18, paddingTop: 56 },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 16,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  backArrow: { fontSize: 15, color: Colors.text },
  pageTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, flex: 1 },

  miniCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 13, padding: 12, marginBottom: 14,
  },
  miniCover: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  miniEmoji: { fontSize: 18 },
  miniTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  miniSub: { fontSize: 10, color: Colors.t3, marginTop: 2 },

  hint: {
    backgroundColor: Colors.redDim, borderWidth: 1, borderColor: Colors.redBorder,
    borderRadius: 10, padding: 9, marginBottom: 14,
  },
  hintText: { fontSize: 11, fontWeight: '600', color: Colors.red },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 6 },

  empty: {
    backgroundColor: Colors.s2, borderRadius: 14,
    padding: 24, alignItems: 'center',
  },
  emptyText: { fontSize: 13, color: Colors.t2, textAlign: 'center' },
});
