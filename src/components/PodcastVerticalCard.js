import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';

export default function PodcastVerticalCard({ podcast, onPress }) {
  const idx = (podcast.id - 1) % Colors.covers.length;
  const colors = Colors.covers[idx];
  const emoji = Colors.coverEmojis[idx];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient colors={colors} style={styles.cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={styles.emoji}>{emoji}</Text>
      </LinearGradient>
      <Text style={styles.title} numberOfLines={1}>{podcast.title}</Text>
      <Text style={styles.sub}>{podcast.episodeCount} eps</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
