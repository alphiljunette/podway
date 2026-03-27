import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

// mode: 'online' | 'library'
// online   → ▶ Play  +  ⬇ Download (or ✓ if done)
// library  → ▶ Play  +  🗑 Delete
export default function EpisodeItem({
  episode,
  index,
  mode = 'online',
  downloaded = false,
  onPlay,
  onDownload,
  onDelete,
  accentColor,
}) {
  const numBg = accentColor
    ? { backgroundColor: accentColor + '22' }
    : { backgroundColor: Colors.s3 };
  const numColor = accentColor || Colors.t3;

  return (
    <View style={styles.row}>
      {/* Number */}
      <View style={[styles.num, numBg]}>
        <Text style={[styles.numText, { color: numColor }]}>{index + 1}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{episode.title}</Text>
        <Text style={styles.sub}>
          {episode.duration} min
          {mode === 'library' ? ` · ${episode.fileSize} MB · Downloaded ✓` : ''}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {mode === 'online' ? (
          <>
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
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Play button — library */}
            <TouchableOpacity style={[styles.ab, styles.abPlay]} onPress={onPlay} activeOpacity={0.7}>
              <Text style={[styles.abText, { color: Colors.teal }]}>▶</Text>
            </TouchableOpacity>

            {/* Delete button */}
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
});
