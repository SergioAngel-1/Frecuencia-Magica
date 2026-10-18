import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const dockSource = readFileSync(
  resolve(process.cwd(), 'src/components/features/player/player-dock.tsx'),
  'utf8',
);

describe('player dock minimizes only on an explicit opening', () => {
  it('decides the start state from the opening counter, never from the playing track alone', () => {
    expect(dockSource).toContain('const opened = usePlayerStore((s) => s.opened);');
    expect(dockSource).toContain('if (opened === lastOpened.current) return;');
    expect(dockSource).not.toContain('lastAudioId');
  });
});
