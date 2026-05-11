import type { PosterState } from '@/types/poster';
import { PRESETS } from '@/lib/presets/library';
import { SAMPLES, type SampleImage } from '@/lib/samples';

export interface DemoConfig {
  id: string;
  code: string;
  name: string;
  blurb: string;
  presetId: string;
  sampleId: string;
  swatch: [string, string, string]; // bg / fg / accent (inherits from preset)
  /**
   * Optional small overrides on top of the chosen preset.
   * Use sparingly — the goal is to demonstrate the preset's potential, not invent a new look.
   */
  tweak?: (state: PosterState) => PosterState;
}

export const DEMOS: DemoConfig[] = [
  {
    id: 'demo-editorial',
    code: 'A',
    name: 'EDITORIAL · PORTRAIT',
    blurb: 'PAPER WHITE + STUDIO',
    presetId: 'paper-white',
    sampleId: '02', // STUDIO · 02
    swatch: ['#EFEAE0', '#000000', '#A8202C'],
    tweak: (s) => {
      s.source.fitMode = 'cover';
      s.dither.pixelScale = 2;
      s.dither.contrast = 1.3;
      return s;
    },
  },
  {
    id: 'demo-tokyo',
    code: 'B',
    name: 'TOKYO · NIGHT',
    blurb: 'DUOTONE + NOIR',
    presetId: 'tokyo-night',
    sampleId: '10', // NOIR · 10
    swatch: ['#0A0908', '#D6D1C4', '#EFEAE0'],
    tweak: (s) => {
      s.source.fitMode = 'cover';
      s.dither.algorithm = 'stucki';
      s.dither.pixelScale = 2;
      s.dither.contrast = 1.3;
      s.color.imageOpacity = 0.95;
      s.color.blendMode = 'soft-light';
      return s;
    },
  },
  {
    id: 'demo-glitch',
    code: 'C',
    name: 'GLITCH · FEED',
    blurb: 'BROKEN SIGNAL + MIRROR',
    presetId: 'glitch-feed',
    sampleId: '04', // MIRROR · 04
    swatch: ['#000000', '#EFEAE0', '#A8202C'],
    tweak: (s) => {
      s.source.fitMode = 'cover';
      s.dither.pixelScale = 3;
      s.dither.contrast = 1.55;
      s.finish.scanlines = 0.4;
      s.finish.vignette = 0.55;
      return s;
    },
  },
];

export function resolveDemo(demo: DemoConfig): {
  preset: ReturnType<(typeof PRESETS)[number]['build']>;
  sample: SampleImage;
} | null {
  const presetDef = PRESETS.find((p) => p.id === demo.presetId);
  const sample = SAMPLES.find((s) => s.id === demo.sampleId);
  if (!presetDef || !sample) return null;
  let preset = presetDef.build();
  if (demo.tweak) preset = demo.tweak(preset);
  return { preset, sample };
}
