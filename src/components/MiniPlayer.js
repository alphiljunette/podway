// ─────────────────────────────────────────────────────
// components/MiniPlayer.js
// ─────────────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import { usePlayer } from '../context/PlayerContext';

const CATEGORY_COLORS = {
  'Tech':       { bg: 'rgba(108,99,255,0.22)', text: '#9b94ff', border: 'rgba(108,99,255,0.4)' },
  'Science':    { bg: 'rgba(0,229,195,0.18)',  text: '#00e5c3', border: 'rgba(0,229,195,0.35)' },
  'Society':    { bg: 'rgba(59,130,246,0.22)', text: '#60a5fa', border: 'rgba(59,130,246,0.4)' },
  'Culture':    { bg: 'rgba(168,85,247,0.22)', text: '#c084fc', border: 'rgba(168,85,247,0.4)' },
  'Business':   { bg: 'rgba(255,181,71,0.22)', text: '#ffb547', border: 'rgba(255,181,71,0.4)' },
  'Health':     { bg: 'rgba(34,197,94,0.22)',  text: '#4ade80', border: 'rgba(34,197,94,0.4)'  },
  'History':    { bg: 'rgba(249,115,22,0.22)', text: '#fb923c', border: 'rgba(249,115,22,0.4)' },
  'Comedy':     { bg: 'rgba(236,72,153,0.22)', text: '#f472b6', border: 'rgba(236,72,153,0.4)' },
  'True Crime': { bg: 'rgba(255,79,110,0.22)', text: '#ff4f6e', border: 'rgba(255,79,110,0.4)' },
  'Sports':     { bg: 'rgba(20,184,166,0.22)', text: '#2dd4bf', border: 'rgba(20,184,166,0.4)' },
  'Education':  { bg: 'rgba(99,102,241,0.22)', text: '#818cf8', border: 'rgba(99,102,241,0.4)' },
};
const DEFAULT_CAT = { bg: 'rgba(136,136,170,0.18)', text: '#8888aa', border: 'rgba(136,136,170,0.35)' };

export default function MiniPlayer({ navigation, onOpen, onClose, style }) {
  const player = usePlayer();
  const [imgError, setImgError] = React.useState(false);

  if (!player.currentEpisode) return null;

  const handleOpen = () => {
    if (onOpen) { onOpen(); return; }
    if (!navigation) return;
    navigation.navigate('Player', {
      episode: player.currentEpisode,
      podcast: player.currentPodcast,
      playlist: player.playlist,
      from: 'MiniPlayer',
    });
  };

  const progressPct = Math.min(100, player.progress * 100);
  const pod = player.currentPodcast;
  const podIdx = pod ? (Number(pod.id) - 1) % Colors.covers.length : 0;
  const coverColors = Colors.covers[podIdx];
  const emoji = Colors.coverEmojis[podIdx];
  const showRealImage = pod?.imageUrl && !imgError;
  const catStyle = CATEGORY_COLORS[pod?.category] || DEFAULT_CAT;

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handleOpen} activeOpacity={0.92}>
      {/* Barre de progression */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      <View style={styles.row}>
        {/* Cover — vraie image ou gradient */}
        {showRealImage ? (
          <Image
            source={{ uri: pod.imageUrl }}
            style={styles.cover}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <LinearGradient colors={coverColors} style={styles.cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.coverEmoji}>{emoji}</Text>
          </LinearGradient>
        )}

        {/* Info + badge catégorie */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{player.currentEpisode.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.sub} numberOfLines={1}>
              {pod?.title} · {player.fmt(player.positionMs)}
            </Text>
            {pod?.category && (
              <View style={[styles.catBadge, { backgroundColor: catStyle.bg, borderColor: catStyle.border }]}>
                <Text style={[styles.catBadgeText, { color: catStyle.text }]}>{pod.category}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Contrôles */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.btn}
            onPress={(e) => { e.stopPropagation(); player.playPrev(); }}
            activeOpacity={0.7}
          >
            <Text style={styles.btnIcon}>⏮</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnPlay]}
            onPress={(e) => { e.stopPropagation(); player.togglePlayback(); }}
            disabled={player.isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.btnPlayIcon}>
              {player.isLoading ? '…' : player.isPlaying ? '⏸' : '▶'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={(e) => { e.stopPropagation(); player.playNext(); }}
            activeOpacity={0.7}
          >
            <Text style={styles.btnIcon}>⏭</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnClose]}
            onPress={(e) => { e.stopPropagation(); player.stop(); onClose?.(); }}
            activeOpacity={0.7}
          >
            <Text style={styles.btnCloseIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.s2,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderRadius: 0,
  },
  progressBar: { height: 2, backgroundColor: Colors.s4 },
  progressFill: { height: '100%', backgroundColor: Colors.acc, borderRadius: 2 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  cover: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: Colors.accDim,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, overflow: 'hidden',
  },
  coverEmoji: { fontSize: 18 },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 12, fontWeight: '700', color: Colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'nowrap' },
  sub: { fontSize: 10, color: Colors.t3, flexShrink: 1 },
  catBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 100, borderWidth: 1, flexShrink: 0 },
  catBadgeText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.3 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  btn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  btnIcon: { fontSize: 12, color: Colors.text },
  btnPlay: { backgroundColor: Colors.acc, borderColor: Colors.acc, width: 34, height: 34, borderRadius: 17 },
  btnPlayIcon: { fontSize: 14, color: '#fff' },
  btnClose: { backgroundColor: Colors.redDim, borderColor: Colors.redBorder, width: 24, height: 24, borderRadius: 12 },
  btnCloseIcon: { fontSize: 10, color: Colors.red },
});
