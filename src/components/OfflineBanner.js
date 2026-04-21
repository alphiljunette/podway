import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default function OfflineBanner({ onGoToLibrary }) {
  return (
    <View style={styles.banner}>
      <Text style={styles.emoji}>📡</Text>
      <View style={styles.textWrap}>
        <Text style={styles.title}>No internet connection</Text>
        <Text style={styles.sub}>
          Podcasts won't load. Check your Library to listen to downloaded episodes.
        </Text>
      </View>
      {onGoToLibrary && (
        <TouchableOpacity onPress={onGoToLibrary} style={styles.btn} activeOpacity={0.8}>
          <Text style={styles.btnText}>📚 Library</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(255,79,110,0.08)',
    borderWidth: 1,
    borderColor: Colors.redBorder,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  emoji: {
    fontSize: 18,
    flexShrink: 0,
    marginTop: 1,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.red,
  },
  sub: {
    fontSize: 10,
    color: Colors.t3,
    marginTop: 3,
    lineHeight: 15,
  },
  btn: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: Colors.accDim,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.3)',
  },
  btnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.acc,
  },
});
