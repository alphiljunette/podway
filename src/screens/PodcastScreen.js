<<<<<<< HEAD
// ─────────────────────────────────────────────────────
// screens/PodcastScreen.js
// ─────────────────────────────────────────────────────
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Alert, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import Colors from '../constants/colors';
import EpisodeItem from '../components/EpisodeItem';
import { useNetwork } from '../services/NetworkManagerHook';
import { useAppContext } from '../context/AppContext';
import PodcastSearchService from '../services/PodcastSearchService';
import { episodes as mockEpisodes } from '../data/mockData';

export default function PodcastScreen({ route, navigation }) {
  const { podcast } = route.params;
  const { isConnected } = useNetwork();
  const { getIsDownloaded, getDownloadStatus, getDownloadedUri, downloadEpisode } = useAppContext();

  const [episodes, setEpisodes]                   = useState([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(true);

  // ── Download All state ──────────────────────────────
  const [isDownloadingAll, setIsDownloadingAll]       = useState(false);
  const [downloadAllProgress, setDownloadAllProgress] = useState(0);
  const [downloadAllCurrent, setDownloadAllCurrent]   = useState(0);
  const [downloadAllTotal, setDownloadAllTotal]       = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cancelRef    = useRef(false);

  const isMockPodcast = typeof podcast.id === 'number' && podcast.id <= 6;

  useEffect(() => { loadEpisodes(); }, [podcast.id]);

  const loadEpisodes = async () => {
    setIsLoadingEpisodes(true);
    try {
      if (isMockPodcast) {
        const mockEps = mockEpisodes.filter(e => e.podcastId === podcast.id);
        setEpisodes(mockEps);
      } else {
        const realEpisodes = await PodcastSearchService.getPodcastEpisodes(podcast.id);
        setEpisodes(realEpisodes);
      }
    } catch (error) {
      console.warn('Failed to load episodes:', error);
      setEpisodes([]);
    } finally {
      setIsLoadingEpisodes(false);
    }
  };

  const podIdx      = (Number(podcast.id) - 1) % Colors.covers.length;
  const coverColors = Colors.covers[podIdx % Colors.covers.length];
  const emoji       = Colors.coverEmojis[podIdx % Colors.coverEmojis.length];

  const handlePlay = (episode) => {
    const localUri = getDownloadedUri(episode.id);
    const audioUri = localUri || episode.audioUrl || episode.episodeUrl || episode.previewUrl || null;
    if (!audioUri) {
      Alert.alert('Audio indisponible', "Cet épisode n'a pas d'URL audio accessible.", [{ text: 'OK' }]);
      return;
    }
    const playableEpisode = localUri ? { ...episode, _resolvedUri: localUri } : episode;
    navigation.navigate('Player', { episode: playableEpisode, podcast, playlist: episodes, from: 'Podcast' });
  };

  const handleDownload = async (episode) => {
    if (!isConnected) {
      Alert.alert('Hors ligne', 'Connectez-vous pour télécharger cet épisode.');
      return;
    }
    const audioUri = episode.audioUrl || episode.episodeUrl || episode.previewUrl || null;
    if (!audioUri) {
      Alert.alert('Téléchargement impossible', "Cet épisode n'a pas d'URL audio accessible.");
      return;
    }
    try {
      await downloadEpisode(episode, podcast);
      Alert.alert('Téléchargé !', "L'épisode est disponible hors ligne.");
    } catch (error) {
      Alert.alert('Erreur', 'Le téléchargement a échoué. Réessayez plus tard.');
    }
  };

  // ── Calcul espace libre vs taille totale ──────────────
  const computeSpaceInfo = async (episodeList) => {
    let freeBytes = 0;
    try { freeBytes = (await FileSystem.getFreeDiskStorageAsync()) ?? 0; } catch (_) {}
    const totalEstimatedBytes = episodeList.reduce(
      (sum, ep) => sum + (ep.fileSize || 30 * 1024 * 1024), 0
    );
    return {
      freeBytes,
      totalEstimatedBytes,
      freeGB:        (freeBytes / 1024 / 1024 / 1024).toFixed(2),
      neededGB:      (totalEstimatedBytes / 1024 / 1024 / 1024).toFixed(2),
      hasEnoughSpace: freeBytes >= totalEstimatedBytes,
    };
  };

  // ── Download All ───────────────────────────────────────
  const handleDownloadAll = async () => {
    if (!isConnected) {
      Alert.alert('Hors ligne', 'Connectez-vous pour télécharger les épisodes.');
      return;
    }
    const toDownload = episodes.filter(ep => {
      const hasAudio = !!(ep.audioUrl || ep.episodeUrl || ep.previewUrl);
      return hasAudio && !getIsDownloaded(ep.id);
    });
    if (toDownload.length === 0) {
      Alert.alert('Déjà téléchargés', 'Tous les épisodes disponibles sont déjà téléchargés.');
      return;
    }
    const spaceInfo = await computeSpaceInfo(toDownload);
    if (!spaceInfo.hasEnoughSpace) {
      Alert.alert(
        'Espace insuffisant',
        `Espace libre : ${spaceInfo.freeGB} Go\nEspace nécessaire (estimé) : ${spaceInfo.neededGB} Go\n\nLibérez de l'espace avant de continuer.`,
        [{ text: 'OK' }]
      );
      return;
    }
    Alert.alert(
      'Télécharger tout',
      `${toDownload.length} épisode(s) à télécharger.\nEspace nécessaire (estimé) : ${spaceInfo.neededGB} Go\nEspace libre : ${spaceInfo.freeGB} Go`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Télécharger', onPress: () => runDownloadAll(toDownload) },
      ]
    );
  };

  const runDownloadAll = async (toDownload) => {
    cancelRef.current = false;
    setIsDownloadingAll(true);
    setDownloadAllTotal(toDownload.length);
    setDownloadAllCurrent(0);
    setDownloadAllProgress(0);
    progressAnim.setValue(0);

    let completed = 0;
    for (let i = 0; i < toDownload.length; i++) {
      if (cancelRef.current) break;

      // Vérification espace avant chaque épisode
      let freeBytes = 0;
      try { freeBytes = (await FileSystem.getFreeDiskStorageAsync()) ?? 0; } catch (_) {}
      const needed = toDownload[i].fileSize || 30 * 1024 * 1024;
      if (freeBytes < needed * 1.1) {
        Alert.alert(
          'Espace insuffisant',
          `Téléchargement arrêté à l'épisode ${i + 1}/${toDownload.length}.\nPlus assez d'espace disque disponible.`,
          [{ text: 'OK' }]
        );
        break;
      }

      setDownloadAllCurrent(i + 1);
      try { await downloadEpisode(toDownload[i], podcast); completed++; } catch (_) {}

      const prog = (i + 1) / toDownload.length;
      setDownloadAllProgress(prog);
      Animated.timing(progressAnim, { toValue: prog, duration: 300, useNativeDriver: false }).start();
    }

    setIsDownloadingAll(false);
    if (!cancelRef.current) {
      Alert.alert('Terminé', `${completed} épisode(s) téléchargé(s) sur ${toDownload.length}.`);
    }
    setDownloadAllProgress(0);
    progressAnim.setValue(0);
  };

  const alreadyDownloadedCount = episodes.filter(ep => getIsDownloaded(ep.id)).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
=======
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import EpisodeItem from '../components/EpisodeItem';
import { episodes as allEpisodes } from '../data/mockData';

export default function PodcastScreen({ route, navigation }) {
  const { podcast } = route.params;
  const [downloadedIds, setDownloadedIds] = useState([101]); // ep 101 pre-downloaded for demo

  const episodes = allEpisodes.filter(e => e.podcastId === podcast.id);
  const idx = (podcast.id - 1) % Colors.covers.length;
  const coverColors = Colors.covers[idx];
  const emoji = Colors.coverEmojis[idx];

  const toggleDownload = (epId) => {
    setDownloadedIds(prev =>
      prev.includes(epId) ? prev.filter(id => id !== epId) : [...prev, epId]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── COVER HEADER ── */}
        <View style={styles.coverWrap}>
          <LinearGradient colors={coverColors} style={styles.coverBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.coverEmoji}>{emoji}</Text>
          </LinearGradient>
<<<<<<< HEAD
          <LinearGradient colors={['transparent', Colors.bg]} style={styles.coverFade} />
=======
          {/* Fade to bg */}
          <LinearGradient
            colors={['transparent', Colors.bg]}
            style={styles.coverFade}
          />
          {/* Back button */}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
<<<<<<< HEAD
=======
          {/* Title & author */}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
          <Text style={styles.podTitle}>{podcast.title}</Text>
          <Text style={styles.podAuthor}>by {podcast.author} · {podcast.category}</Text>
          <Text style={styles.podDesc}>{podcast.description}</Text>

<<<<<<< HEAD
=======
          {/* Stats row */}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{episodes.length}</Text>
              <Text style={styles.statLbl}>Episodes</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
<<<<<<< HEAD
              <Text style={[styles.statVal, { color: Colors.gold }]}>⭐ {podcast.rating || '—'}</Text>
              <Text style={styles.statLbl}>Note</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>~{podcast.avgDuration || '?'}m</Text>
              <Text style={styles.statLbl}>Durée moy.</Text>
            </View>
          </View>

          <View style={styles.hint}>
            <Text style={styles.hintText}>
              {isConnected
                ? '💡 ▶ Écouter maintenant  ·  ⬇ Sauvegarder hors ligne'
                : '📡 Mode hors ligne — seuls les épisodes téléchargés sont lisibles'}
            </Text>
          </View>

          {/* ── Section titre + bouton Download All ── */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Episodes</Text>

            {!isLoadingEpisodes && episodes.length > 0 && isConnected && (
              isDownloadingAll ? (
                <TouchableOpacity style={styles.cancelAllBtn} onPress={() => { cancelRef.current = true; }} activeOpacity={0.8}>
                  <Text style={styles.cancelAllText}>✕ Annuler</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.downloadAllBtn, alreadyDownloadedCount === episodes.length && styles.downloadAllBtnDone]}
                  onPress={handleDownloadAll}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.downloadAllText, alreadyDownloadedCount === episodes.length && { color: Colors.teal }]}>
                    {alreadyDownloadedCount === episodes.length ? '✓ Tous téléchargés' : '⬇ Tout télécharger'}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* ── Barre de progression globale ── */}
          {isDownloadingAll && (
            <View style={styles.globalProgressWrap}>
              <View style={styles.globalProgressHeader}>
                <Text style={styles.globalProgressLabel}>
                  Téléchargement {downloadAllCurrent}/{downloadAllTotal}
                </Text>
                <Text style={styles.globalProgressPct}>{Math.round(downloadAllProgress * 100)}%</Text>
              </View>
              <View style={styles.globalProgressTrack}>
                <Animated.View
                  style={[styles.globalProgressBar, {
                    width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  }]}
                />
              </View>
            </View>
          )}

          {isLoadingEpisodes ? (
            <View style={styles.loading}>
              <Text style={styles.loadingText}>Chargement des épisodes…</Text>
            </View>
          ) : episodes.length === 0 ? (
            <View style={styles.noEpisodes}>
              <Text style={styles.noEpisodesText}>Aucun épisode disponible</Text>
=======
              <Text style={[styles.statVal, { color: Colors.gold }]}>⭐ {podcast.rating}</Text>
              <Text style={styles.statLbl}>Rating</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>~{podcast.avgDuration}m</Text>
              <Text style={styles.statLbl}>Avg dur.</Text>
            </View>
          </View>

          {/* Hint */}
          <View style={styles.hint}>
            <Text style={styles.hintText}>💡 ▶ Stream now · ⬇ Save for offline listening</Text>
          </View>

          {/* Episodes */}
          <Text style={styles.sectionTitle}>Episodes</Text>

          {episodes.length === 0 ? (
            <View style={styles.noEpisodes}>
              <Text style={styles.noEpisodesText}>No episodes available</Text>
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
            </View>
          ) : (
            episodes.map((ep, i) => (
              <EpisodeItem
                key={ep.id}
                episode={ep}
                index={i}
                mode="online"
<<<<<<< HEAD
                downloaded={getIsDownloaded(ep.id)}
                downloadStatus={getDownloadStatus(ep.id)}
                hasAudio={!!(ep.audioUrl || ep.episodeUrl || ep.previewUrl || getIsDownloaded(ep.id))}
                onPlay={() => handlePlay(ep)}
                onDownload={() => handleDownload(ep)}
=======
                downloaded={downloadedIds.includes(ep.id)}
                onPlay={() => navigation.navigate('Player', {
                  episode: ep,
                  podcast,
                  from: 'PodcastScreen', // contextual back navigation
                })}
                onDownload={() => toggleDownload(ep.id)}
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
                accentColor={Colors.acc}
              />
            ))
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
<<<<<<< HEAD
=======

>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  coverWrap: { height: 180, position: 'relative', overflow: 'hidden' },
  coverBg: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', opacity: 0.7 },
  coverEmoji: { fontSize: 80 },
  coverFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 80 },
<<<<<<< HEAD
  backBtn: { position: 'absolute', top: 50, left: 14, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: Colors.border2, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 15, color: Colors.text },
  content: { padding: 18, marginTop: -10 },
  podTitle: { fontSize: 19, fontWeight: '800', color: Colors.text },
  podAuthor: { fontSize: 11, color: Colors.t2, marginTop: 4 },
  podDesc: { fontSize: 12, color: Colors.t2, marginTop: 8, lineHeight: 18 },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 12, marginTop: 14 },
=======
  backBtn: {
    position: 'absolute', top: 50, left: 14,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1, borderColor: Colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 15, color: Colors.text },

  content: { padding: 18, marginTop: -10 },

  podTitle: { fontSize: 19, fontWeight: '800', color: Colors.text },
  podAuthor: { fontSize: 11, color: Colors.t2, marginTop: 4 },
  podDesc: { fontSize: 12, color: Colors.t2, marginTop: 8, lineHeight: 18 },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14, padding: 12, marginTop: 14,
  },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 15, fontWeight: '800', color: Colors.acc },
  statLbl: { fontSize: 9, color: Colors.t3, textTransform: 'uppercase', letterSpacing: 0.5 },
  statSep: { width: 1, height: 26, backgroundColor: Colors.border },
<<<<<<< HEAD
  hint: { backgroundColor: Colors.tealDim, borderWidth: 1, borderColor: Colors.tealBorder, borderRadius: 10, padding: 9, marginTop: 12, marginBottom: 14 },
  hintText: { fontSize: 11, fontWeight: '600', color: Colors.teal },

  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },

  downloadAllBtn: {
    backgroundColor: Colors.accDim, borderWidth: 1, borderColor: Colors.acc,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  downloadAllBtnDone: { backgroundColor: 'rgba(0,229,195,0.12)', borderColor: Colors.teal },
  downloadAllText: { fontSize: 11, fontWeight: '700', color: Colors.acc },

  cancelAllBtn: {
    backgroundColor: Colors.redDim, borderWidth: 1, borderColor: Colors.redBorder,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  cancelAllText: { fontSize: 11, fontWeight: '700', color: Colors.red },

  globalProgressWrap: {
    backgroundColor: Colors.s2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, padding: 12, marginBottom: 12,
  },
  globalProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  globalProgressLabel: { fontSize: 11, fontWeight: '600', color: Colors.t2 },
  globalProgressPct: { fontSize: 11, fontWeight: '700', color: Colors.acc },
  globalProgressTrack: { height: 6, backgroundColor: Colors.s3, borderRadius: 3, overflow: 'hidden' },
  globalProgressBar: { height: '100%', backgroundColor: Colors.acc, borderRadius: 3 },

  loading: { backgroundColor: Colors.s2, borderRadius: 14, padding: 24, alignItems: 'center' },
  loadingText: { fontSize: 13, color: Colors.t2 },
  noEpisodes: { backgroundColor: Colors.s2, borderRadius: 14, padding: 24, alignItems: 'center' },
=======

  hint: {
    backgroundColor: Colors.tealDim, borderWidth: 1, borderColor: Colors.tealBorder,
    borderRadius: 10, padding: 9, marginTop: 12, marginBottom: 14,
  },
  hintText: { fontSize: 11, fontWeight: '600', color: Colors.teal },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 6 },

  noEpisodes: {
    backgroundColor: Colors.s2, borderRadius: 14,
    padding: 24, alignItems: 'center',
  },
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
  noEpisodesText: { fontSize: 13, color: Colors.t2 },
});
