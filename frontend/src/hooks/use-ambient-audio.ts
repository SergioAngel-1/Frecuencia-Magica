'use client';

import { useEffect, useRef } from 'react';

import { useRealm } from '@/hooks/use-realm';
import { createDrone, type DroneHandle } from '@/lib/audio/drone';
import { useAmbientStore } from '@/stores/ambient-store';

type AudioContextCtor = typeof AudioContext;

/** `AudioContext` con el prefijo de WebKit como reserva. */
function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext ??
    null
  );
}

/**
 * Conecta la preferencia de audio, el realm activo y el grafo del drone.
 *
 * El `AudioContext` se crea perezosamente la primera vez que el audio se activa
 * —nunca en el montaje— para no disparar el aviso de autoplay. Si el navegador
 * no soporta Web Audio, degrada en silencio.
 */
export function useAmbientAudio(): void {
  const enabled = useAmbientStore((state) => state.enabled);
  const { baseNote } = useRealm();
  const droneRef = useRef<DroneHandle | null>(null);

  useEffect(() => {
    if (!enabled) {
      droneRef.current?.setEnabled(false);
      return;
    }

    if (!droneRef.current) {
      const Ctor = getAudioContextCtor();
      if (!Ctor) return; // Sin Web Audio: degrada en silencio.
      const drone = createDrone(new Ctor());
      drone.retune(baseNote);
      droneRef.current = drone;
    }

    droneRef.current.setEnabled(true);
  }, [enabled, baseNote]);

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
