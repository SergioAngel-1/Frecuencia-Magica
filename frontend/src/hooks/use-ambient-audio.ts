'use client';

import { useEffect, useRef } from 'react';

import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useRealm } from '@/hooks/use-realm';
import { ambientAudible } from '@/lib/audio/ambient-mix';
import type { DroneHandle } from '@/lib/audio/drone';
import { baseNoteFor } from '@/lib/audio/drone-notes';
import { getSharedAudioContext } from '@/lib/audio/engine/context';
import { useAmbientStore } from '@/stores/ambient-store';
import { useIsPlayerSounding } from '@/stores/player-store';

/**
 * Conecta la preferencia de audio, el realm activo y el grafo del drone.
 *
 * El contexto compartido se pide la primera vez que el ambiente se activa —un
 * gesto, nunca el montaje— para no disparar el aviso de autoplay. El grafo del
 * drone entra en un chunk aparte (`import`) cuando hace falta. Si el navegador
 * no soporta Web Audio, degrada en silencio.
 */
export function useAmbientAudio(): void {
  const enabled = useAmbientStore((state) => state.enabled);
  // Mientras suena una frecuencia, el drone se funde a silencio (su ganancia
  // baja con rampa) y vuelve al pausar o cerrar: nunca dos sonidos a la vez.
  const playerSounding = useIsPlayerSounding();
  const { realmId } = useRealm();
  const { atmosphereId } = useAtmosphere();
  // La nota sigue a la atmósfera efectiva: al cambiarla, el drone se re-afina y desliza.
  const baseNote = baseNoteFor(atmosphereId, realmId);
  const droneRef = useRef<DroneHandle | null>(null);
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);
  const latestRef = useRef({ enabled, sounding: playerSounding, baseNote });

  useEffect(() => {
    latestRef.current = { enabled, sounding: playerSounding, baseNote };
  }, [enabled, playerSounding, baseNote]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Carga perezosa del drone: sólo la primera vez que el ambiente se enciende.
  useEffect(() => {
    if (!enabled || droneRef.current || loadingRef.current) return;

    const ctx = getSharedAudioContext();
    if (!ctx) return; // Sin Web Audio: degrada en silencio.

    loadingRef.current = true;
    void import('@/lib/audio/drone').then(({ createDrone }) => {
      loadingRef.current = false;
      // El hook pudo desmontarse mientras cargaba: no dejar el grafo vivo.
      if (!mountedRef.current) return;

      const drone = createDrone(ctx);
      droneRef.current = drone;
      const latest = latestRef.current;
      drone.retune(latest.baseNote);
      drone.setEnabled(ambientAudible(latest.enabled, latest.sounding));
    });
  }, [enabled]);

  // Sigue la preferencia y el reproductor; se re-afina al cambiar de nota.
  useEffect(() => {
    droneRef.current?.setEnabled(ambientAudible(enabled, playerSounding));
  }, [enabled, playerSounding]);

  useEffect(() => {
    droneRef.current?.retune(baseNote);
  }, [baseNote]);

  useEffect(() => {
    return () => {
      droneRef.current?.dispose();
      droneRef.current = null;
    };
  }, []);
}
