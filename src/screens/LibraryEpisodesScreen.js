<<<<<<< HEAD
// ─────────────────────────────────────────────────────
// screens/LibraryEpisodesScreen.js
// ─────────────────────────────────────────────────────
import React, { useMemo } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import EpisodeItem from '../components/EpisodeItem';
<<<<<<< HEAD
import { useAppContext } from '../context/AppContext';

export default function LibraryEpisodesScreen({ route, navigation }) {
  const { podcast } = route.params;
  const { getEpisodesForPodcast, removeDownload } = useAppContext();

  const episodes = useMemo(
    () => getEpisodesForPodcast(podcast.id),
    [getEpisodesForPodcast, podcast.id]
  );

  const podIdx      = (Number(podcast.id) - 1) % Colors.covers.length;
  const coverColors = Colors.covers[podIdx % Colors.covers.length];
  const emoji       = Colors.coverEmojis[podIdx % Colors.coverEmojis.length];
  const totalMB     = Math.round(episodes.reduce((acc, e) => acc + (e.fileSize || 0), 0) / 1024 / 1024 * 100) / 100;

  const handleDelete = async (episodeId) => {
    Alert.alert(
      'Supprimer l\'épisode',
      'Ceci supprimera le fichier téléchargé. Êtes-vous sûr ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeDownload(episodeId);
              const updated = episodes.filter(e => e.id !== episodeId);
              if (updated.length === 0) navigation.goBack();
            } catch {
              Alert.alert('Erreur', 'Échec de la suppression.');
=======
import { useNetwork } from '../services/NetworkManager';

export default function LibraryEpisodesScreen({ route, navigation }) {
  const { podcast, episodes: initialEpisodes } = route.params;
  const { isConnected } = useNetwork();
  const [episodes, setEpisodes] = useState(initialEpisodes);

  const podIdx = (podcast.id - 1) % Colors.covers.length;
  const coverColors = Colors.covers[podIdx];
  const emoji = Colors.coverEmojis[podIdx];
  const totalMB = episodes.reduce((acc, e) => acc + e.fileSize, 0);

  const handleDelete = (episodeId) => {
    Alert.alert(
      'Delete Episode',
      'This will remove the downloaded file. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = episodes.filter(e => e.id !== episodeId);
            setEpisodes(updated);
            if (updated.length === 0) {
              navigation.goBack(); // back to Library if no episodes left
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

<<<<<<< HEAD
=======
        {/* ── BACK + TITLE ── */}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle} numberOfLines={1}>{podcast.title}</Text>
        </View>

<<<<<<< HEAD
=======
        {/* ── PODCAST MINI CARD ── */}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
        <View style={styles.miniCard}>
          <LinearGradient colors={coverColors} style={styles.miniCover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.miniEmoji}>{emoji}</Text>
          </LinearGradient>
          <View>
            <Text style={styles.miniTitle}>{podcast.title}</Text>
            <Text style={styles.miniSub}>
<<<<<<< HEAD
              {episodes.length} épisode{episodes.length > 1 ? 's' : ''} · {totalMB} MB
=======
              {episodes.length} episode{episodes.length > 1 ? 's' : ''} · {totalMB} MB
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
            </Text>
          </View>
        </View>

<<<<<<< HEAD
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            📡 Mode hors ligne · Épisodes téléchargés disponibles sans internet
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Épisodes téléchargés</Text>

        {episodes.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun épisode téléchargé pour ce podcast.</Text>
=======
        {/* ── HINT OFFLINE ── */}
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            📡 Offline mode · Only downloaded episodes available
          </Text>
        </View>

        {/* ── EPISODES ── */}
        <Text style={styles.sectionTitle}>Downloaded Episodes</Text>

        {episodes.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No episodes downloaded for this podcast.</Text>
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
          </View>
        ) : (
          episodes.map((ep, i) => (
            <EpisodeItem
              key={ep.id}
              episode={ep}
              index={i}
              mode="library"
              downloaded={true}
              onPlay={() =>
                navigation.navigate('Player', {
                  episode: ep,
                  podcast,
<<<<<<< HEAD
                  playlist: episodes,
                  from: 'LibraryEpisodes',
=======
                  from: 'LibraryEpisodes', // contextual back navigation → Library
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
                })
              }
              onDelete={() => handleDelete(ep.id)}
              accentColor={Colors.teal}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 18, paddingTop: 56 },
<<<<<<< HEAD
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  backBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  backArrow: { fontSize: 15, color: Colors.text },
  pageTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, flex: 1 },
  miniCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 12, marginBottom: 14 },
  miniCover: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  miniEmoji: { fontSize: 18 },
  miniTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  miniSub: { fontSize: 10, color: Colors.t3, marginTop: 2 },
  hint: { backgroundColor: Colors.tealDim, borderWidth: 1, borderColor: Colors.tealBorder, borderRadius: 10, padding: 9, marginBottom: 14 },
  hintText: { fontSize: 11, fontWeight: '600', color: Colors.teal },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  empty: { backgroundColor: Colors.s2, borderRadius: 14, padding: 24, alignItems: 'center' },
=======

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 16,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.s3, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  backArrow: { fontSize: 15, color: Colors.text },
  pageTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, flex: 1 },

  miniCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 13, padding: 12, marginBottom: 14,
  },
  miniCover: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  miniEmoji: { fontSize: 18 },
  miniTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  miniSub: { fontSize: 10, color: Colors.t3, marginTop: 2 },

  hint: {
    backgroundColor: Colors.redDim, borderWidth: 1, borderColor: Colors.redBorder,
    borderRadius: 10, padding: 9, marginBottom: 14,
  },
  hintText: { fontSize: 11, fontWeight: '600', color: Colors.red },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 6 },

  empty: {
    backgroundColor: Colors.s2, borderRadius: 14,
    padding: 24, alignItems: 'center',
  },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  emptyText: { fontSize: 13, color: Colors.t2, textAlign: 'center' },
});
