import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';

<<<<<<< HEAD
function getColorIndex(id) {
  // Works for both small integers (mock) and large iTunes IDs
  if (typeof id === 'number') {
    return Math.abs(id) % Colors.covers.length;
  }
  return 0;
}

export default function PodcastHorizontalCard({ podcast, onPress, badge, showArrow = true }) {
  const idx   = getColorIndex(podcast.id);
  const colors = Colors.covers[idx];
  const emoji  = Colors.coverEmojis[idx];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {podcast.imageUrl ? (
        // If real image available, show colored bg + emoji fallback
        <LinearGradient colors={colors} style={styles.cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.emoji}>{emoji}</Text>
        </LinearGradient>
      ) : (
        <LinearGradient colors={colors} style={styles.cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.emoji}>{emoji}</Text>
        </LinearGradient>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{podcast.title}</Text>
        <Text style={styles.sub} numberOfLines={1}>
          {badge
            ? `🔥 ${badge} · ${podcast.author}`
            : `⭐ ${podcast.rating || '?'} · ${podcast.episodeCount || '?'} eps`}
=======
export default function PodcastHorizontalCard({ podcast, onPress, badge, showArrow = true }) {
  const idx = (podcast.id - 1) % Colors.covers.length;
  const colors = Colors.covers[idx];
  const emoji = Colors.coverEmojis[idx];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient colors={colors} style={styles.cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={styles.emoji}>{emoji}</Text>
      </LinearGradient>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{podcast.title}</Text>
        <Text style={styles.sub} numberOfLines={1}>
          {badge ? `🔥 ${badge} · ${podcast.author}` : `⭐ ${podcast.rating} · ${podcast.episodeCount} eps`}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
        </Text>
      </View>
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  card: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Colors.border },
  cover: { width: 48, height: 48, borderRadius: 12, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 12, fontWeight: '600', color: Colors.text },
  sub: { fontSize: 10, color: Colors.t3, marginTop: 2 },
  arrow: { fontSize: 18, color: Colors.t3 },
=======
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 12,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  sub: {
    fontSize: 10,
    color: Colors.t3,
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    color: Colors.t3,
  },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
});
