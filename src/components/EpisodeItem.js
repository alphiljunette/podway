import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

// mode: 'online' | 'library'
<<<<<<< HEAD
=======
// online   → ▶ Play  +  ⬇ Download (or ✓ if done)
// library  → ▶ Play  +  🗑 Delete
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
export default function EpisodeItem({
  episode,
  index,
  mode = 'online',
  downloaded = false,
<<<<<<< HEAD
  downloadStatus = 'none',
  hasAudio = true,
=======
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  onPlay,
  onDownload,
  onDelete,
  accentColor,
}) {
<<<<<<< HEAD
  const isDownloading = downloadStatus === 'downloading';
  const numBg    = accentColor ? { backgroundColor: accentColor + '22' } : { backgroundColor: Colors.s3 };
  const numColor = accentColor || Colors.t3;
  const canPlay  = downloaded || hasAudio;
=======
  const numBg = accentColor
    ? { backgroundColor: accentColor + '22' }
    : { backgroundColor: Colors.s3 };
  const numColor = accentColor || Colors.t3;
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

  return (
    <View style={styles.row}>
      {/* Number */}
      <View style={[styles.num, numBg]}>
        <Text style={[styles.numText, { color: numColor }]}>{index + 1}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
<<<<<<< HEAD
        <Text style={styles.title} numberOfLines={2}>{episode.title}</Text>
        <Text style={styles.sub}>
          {episode.duration} min
          {mode === 'library' ? ` · ${Math.round((episode.fileSize || 0) / 1024 / 1024 * 100) / 100} MB · Téléchargé ✓` : ''}
          {!hasAudio && !downloaded ? ' · Audio indisponible' : ''}
=======
        <Text style={styles.title} numberOfLines={1}>{episode.title}</Text>
        <Text style={styles.sub}>
          {episode.duration} min
          {mode === 'library' ? ` · ${episode.fileSize} MB · Downloaded ✓` : ''}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {mode === 'online' ? (
          <>
<<<<<<< HEAD
            {/* Play */}
            <TouchableOpacity
              style={[styles.ab, styles.abPlay, !canPlay && { opacity: 0.35 }]}
              onPress={canPlay ? onPlay : undefined}
              activeOpacity={canPlay ? 0.7 : 1}
            >
              <Text style={[styles.abText, { color: Colors.teal }]}>▶</Text>
            </TouchableOpacity>

            {/* Download */}
            <TouchableOpacity
              style={[
                styles.ab,
                downloaded ? styles.abDlDone : isDownloading ? styles.abDownloading : styles.abDl,
                (!hasAudio && !downloaded) && { opacity: 0.35 },
              ]}
              onPress={(!hasAudio && !downloaded) ? undefined : onDownload}
              activeOpacity={(isDownloading || (!hasAudio && !downloaded)) ? 1 : 0.7}
              disabled={isDownloading || (!hasAudio && !downloaded)}
            >
              <Text style={[styles.abText, { color: downloaded || isDownloading ? '#fff' : Colors.acc }]}>
                {downloaded ? '✓' : isDownloading ? '…' : '⬇'}
=======
            {/* Play button — always visible online */}
            <TouchableOpacity style={[styles.ab, styles.abPlay]} onPress={onPlay} activeOpacity={0.7}>
              <Text style={[styles.abText, { color: Colors.teal }]}>▶</Text>
            </TouchableOpacity>

            {/* Download button */}
            <TouchableOpacity
              style={[styles.ab, downloaded ? styles.abDlDone : styles.abDl]}
              onPress={onDownload}
              activeOpacity={0.7}
            >
              <Text style={[styles.abText, { color: downloaded ? '#fff' : Colors.acc }]}>
                {downloaded ? '✓' : '⬇'}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
<<<<<<< HEAD
            {/* Play — library */}
=======
            {/* Play button — library */}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
            <TouchableOpacity style={[styles.ab, styles.abPlay]} onPress={onPlay} activeOpacity={0.7}>
              <Text style={[styles.abText, { color: Colors.teal }]}>▶</Text>
            </TouchableOpacity>

<<<<<<< HEAD
            {/* Delete */}
=======
            {/* Delete button */}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
            <TouchableOpacity style={[styles.ab, styles.abDel]} onPress={onDelete} activeOpacity={0.7}>
              <Text style={styles.abText}>🗑</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Colors.border },
  num: { width: 27, height: 27, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  numText: { fontSize: 10, fontWeight: '700' },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 11, fontWeight: '600', color: Colors.text },
  sub: { fontSize: 10, color: Colors.t3, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 5, alignItems: 'center', flexShrink: 0 },
  ab: { width: 27, height: 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  abText: { fontSize: 11 },
  abPlay: { borderColor: Colors.teal, backgroundColor: Colors.tealDim },
  abDl: { borderColor: Colors.acc, backgroundColor: Colors.accDim },
  abDownloading: { borderColor: Colors.acc, backgroundColor: Colors.acc },
  abDlDone: { borderColor: Colors.acc, backgroundColor: Colors.acc },
  abDel: { borderColor: Colors.redBorder, backgroundColor: Colors.redDim },
=======
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  num: {
    width: 27,
    height: 27,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numText: {
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },
  sub: {
    fontSize: 10,
    color: Colors.t3,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    flexShrink: 0,
  },
  ab: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  abText: {
    fontSize: 11,
  },
  abPlay: {
    borderColor: Colors.teal,
    backgroundColor: Colors.tealDim,
  },
  abDl: {
    borderColor: Colors.acc,
    backgroundColor: Colors.accDim,
  },
  abDlDone: {
    borderColor: Colors.acc,
    backgroundColor: Colors.acc,
  },
  abDel: {
    borderColor: Colors.redBorder,
    backgroundColor: Colors.redDim,
  },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
});
