import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';

export const CATEGORY_COLORS = {
  'Tech':        { bg: 'rgba(108,99,255,0.18)', text: '#a29bff', border: 'rgba(108,99,255,0.35)' },
  'Science':     { bg: 'rgba(0,229,195,0.15)',  text: '#00e5c3', border: 'rgba(0,229,195,0.3)'  },
  'Society':     { bg: 'rgba(253,174,68,0.18)', text: '#fdae44', border: 'rgba(253,174,68,0.35)' },
  'Culture':     { bg: 'rgba(255,101,132,0.18)',text: '#ff6584', border: 'rgba(255,101,132,0.35)' },
  'Business':    { bg: 'rgba(52,211,153,0.18)', text: '#34d399', border: 'rgba(52,211,153,0.35)' },
  'Health':      { bg: 'rgba(251,113,133,0.18)',text: '#fb7185', border: 'rgba(251,113,133,0.35)' },
  'Education':   { bg: 'rgba(96,165,250,0.18)', text: '#60a5fa', border: 'rgba(96,165,250,0.35)'  },
  'Sports':      { bg: 'rgba(251,191,36,0.18)', text: '#fbbf24', border: 'rgba(251,191,36,0.35)'  },
  'Comedy':      { bg: 'rgba(167,139,250,0.18)',text: '#a78bfa', border: 'rgba(167,139,250,0.35)' },
  'News':        { bg: 'rgba(248,113,113,0.18)',text: '#f87171', border: 'rgba(248,113,113,0.35)' },
  'History':     { bg: 'rgba(180,120,50,0.18)', text: '#d4a46a', border: 'rgba(180,120,50,0.35)'  },
  'True Crime':  { bg: 'rgba(100,100,130,0.25)',text: '#9ca3af', border: 'rgba(100,100,130,0.4)'  },
  'Music':       { bg: 'rgba(236,72,153,0.18)', text: '#ec4899', border: 'rgba(236,72,153,0.35)'  },
  'Arts':        { bg: 'rgba(245,158,11,0.18)', text: '#f59e0b', border: 'rgba(245,158,11,0.35)'  },
  'Religion':    { bg: 'rgba(167,139,250,0.15)',text: '#c4b5fd', border: 'rgba(167,139,250,0.3)'  },
  'Other':       { bg: 'rgba(100,100,100,0.18)',text: '#9ca3af', border: 'rgba(100,100,100,0.3)'  },
};

export function getCategoryStyle(category) {
  if (!category) return CATEGORY_COLORS['Other'];
  const key = Object.keys(CATEGORY_COLORS).find(k =>
    category.toLowerCase().includes(k.toLowerCase())
  );
  return CATEGORY_COLORS[key] || CATEGORY_COLORS['Other'];
}

function getColorIndex(id) {
  if (typeof id === 'number') return Math.abs(id) % Colors.covers.length;
  if (typeof id === 'string') {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
    return Math.abs(hash) % Colors.covers.length;
  }
  return 0;
}

export default function PodcastHorizontalCard({ podcast, onPress, badge, showArrow = true }) {
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
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{podcast.title}</Text>
        <Text style={styles.sub} numberOfLines={1}>
          {badge
            ? `🔥 ${badge} · ${podcast.author}`
            : `⭐ ${podcast.rating || '?'} · ${podcast.episodeCount || '?'} eps`}
        </Text>
        {podcast.category ? (
          <View style={[styles.catBadge, { backgroundColor: catStyle.bg, borderColor: catStyle.border }]}>
            <Text style={[styles.catBadgeText, { color: catStyle.text }]}>{podcast.category}</Text>
          </View>
        ) : null}
      </View>
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Colors.border },
  cover: { width: 54, height: 54, borderRadius: 12, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  info: { flex: 1, minWidth: 0, gap: 2 },
  title: { fontSize: 12, fontWeight: '600', color: Colors.text },
  sub: { fontSize: 10, color: Colors.t3 },
  catBadge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 100, paddingHorizontal: 7, paddingVertical: 2, marginTop: 3 },
  catBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  arrow: { fontSize: 18, color: Colors.t3 },
});
