import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import EpisodeItem from '../components/EpisodeItem';
import { episodes as allEpisodes } from '../data/mockData';

export default function PodcastScreen({ route, navigation }) {
  const { podcast } = route.params;
  const [downloadedIds, setDownloadedIds] = useState([101]); // ep 101 pre-downloaded for demo

  const episodes = allEpisodes.filter(e => e.podcastId === podcast.id);
  const idx = (podcast.id - 1) % Colors.covers.length;
  const coverColors = Colors.covers[idx];
  const emoji = Colors.coverEmojis[idx];

  const toggleDownload = (epId) => {
    setDownloadedIds(prev =>
      prev.includes(epId) ? prev.filter(id => id !== epId) : [...prev, epId]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── COVER HEADER ── */}
        <View style={styles.coverWrap}>
          <LinearGradient colors={coverColors} style={styles.coverBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.coverEmoji}>{emoji}</Text>
          </LinearGradient>
          {/* Fade to bg */}
          <LinearGradient
            colors={['transparent', Colors.bg]}
            style={styles.coverFade}
          />
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title & author */}
          <Text style={styles.podTitle}>{podcast.title}</Text>
          <Text style={styles.podAuthor}>by {podcast.author} · {podcast.category}</Text>
          <Text style={styles.podDesc}>{podcast.description}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{episodes.length}</Text>
              <Text style={styles.statLbl}>Episodes</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: Colors.gold }]}>⭐ {podcast.rating}</Text>
              <Text style={styles.statLbl}>Rating</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>~{podcast.avgDuration}m</Text>
              <Text style={styles.statLbl}>Avg dur.</Text>
            </View>
          </View>

          {/* Hint */}
          <View style={styles.hint}>
            <Text style={styles.hintText}>💡 ▶ Stream now · ⬇ Save for offline listening</Text>
          </View>

          {/* Episodes */}
          <Text style={styles.sectionTitle}>Episodes</Text>

          {episodes.length === 0 ? (
            <View style={styles.noEpisodes}>
              <Text style={styles.noEpisodesText}>No episodes available</Text>
            </View>
          ) : (
            episodes.map((ep, i) => (
              <EpisodeItem
                key={ep.id}
                episode={ep}
                index={i}
                mode="online"
                downloaded={downloadedIds.includes(ep.id)}
                onPlay={() => navigation.navigate('Player', {
                  episode: ep,
                  podcast,
                  from: 'PodcastScreen', // contextual back navigation
                })}
                onDownload={() => toggleDownload(ep.id)}
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

  coverWrap: { height: 180, position: 'relative', overflow: 'hidden' },
  coverBg: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', opacity: 0.7 },
  coverEmoji: { fontSize: 80 },
  coverFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 80 },
  backBtn: {
    position: 'absolute', top: 50, left: 14,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1, borderColor: Colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 15, color: Colors.text },

  content: { padding: 18, marginTop: -10 },

  podTitle: { fontSize: 19, fontWeight: '800', color: Colors.text },
  podAuthor: { fontSize: 11, color: Colors.t2, marginTop: 4 },
  podDesc: { fontSize: 12, color: Colors.t2, marginTop: 8, lineHeight: 18 },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14, padding: 12, marginTop: 14,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 15, fontWeight: '800', color: Colors.acc },
  statLbl: { fontSize: 9, color: Colors.t3, textTransform: 'uppercase', letterSpacing: 0.5 },
  statSep: { width: 1, height: 26, backgroundColor: Colors.border },

  hint: {
    backgroundColor: Colors.tealDim, borderWidth: 1, borderColor: Colors.tealBorder,
    borderRadius: 10, padding: 9, marginTop: 12, marginBottom: 14,
  },
  hintText: { fontSize: 11, fontWeight: '600', color: Colors.teal },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 6 },

  noEpisodes: {
    backgroundColor: Colors.s2, borderRadius: 14,
    padding: 24, alignItems: 'center',
  },
  noEpisodesText: { fontSize: 13, color: Colors.t2 },
});
