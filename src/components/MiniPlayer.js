// ─────────────────────────────────────────────────────
// components/MiniPlayer.js
// Barre de lecture persistante affichée en bas des écrans
// ─────────────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { usePlayer } from '../context/PlayerContext';

export default function MiniPlayer({ navigation, onOpen, onClose, style }) {
  const player = usePlayer();

  // Ne rien afficher s'il n'y a pas d'épisode en cours
  if (!player.currentEpisode) return null;

  const handleOpen = () => {
    if (onOpen) {
      onOpen();
      return;
    }
    if (!navigation) return;
    navigation.navigate('Player', {
      episode: player.currentEpisode,
      podcast: player.currentPodcast,
      playlist: player.playlist,
      from: 'MiniPlayer',
    });
  };

  const progressPct = Math.min(100, player.progress * 100);

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handleOpen} activeOpacity={0.92}>
      {/* Barre de progression */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      <View style={styles.row}>
        {/* Cover emoji */}
        <View style={styles.cover}>
          <Text style={styles.coverEmoji}>🎙</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{player.currentEpisode.title}</Text>
          <Text style={styles.sub} numberOfLines={1}>
            {player.currentPodcast?.title} · {player.fmt(player.positionMs)}
          </Text>
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

          {/* Bouton fermer */}
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
  progressBar: {
    height: 2,
    backgroundColor: Colors.s4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.acc,
    borderRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  cover: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.accDim,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  coverEmoji: { fontSize: 18 },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 12, fontWeight: '700', color: Colors.text },
  sub: { fontSize: 10, color: Colors.t3, marginTop: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  btn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  btnIcon: { fontSize: 12, color: Colors.text },
  btnPlay: {
    backgroundColor: Colors.acc,
    borderColor: Colors.acc,
    width: 34, height: 34, borderRadius: 17,
  },
  btnPlayIcon: { fontSize: 14, color: '#fff' },
  btnClose: {
    backgroundColor: Colors.redDim,
    borderColor: Colors.redBorder,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  btnCloseIcon: { fontSize: 10, color: Colors.red },
});
