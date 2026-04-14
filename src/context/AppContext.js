import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { episodes, podcasts } from '../data/mockData';

const DOWNLOADS_KEY = 'podway_downloads';
const DOWNLOAD_DIR  = `${FileSystem.documentDirectory}podway_downloads/`;

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [downloadsMap, setDownloadsMap] = useState({});
  const [isReady, setIsReady]           = useState(false);
  const [diskInfo, setDiskInfo]         = useState({ totalGB: 16, freeGBInitial: 16, freeGBCurrent: 16 });

  // Ref miroir de downloadsMap pour éviter les closures périmées dans downloadEpisode
  const downloadsMapRef = useRef({});

  // Callback appelé par PlayerContext pour stopper la lecture si l'épisode est supprimé
  const onEpisodeDeletedRef = useRef(null);
  const registerOnEpisodeDeleted = useCallback((fn) => {
    onEpisodeDeletedRef.current = fn;
  }, []);

  // Normalize episode ID to string key for consistent storage
  const toKey = (id) => String(id);

  const persistDownloads = useCallback(async (nextMap) => {
    downloadsMapRef.current = nextMap;
    setDownloadsMap(nextMap);
    try {
      await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(nextMap));
    } catch (error) {
      console.warn('[AppContext] Failed to save downloads', error);
    }
  }, []);

  const ensureDownloadDirectory = useCallback(async () => {
    try {
      const info = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, { intermediates: true });
      }
    } catch (error) {
      console.warn('[AppContext] Could not create download directory', error);
    }
  }, []);

  useEffect(() => {
    const hydrate = async () => {
      await ensureDownloadDirectory();
      try {
        const stored = await AsyncStorage.getItem(DOWNLOADS_KEY);
        const parsed = stored ? JSON.parse(stored) : {};
        const validated = {};

        for (const [episodeId, record] of Object.entries(parsed)) {
          if (!record || !record.uri || !record.metadata) continue;
          try {
            const file = await FileSystem.getInfoAsync(record.uri);
            if (file.exists) {
              validated[episodeId] = { ...record, status: 'completed', fileSize: record.fileSize || file.size || 0 };
            }
          } catch (_) {}
        }

        downloadsMapRef.current = validated;
        setDownloadsMap(validated);
      } catch (error) {
        console.warn('[AppContext] Failed to hydrate downloads', error);
        downloadsMapRef.current = {};
        setDownloadsMap({});
      } finally {
        setIsReady(true);
      }
    };
    hydrate();
  }, [ensureDownloadDirectory]);

  useEffect(() => {
    const refreshDiskInfo = async () => {
      try {
        const freeBytes = await FileSystem.getFreeDiskStorageAsync();
        const totalBytes = await FileSystem.getTotalDiskCapacityAsync();
        const freeGB = freeBytes != null ? Math.max(0, freeBytes / 1024 / 1024 / 1024) : 16;
        const totalGB = totalBytes != null ? Math.max(0.1, totalBytes / 1024 / 1024 / 1024) : 16;
        setDiskInfo(prev => ({
          totalGB,
          freeGBInitial: prev.freeGBInitial === 16 ? freeGB : prev.freeGBInitial,
          freeGBCurrent: freeGB,
        }));
      } catch (error) {
        console.warn('[AppContext] Could not read disk storage', error);
      }
    };
    refreshDiskInfo();
  }, []);

  const getDownloadRecord  = useCallback((id) => downloadsMap[toKey(id)] || null, [downloadsMap]);
  const getIsDownloaded    = useCallback((id) => downloadsMap[toKey(id)]?.status === 'completed', [downloadsMap]);
  const getDownloadStatus  = useCallback((id) => downloadsMap[toKey(id)]?.status || 'none', [downloadsMap]);
  const getDownloadedUri   = useCallback((id) => downloadsMap[toKey(id)]?.uri || null, [downloadsMap]);

  const downloadEpisode = useCallback(async (episodeOrId, podcast, onProgress) => {
    const episode = typeof episodeOrId === 'object'
      ? episodeOrId
      : episodes.find(ep => ep.id === episodeOrId);

    if (!episode) throw new Error(`Episode not found: ${episodeOrId}`);

    const key = toKey(episode.id);
    // Utiliser la ref pour avoir la valeur la plus récente (évite la closure périmée)
    const currentMap = downloadsMapRef.current;
    const existing = currentMap[key];
    if (existing?.status === 'completed') return existing.uri;

    const audioUrl = episode.audioUrl || episode.episodeUrl || episode.previewUrl || episode.enclosureUrl || null;
    if (!audioUrl) throw new Error(`No audio URL available for episode ${episode.id}`);

    const fileName  = `${key}.mp3`;
    const targetUri = `${DOWNLOAD_DIR}${fileName}`;

    const startMap = {
      ...currentMap,
      [key]: {
        status: 'downloading',
        uri: targetUri,
        fileSize: episode.fileSize || 0,
        downloadedAt: new Date().toISOString(),
        progress: 0,
        metadata: {
          episode,
          podcast: podcast || null,
        },
      },
    };
    await persistDownloads(startMap);

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        audioUrl,
        targetUri,
        {},
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          const prog = totalBytesExpectedToWrite > 0
            ? totalBytesWritten / totalBytesExpectedToWrite
            : 0;
          setDownloadsMap(prev => {
            const next = { ...prev, [key]: { ...prev[key], progress: prog } };
            downloadsMapRef.current = next;
            return next;
          });
          if (onProgress) onProgress(prog);
        }
      );

      await downloadResumable.downloadAsync();
      const fileInfo = await FileSystem.getInfoAsync(targetUri);
      const finalSize = fileInfo.exists ? (fileInfo.size || 0) : (startMap[key].fileSize || 0);

      // Repartir de la ref la plus récente (d'autres téléchargements ont pu s'intercaler)
      const latestMap = downloadsMapRef.current;
      const completedMap = {
        ...latestMap,
        [key]: {
          ...startMap[key],
          status: 'completed',
          progress: 1,
          fileSize: finalSize,
          metadata: {
            ...startMap[key].metadata,
            episode: {
              ...startMap[key].metadata.episode,
              fileSize: finalSize,
            },
          },
        },
      };
      await persistDownloads(completedMap);
      return targetUri;
    } catch (error) {
      console.warn('[AppContext] Download failed', error);
      const failedMap = { ...downloadsMapRef.current };
      delete failedMap[key];
      await persistDownloads(failedMap);
      throw error;
    }
  }, [persistDownloads]);

  const removeDownload = useCallback(async (id) => {
    const key    = toKey(id);
    const record = downloadsMap[key];
    if (record?.uri) {
      try { await FileSystem.deleteAsync(record.uri, { idempotent: true }); }
      catch (_) {}
    }
    // Arrêter la lecture si l'épisode supprimé est en cours
    if (onEpisodeDeletedRef.current) {
      onEpisodeDeletedRef.current(id);
    }
    const nextMap = { ...downloadsMap };
    delete nextMap[key];
    await persistDownloads(nextMap);
  }, [downloadsMap, persistDownloads]);

  const completedRecords = useMemo(
    () => Object.values(downloadsMap).filter(record => record.status === 'completed' && record.metadata?.episode),
    [downloadsMap]
  );

  const downloadedEpisodes = useMemo(
    () => completedRecords.map(record => ({
      ...record.metadata.episode,
      _resolvedUri: record.uri,
      fileSize: record.fileSize || record.metadata.episode.fileSize || 0,
      podcast: record.metadata.podcast || record.metadata.episode.podcast || null,
      podcastId: record.metadata.episode.podcastId || record.metadata.podcast?.id,
    })),
    [completedRecords]
  );

  const downloadedPodcastIds = useMemo(
    () => [...new Set(downloadedEpisodes.map(ep => ep.podcast?.id).filter(Boolean))],
    [downloadedEpisodes]
  );

  const downloadedPodcasts = useMemo(
    () => {
      const seen = new Map();
      completedRecords.forEach(record => {
        const podcast = record.metadata.podcast;
        if (podcast && !seen.has(podcast.id)) seen.set(podcast.id, podcast);
      });
      return Array.from(seen.values());
    },
    [completedRecords]
  );

  const groupedDownloads = useMemo(() => {
    const groups = new Map();
    completedRecords.forEach(record => {
      const podcast = record.metadata.podcast || record.metadata.episode.podcast || { id: record.metadata.episode.podcastId, title: 'Unknown' };
      const key = toKey(podcast.id || podcast.title || 'unknown');
      if (!groups.has(key)) {
        groups.set(key, { podcast, episodes: [], totalSizeMB: 0 });
      }
      const group = groups.get(key);
      const episode = {
        ...record.metadata.episode,
        _resolvedUri: record.uri,
        fileSize: record.fileSize || record.metadata.episode.fileSize || 0,
      };
      group.episodes.push(episode);
      group.totalSizeMB += (episode.fileSize || 0) / 1024 / 1024;
    });
    return Array.from(groups.values()).map(group => ({
      ...group,
      totalSizeMB: Math.round(group.totalSizeMB * 100) / 100,
    }));
  }, [completedRecords]);

  const storageInfo = useMemo(() => {
    const totalDownloadedBytes = completedRecords.reduce((sum, record) => sum + (record.fileSize || 0), 0);
    const totalSpace = Math.round(diskInfo.totalGB * 10) / 10;
    const usedByApp = Math.round((totalDownloadedBytes / 1024 / 1024 / 1024) * 100) / 100; // GB
    const remainingFree = Math.max(0, Math.round(diskInfo.freeGBCurrent * 10) / 10);
    const usedPct = diskInfo.totalGB > 0 ? Math.round(((diskInfo.totalGB - diskInfo.freeGBCurrent) / diskInfo.totalGB) * 100) : 0;
    return { usedByApp, remainingFree, usedPct, totalSpace };
  }, [diskInfo, completedRecords]);

  const getEpisodesForPodcast = useCallback(
    (podcastId) => downloadedEpisodes.filter(ep => ep.podcastId === podcastId),
    [downloadedEpisodes]
  );

  return (
    <AppContext.Provider value={{
      downloadsMap,
      isReady,
      downloadedEpisodes,
      downloadedPodcasts,
      groupedDownloads,
      storageInfo,
      totalDownloadedEpisodes: downloadedEpisodes.length,
      totalDownloadedPodcasts: downloadedPodcasts.length,
      downloadEpisode,
      removeDownload,
      getDownloadRecord,
      getIsDownloaded,
      getDownloadStatus,
      getDownloadedUri,
      getEpisodesForPodcast,
      registerOnEpisodeDeleted,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
