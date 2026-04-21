import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

const TABS = [
  { name: 'Home',    icon: '🏠', label: 'Home'    },
  { name: 'Explore', icon: '🔍', label: 'Explore' },
  { name: 'Library', icon: '📚', label: 'Library' },
];

export default function BottomNav({ active, onPress, isConnected }) {
  return (
    <View style={styles.nav}>
      {TABS.map(tab => {
        const isActive = active === tab.name;
        // Home & Explore are always accessible — no offline lock
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.item}
            onPress={() => onPress(tab.name)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && (
              <View style={[
                styles.dot,
                { backgroundColor: !isConnected ? Colors.red : Colors.acc },
              ]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15,15,26,0.97)',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 20,
    paddingTop: 8,
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  icon: { fontSize: 20, opacity: 0.3 },
  iconActive: { opacity: 1 },
  label: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, color: Colors.t3 },
  labelActive: { color: Colors.acc },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 1 },
});
