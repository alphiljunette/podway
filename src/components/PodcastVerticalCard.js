import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import { getCategoryStyle } from './PodcastHorizontalCard';

function getColorIndex(id) {
  if (typeof id === 'number') return Math.abs(id) % Colors.covers.length;
  if (typeof id === 'string') {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
    return Math.abs(hash) % Colors.covers.length;
  }
  return 0;
}

export default function PodcastVerticalCard({ podcast, onPress }) {
  const idx    = getColorIndex(podcast.id);
  const colors = Colors.covers[idx];
  const emoji  = Colors.coverEmojis[idx];
  const catStyle = getCategoryStyle(podcast.category);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {podcast.imageUrl ? (
        <Image source={{ uri: podcast.imageUrl }} style={styles.cover} />
      ) : (
        <LinearGradient colors={colors} style={styles.cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.emoji}>{emoji}</Text>
        </LinearGradient>
      )}
      {podcast.category ? (
        <View style={[styles.catBadge, { backgroundColor: catStyle.bg, borderColor: catStyle.border }]}>
          <Text style={[styles.catBadgeText, { color: catStyle.text }]}>{podcast.category}</Text>
        </View>
      ) : null}
      <Text style={styles.title} numberOfLines={1}>{podcast.title}</Text>
      <Text style={styles.sub}>{podcast.episodeCount || '?'} eps</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 100, marginRight: 12 },
  cover: { width: 100, height: 100, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 30 },
  catBadge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 100, paddingHorizontal: 6, paddingVertical: 2, marginTop: 5 },
  catBadgeText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.3 },
  title: { fontSize: 11, fontWeight: '600', color: Colors.text, marginTop: 4 },
  sub: { fontSize: 10, color: Colors.t3, marginTop: 1 },
});
