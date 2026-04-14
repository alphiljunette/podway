// ─────────────────────────────────────────────────────
// context/PlayerContext.js  — Lecteur audio GLOBAL
// ─────────────────────────────────────────────────────
import React, {
  createContext, useCallback, useContext,
  useEffect, useRef, useState,
} from 'react';
import { Audio } from 'expo-av';

const PlayerContext = createContext(null);

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function PlayerProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [currentPodcast,  setCurrentPodcast] = useState(null);
  const [playlist,        setPlaylist]       = useState([]);
  const [isPlaying,       setIsPlaying]      = useState(false);
  const [isLoading,       setIsLoading]      = useState(false);
  const [error,           setError]          = useState(null);
  const [positionMs,      setPositionMs]     = useState(0);
  const [durationMs,      setDurationMs]     = useState(0);
  const [speedIdx,        setSpeedIdx]       = useState(2);

  const soundRef      = useRef(null);
  const isMounted     = useRef(true);
  const playlistRef   = useRef([]);   // ref miroir pour éviter les closures périmées
  const episodeRef    = useRef(null);

  // Maintenir les refs synchronisées
  useEffect(() => { playlistRef.current = playlist; }, [playlist]);
  useEffect(() => { episodeRef.current = currentEpisode; }, [currentEpisode]);

  const progress = durationMs > 0 ? positionMs / durationMs : 0;
  const currentIndex = playlistRef.current.findIndex(ep => ep.id === episodeRef.current?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < playlistRef.current.length - 1;

  const fmt = (ms) => {
    const total = Math.floor((ms || 0) / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // ── Chargement interne ────────────────────────────
  const _loadAudio = useCallback(async (episode, shouldPlay = true) => {
    if (!episode) return;
    if (!isMounted.current) return;

    setIsLoading(true);
    setError(null);
    setPositionMs(0);
    setDurationMs(0);

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // _resolvedUri est déjà calculé (local file ou URL streaming)
      const audioUri = episode._resolvedUri || null;
      if (!audioUri) {
        setError("URL audio non disponible pour cet épisode.");
        setIsLoading(false);
        return;
      }

      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS:    true,
        shouldDuckAndroid:       true,
        allowsRecordingIOS:      false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        {
          shouldPlay,
          rate:               SPEEDS[speedIdx],
          shouldCorrectPitch: true,
          progressUpdateIntervalMillis: 500,
        },
        (status) => {
          if (!isMounted.current || !status.isLoaded) return;
          const pos = status.positionMillis || 0;
          const dur = status.durationMillis || (episode.duration || 0) * 60 * 1000;
          setPositionMs(pos);
          setDurationMs(dur);
          setIsPlaying(status.isPlaying);

          if (status.didJustFinish) {
            setIsPlaying(false);
            setPositionMs(0);
            // Auto-next
            const list = playlistRef.current;
            const idx  = list.findIndex(ep => ep.id === episode.id);
            if (idx >= 0 && idx < list.length - 1) {
              const nextEp = list[idx + 1];
              setCurrentEpisode(nextEp);
              episodeRef.current = nextEp;
              _loadAudio(nextEp, true);
            }
          }
        }
      );

      if (!isMounted.current) { await sound.unloadAsync(); return; }
      soundRef.current = sound;
      setIsPlaying(shouldPlay);
    } catch (err) {
      console.warn('[PlayerContext] Load error:', err);
      if (isMounted.current) setError("Impossible de charger l'audio. Vérifiez votre connexion.");
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  // speedIdx dans les deps causerait un rechargement à chaque changement de vitesse → on l'exclut
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── API publique : charger un épisode ─────────────
  const loadEpisode = useCallback(async ({
    episode,
    podcast,
    playlist: newPlaylist = [],
    getIsDownloaded,
    getDownloadedUri,
    autoPlay = true,
  }) => {
    // Résoudre l'URI pour chaque épisode de la playlist
    const resolve = (ep) => {
      const isDownloaded = getIsDownloaded?.(ep.id) ?? false;
      const uri = isDownloaded
        ? (getDownloadedUri?.(ep.id) ?? null)
        : (ep.audioUrl || ep.episodeUrl || ep.previewUrl || ep.enclosureUrl || null);
      return { ...ep, _resolvedUri: uri };
    };

    const enriched = resolve(episode);
    const enrichedPlaylist = (newPlaylist.length > 0 ? newPlaylist : [episode]).map(resolve);

    setCurrentEpisode(enriched);
    setCurrentPodcast(podcast);
    setPlaylist(enrichedPlaylist);
    playlistRef.current   = enrichedPlaylist;
    episodeRef.current    = enriched;

    await _loadAudio(enriched, autoPlay);
  }, [_loadAudio]);

  // ── Contrôles ─────────────────────────────────────
  const togglePlayback = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      if (isPlaying) await soundRef.current.pauseAsync();
      else           await soundRef.current.playAsync();
    } catch (err) { console.warn('[PlayerContext] Toggle error:', err); }
  }, [isPlaying]);

  const seekBy = useCallback(async (seconds) => {
    if (!soundRef.current) return;
    try {
      const newPos = Math.max(0, Math.min(durationMs, positionMs + seconds * 1000));
      await soundRef.current.setPositionAsync(newPos);
    } catch (_) {}
  }, [positionMs, durationMs]);

  const playNext = useCallback(() => {
    const list = playlistRef.current;
    const idx  = list.findIndex(ep => ep.id === episodeRef.current?.id);
    if (idx >= 0 && idx < list.length - 1) {
      const nextEp = list[idx + 1];
      setCurrentEpisode(nextEp);
      episodeRef.current = nextEp;
      _loadAudio(nextEp, true);
    }
  }, [_loadAudio]);

  const playPrev = useCallback(() => {
    if (positionMs > 3000) {
      soundRef.current?.setPositionAsync(0).catch(() => {});
      return;
    }
    const list = playlistRef.current;
    const idx  = list.findIndex(ep => ep.id === episodeRef.current?.id);
    if (idx > 0) {
      const prevEp = list[idx - 1];
      setCurrentEpisode(prevEp);
      episodeRef.current = prevEp;
      _loadAudio(prevEp, true);
    } else {
      soundRef.current?.setPositionAsync(0).catch(() => {});
    }
  }, [positionMs, _loadAudio]);

  const cycleSpeed = useCallback(() => {
    setSpeedIdx(prev => {
      const next = (prev + 1) % SPEEDS.length;
      soundRef.current?.setRateAsync(SPEEDS[next], true).catch(() => {});
      return next;
    });
  }, []);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      await soundRef.current.setPositionAsync(0);
    }
    setIsPlaying(false);
    setPositionMs(0);
  }, []);

  // Arrête la lecture si l'épisode en cours vient d'être supprimé
  const stopIfEpisodeDeleted = useCallback(async (deletedEpisodeId) => {
    if (episodeRef.current && String(episodeRef.current.id) === String(deletedEpisodeId)) {
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        } catch (_) {}
        soundRef.current = null;
      }
      setIsPlaying(false);
      setPositionMs(0);
      setDurationMs(0);
      setCurrentEpisode(null);
      setCurrentPodcast(null);
      setPlaylist([]);
      episodeRef.current = null;
      playlistRef.current = [];
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentEpisode, currentPodcast, playlist,
      isPlaying, isLoading, error,
      positionMs, durationMs, progress,
      speedIdx, speeds: SPEEDS,
      hasPrev, hasNext,
      currentIndex: playlistRef.current.findIndex(ep => ep.id === currentEpisode?.id),
      loadEpisode, togglePlayback, seekBy, playNext, playPrev, cycleSpeed, stop, stopIfEpisodeDeleted, fmt,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
