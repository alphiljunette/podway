import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';

<<<<<<< HEAD
function getColorIndex(id) {
  if (typeof id === 'number') return Math.abs(id) % Colors.covers.length;
  return 0;
}

export default function PodcastVerticalCard({ podcast, onPress }) {
  const idx    = getColorIndex(podcast.id);
  const colors = Colors.covers[idx];
  const emoji  = Colors.coverEmojis[idx];
=======
export default function PodcastVerticalCard({ podcast, onPress }) {
  const idx = (podcast.id - 1) % Colors.covers.length;
  const colors = Colors.covers[idx];
  const emoji = Colors.coverEmojis[idx];
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient colors={colors} style={styles.cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={styles.emoji}>{emoji}</Text>
      </LinearGradient>
      <Text style={styles.title} numberOfLines={1}>{podcast.title}</Text>
<<<<<<< HEAD
      <Text style={styles.sub}>{podcast.episodeCount || '?'} eps</Text>
=======
      <Text style={styles.sub}>{podcast.episodeCount} eps</Text>
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  card: { width: 96, marginRight: 12 },
  cover: { width: 96, height: 96, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 30 },
  title: { fontSize: 11, fontWeight: '600', color: Colors.text, marginTop: 7 },
  sub: { fontSize: 10, color: Colors.t3, marginTop: 2 },
=======
  card: {
    width: 96,
    marginRight: 12,
  },
  cover: {
    width: 96,
    height: 96,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 30,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 7,
  },
  sub: {
    fontSize: 10,
    color: Colors.t3,
    marginTop: 2,
  },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
});
