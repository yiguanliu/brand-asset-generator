import { nanoid } from 'nanoid';
import type { PosterState, TextBlock } from '@/types/poster';
import { defaultPreset, PALETTE } from './default';

export interface BuiltinPreset {
  id: string;
  code: string;
  name: string;
  blurb: string;
  swatch: [string, string, string]; // bg / fg / accent
  build: () => PosterState;
}

const tb = (overrides: Partial<TextBlock>): TextBlock => ({
  id: nanoid(6),
  content: '',
  font: 'mono',
  size: 12,
  weight: 400,
  tracking: 0.18,
  leading: 1.1,
  color: PALETTE.paper,
  align: 'left',
  upper: true,
  x: 0.5,
  y: 0.5,
  rotation: 0,
  visible: true,
  ...overrides,
});

function withSource(state: PosterState): PosterState {
  // preserve any currently loaded image when applying preset
  return state;
}

const HOMME_PLUS = (): PosterState => withSource(defaultPreset());

const NOISE_FLOOR = (): PosterState => {
  const s = defaultPreset();
  s.dither.algorithm = 'atkinson';
  s.dither.pixelScale = 3;
  s.dither.contrast = 1.4;
  s.dither.invert = true;
  s.color = { ...s.color, background: PALETTE.ink, foreground: PALETTE.paper, accent: PALETTE.blood, mode: 'mono', duotoneRamp: 0.5, blendMode: 'soft-light', imageOpacity: 0.95 };
  s.finish.grainAmount = 0.18;
  s.finish.grainSize = 2;
  s.finish.scanlines = 0.18;
  s.finish.scanSpacing = 3;
  s.finish.vignette = 0.35;
  s.hud.corners.tl.enabled = true;
  s.hud.corners.tr.enabled = false;
  s.hud.corners.bl.enabled = false;
  s.hud.corners.br.enabled = true;
  s.hud.corners.tl.label = 'SIGNAL';
  s.hud.corners.tl.value = 'LOST';
  s.hud.corners.br.label = 'NOISE';
  s.hud.corners.br.value = '+78 DB';
  s.hud.corners.br.accent = true;
  s.hud.checklist.enabled = false;
  s.hud.stripes.enabled = false;
  s.hud.ticks.enabled = true;
  s.hud.plusMark.enabled = true;
  s.text = [
    tb({ content: 'NOISE FLOOR', size: 32, weight: 700, x: 0.08, y: 0.07, tracking: 0.12 }),
    tb({ content: 'STATIC / SIGNAL / SILHOUETTE', size: 10, color: PALETTE.ash, x: 0.08, y: 0.12 }),
    tb({ content: 'ノイズ', font: 'jp-serif', size: 96, weight: 700, upper: false, x: 0.92, y: 0.86, align: 'right', tracking: 0.02 }),
  ];
  return s;
};

const PAPER_WHITE = (): PosterState => {
  const s = defaultPreset();
  s.dither.algorithm = 'bayer4';
  s.dither.pixelScale = 2;
  s.dither.contrast = 1.2;
  s.dither.gamma = 1.1;
  s.color = { ...s.color, background: PALETTE.paper, foreground: PALETTE.ink, accent: PALETTE.blood, mode: 'mono', duotoneRamp: 0.5 };
  s.finish.grainAmount = 0.04;
  s.finish.scanlines = 0;
  s.finish.vignette = 0;
  s.hud.corners.tl = { enabled: true, label: 'EDITION', value: 'SS / 2026', accent: false };
  s.hud.corners.tr = { enabled: true, label: '', value: '○', accent: false };
  s.hud.corners.bl = { enabled: true, label: 'PAGE', value: '04 / 12', accent: false };
  s.hud.corners.br = { enabled: false, label: '', value: '', accent: false };
  s.hud.ticks.enabled = false;
  s.hud.stripes.enabled = false;
  s.hud.checklist.enabled = false;
  s.hud.pagination.enabled = false;
  s.hud.plusMark.enabled = false;
  s.hud.frame = { enabled: true, stroke: 0.5, inset: 24 };
  s.text = [
    tb({ content: 'HOMME', font: 'jp-serif', size: 120, weight: 700, x: 0.5, y: 0.18, align: 'center', upper: true, color: PALETTE.ink, tracking: 0.06 }),
    tb({ content: 'PLUS', font: 'jp-serif', size: 120, weight: 400, x: 0.5, y: 0.28, align: 'center', upper: true, color: PALETTE.ink, tracking: 0.06 }),
    tb({ content: 'editorial · ss / 2026', size: 11, x: 0.5, y: 0.94, align: 'center', upper: false, color: '#1F1C18', tracking: 0.4 }),
  ];
  return s;
};

const TOKYO_NIGHT = (): PosterState => {
  const s = defaultPreset();
  s.dither.algorithm = 'stucki';
  s.dither.pixelScale = 2;
  s.dither.contrast = 1.25;
  s.color = { ...s.color, background: PALETTE.void, foreground: PALETTE.gauze, accent: PALETTE.paper, mode: 'duo', duotoneRamp: 0.5 };
  s.finish.grainAmount = 0.05;
  s.finish.vignette = 0.2;
  s.hud.corners.tl = { enabled: true, label: '東京', value: 'TOKYO', accent: false };
  s.hud.corners.tr = { enabled: true, label: 'NIGHT', value: '23:47', accent: false };
  s.hud.corners.bl = { enabled: false, label: '', value: '', accent: false };
  s.hud.corners.br = { enabled: true, label: 'LOOKBOOK', value: 'FW / 2026', accent: false };
  s.hud.checklist.enabled = false;
  s.hud.stripes.enabled = false;
  s.hud.ticks.enabled = false;
  s.hud.registration = { enabled: true, size: 12 };
  s.hud.frame = { enabled: true, stroke: 0.75, inset: 16 };
  s.text = [
    tb({ content: '夜の静寂', font: 'jp-serif', size: 110, weight: 700, x: 0.96, y: 0.5, align: 'right', upper: false, color: PALETTE.paper, tracking: 0.04, rotation: 0 }),
    tb({ content: 'SILENCE / OF / NIGHT', size: 10, x: 0.04, y: 0.94, color: PALETTE.ash, tracking: 0.24 }),
  ];
  return s;
};

const ARCHIVE_1994 = (): PosterState => {
  const s = defaultPreset();
  s.dither.algorithm = 'threshold';
  s.dither.pixelScale = 4;
  s.dither.threshold = 128;
  s.dither.contrast = 1.5;
  s.color = { ...s.color, background: PALETTE.ink, foreground: PALETTE.paper, accent: PALETTE.blood, mode: 'mono', duotoneRamp: 0.5 };
  s.finish.grainAmount = 0.08;
  s.finish.scanlines = 0.06;
  s.finish.scanSpacing = 2;
  s.hud.corners.tl = { enabled: true, label: 'ARCHIVE', value: '1994', accent: false };
  s.hud.corners.tr = { enabled: true, label: 'REEL', value: '03 / 18', accent: false };
  s.hud.corners.bl = { enabled: true, label: 'STATUS', value: 'PRESERVED', accent: true };
  s.hud.corners.br = { enabled: true, label: 'CODE', value: 'CDG · HP · 044', accent: false };
  s.hud.ticks.enabled = true;
  s.hud.ticks.count = 60;
  s.hud.stripes.enabled = false;
  s.hud.checklist.enabled = true;
  s.hud.checklist.items = ['MASTER LOCATED', 'SCAN COMPLETE', 'AUDIO SYNC', 'NEGATIVE FILED'];
  s.hud.pagination.enabled = false;
  s.hud.barcode = { enabled: true, width: 140, height: 28 };
  s.text = [
    tb({ content: 'HOMME PLUS', size: 22, weight: 700, x: 0.08, y: 0.07, tracking: 0.14 }),
    tb({ content: '/ ARCHIVE · 1994 / 2026', size: 10, color: PALETTE.ash, x: 0.08, y: 0.11 }),
    tb({ content: 'ARCHIVED', size: 11, color: PALETTE.blood, x: 0.92, y: 0.94, align: 'right', tracking: 0.3 }),
  ];
  return s;
};

const BAYER_88 = (): PosterState => {
  const s = defaultPreset();
  s.dither.algorithm = 'bayer8';
  s.dither.pixelScale = 1;
  s.dither.levels = 3;
  s.dither.contrast = 1.15;
  s.color = { ...s.color, background: PALETTE.void, foreground: PALETTE.gauze, accent: PALETTE.blood, mode: 'mono', duotoneRamp: 0.5 };
  s.finish.grainAmount = 0.03;
  s.finish.halftoneAmount = 0.4;
  s.hud.corners.tl = { enabled: true, label: 'PATTERN', value: 'BAYER 8×8', accent: false };
  s.hud.corners.tr = { enabled: true, label: 'CELL', value: '64 / DOT', accent: true };
  s.hud.corners.bl = { enabled: true, label: 'PIXEL', value: '1 ⁄ NATIVE', accent: false };
  s.hud.corners.br = { enabled: true, label: 'INDEX', value: '0064', accent: false };
  s.hud.ticks.enabled = true;
  s.hud.checklist.enabled = false;
  s.hud.stripes.enabled = true;
  s.hud.stripes.count = 3;
  s.hud.pagination.enabled = true;
  s.hud.plusMark.enabled = true;
  s.hud.barcode = { enabled: true, width: 96, height: 20 };
  s.text = [
    tb({ content: 'PATTERN STUDY', size: 24, weight: 700, x: 0.08, y: 0.06, tracking: 0.12 }),
    tb({ content: '64-CELL · ORDERED DITHER', size: 10, color: PALETTE.ash, x: 0.08, y: 0.105 }),
    tb({ content: '8 × 8', font: 'jp-sans', size: 88, weight: 700, x: 0.92, y: 0.82, align: 'right', tracking: 0 }),
  ];
  return s;
};

const DECONSTRUCTED = (): PosterState => {
  const s = defaultPreset();
  s.dither.algorithm = 'sierra';
  s.dither.pixelScale = 2;
  s.dither.contrast = 1.3;
  s.color = { ...s.color, background: '#1F1C18', foreground: PALETTE.gauze, accent: PALETTE.blood, mode: 'mono', duotoneRamp: 0.5, blendMode: 'multiply', imageOpacity: 1 };
  s.layout.asymmetry = 0.75;
  s.finish.grainAmount = 0.08;
  s.hud.corners.tl = { enabled: true, label: 'KAWAKUBO', value: '川久保', accent: false };
  s.hud.corners.tr = { enabled: false, label: '', value: '', accent: false };
  s.hud.corners.bl = { enabled: false, label: '', value: '', accent: false };
  s.hud.corners.br = { enabled: true, label: 'BROKEN', value: 'OK', accent: true };
  s.hud.ticks.enabled = false;
  s.hud.stripes.enabled = true;
  s.hud.stripes.count = 4;
  s.hud.stripes.angle = 12;
  s.hud.stripes.width = 60;
  s.hud.checklist.enabled = false;
  s.hud.frame = { enabled: true, stroke: 1.5, inset: 4 };
  s.text = [
    tb({ content: 'DE / CON / STRUCTED', size: 28, weight: 700, x: 0.06, y: 0.16, tracking: 0.04, rotation: -6 }),
    tb({ content: 'anti-fashion', font: 'ui', upper: false, size: 18, color: PALETTE.ash, x: 0.74, y: 0.34, rotation: 8, tracking: 0.06 }),
    tb({ content: '反', font: 'jp-serif', size: 220, weight: 700, x: 0.78, y: 0.7, align: 'right', upper: false, color: PALETTE.blood, rotation: -4, tracking: 0 }),
    tb({ content: 'COMME des GARÇONS / HOMME PLUS', font: 'ui', upper: true, size: 10, color: PALETTE.gauze, x: 0.06, y: 0.96, tracking: 0.3 }),
  ];
  return s;
};

const TRITONE_BLOOD = (): PosterState => {
  const s = defaultPreset();
  s.dither.algorithm = 'jjn';
  s.dither.pixelScale = 2;
  s.dither.contrast = 1.25;
  s.color = { ...s.color, background: PALETTE.void, foreground: PALETTE.paper, accent: PALETTE.blood, mode: 'tri', duotoneRamp: 0.55, blendMode: 'screen', imageOpacity: 0.9 };
  s.finish.grainAmount = 0.04;
  s.finish.vignette = 0.1;
  s.hud.corners.tl = { enabled: true, label: 'TRITONE', value: '03 STOPS', accent: false };
  s.hud.corners.tr = { enabled: true, label: 'BLOOD', value: '#A8202C', accent: true };
  s.hud.corners.bl = { enabled: false, label: '', value: '', accent: false };
  s.hud.corners.br = { enabled: true, label: 'CDG', value: 'HOMME PLUS', accent: false };
  s.hud.ticks.enabled = true;
  s.hud.checklist.enabled = false;
  s.hud.stripes.enabled = false;
  s.hud.plusMark.enabled = true;
  s.text = [
    tb({ content: 'BLOOD', size: 96, weight: 700, x: 0.5, y: 0.16, align: 'center', tracking: 0.14, color: PALETTE.blood }),
    tb({ content: 'PLUS · ONE · COLOR', size: 12, x: 0.5, y: 0.24, align: 'center', color: PALETTE.gauze, tracking: 0.34 }),
  ];
  return s;
};

const MINIMAL = (): PosterState => {
  const s = defaultPreset();
  s.dither.algorithm = 'atkinson';
  s.dither.pixelScale = 2;
  s.dither.contrast = 1.2;
  s.color = { ...s.color, background: PALETTE.void, foreground: PALETTE.gauze, accent: PALETTE.paper, mode: 'mono', duotoneRamp: 0.5 };
  s.layout.marginTop = 72;
  s.layout.marginBottom = 72;
  s.layout.marginLeft = 72;
  s.layout.marginRight = 72;
  s.finish.grainAmount = 0.03;
  s.hud.corners.tl.enabled = false;
  s.hud.corners.tr.enabled = false;
  s.hud.corners.bl.enabled = false;
  s.hud.corners.br.enabled = false;
  s.hud.ticks.enabled = false;
  s.hud.checklist.enabled = false;
  s.hud.stripes.enabled = false;
  s.hud.pagination.enabled = false;
  s.hud.plusMark.enabled = false;
  s.hud.frame.enabled = false;
  s.text = [
    tb({ content: 'HOMME PLUS', size: 14, weight: 500, x: 0.5, y: 0.07, align: 'center', tracking: 0.4 }),
    tb({ content: 'silence is loud', font: 'jp-serif', upper: false, size: 14, x: 0.5, y: 0.95, align: 'center', tracking: 0.4, color: PALETTE.ash }),
  ];
  return s;
};

const GLITCH_FEED = (): PosterState => {
  const s = defaultPreset();
  s.dither.algorithm = 'burkes';
  s.dither.pixelScale = 3;
  s.dither.contrast = 1.5;
  s.dither.brightness = -0.05;
  s.color = { ...s.color, background: PALETTE.ink, foreground: PALETTE.paper, accent: PALETTE.blood, mode: 'mono', duotoneRamp: 0.5, blendMode: 'difference', imageOpacity: 1 };
  s.finish.grainAmount = 0.12;
  s.finish.scanlines = 0.35;
  s.finish.scanSpacing = 2;
  s.finish.vignette = 0.55;
  s.hud.corners.tl = { enabled: true, label: '[ERR]', value: '0xCDG', accent: true };
  s.hud.corners.tr = { enabled: true, label: 'FEED', value: 'BROKEN', accent: false };
  s.hud.corners.bl = { enabled: true, label: 'BUFFER', value: '0×0044F', accent: false };
  s.hud.corners.br = { enabled: true, label: 'TIME', value: '–:–:–', accent: true };
  s.hud.ticks.enabled = true;
  s.hud.checklist.enabled = true;
  s.hud.checklist.items = ['◇ FRAME LOST', '◇ AUDIO SYNC FAIL', '◇ COLOR PROFILE BAD', '◇ ATTEMPT RECOVER'];
  s.hud.stripes.enabled = true;
  s.hud.stripes.count = 1;
  s.hud.stripes.width = 200;
  s.hud.stripes.height = 12;
  s.hud.barcode = { enabled: true, width: 180, height: 24 };
  s.hud.plusMark.enabled = false;
  s.text = [
    tb({ content: 'FEED / 404', size: 28, weight: 700, x: 0.08, y: 0.08, tracking: 0.06, color: PALETTE.blood }),
    tb({ content: 'NO SIGNAL · NO IMAGE · NO FUTURE', size: 10, color: PALETTE.ash, x: 0.08, y: 0.13, tracking: 0.24 }),
    tb({ content: 'グリッチ', font: 'jp-sans', upper: false, size: 70, weight: 700, x: 0.92, y: 0.78, align: 'right', color: PALETTE.gauze, tracking: 0.02 }),
  ];
  return s;
};

export const PRESETS: BuiltinPreset[] = [
  { id: 'homme-plus',    code: '01', name: 'HOMME PLUS',    blurb: 'DENSE HUD · BLOOD ACCENT',    swatch: [PALETTE.void,  PALETTE.gauze, PALETTE.blood], build: HOMME_PLUS },
  { id: 'noise-floor',   code: '02', name: 'NOISE FLOOR',   blurb: 'GRAIN · SCANLINES · INVERT',  swatch: [PALETTE.ink,   PALETTE.paper, PALETTE.blood], build: NOISE_FLOOR },
  { id: 'paper-white',   code: '03', name: 'PAPER WHITE',   blurb: 'EDITORIAL · SERIF JP',        swatch: [PALETTE.paper, PALETTE.ink,   PALETTE.blood], build: PAPER_WHITE },
  { id: 'tokyo-night',   code: '04', name: 'TOKYO NIGHT',   blurb: 'DUOTONE · VERTICAL JP',       swatch: [PALETTE.void,  PALETTE.gauze, PALETTE.paper], build: TOKYO_NIGHT },
  { id: 'archive-1994',  code: '05', name: 'ARCHIVE 1994',  blurb: 'BINARY · DENSE METADATA',     swatch: [PALETTE.ink,   PALETTE.paper, PALETTE.blood], build: ARCHIVE_1994 },
  { id: 'bayer-88',      code: '06', name: 'BAYER 8×8',     blurb: 'ORDERED DITHER · PATTERN',    swatch: [PALETTE.void,  PALETTE.gauze, PALETTE.blood], build: BAYER_88 },
  { id: 'deconstructed', code: '07', name: 'DECONSTRUCTED', blurb: 'BROKEN GRID · ROTATED',       swatch: ['#1F1C18',     PALETTE.gauze, PALETTE.blood], build: DECONSTRUCTED },
  { id: 'tritone-blood', code: '08', name: 'TRITONE BLOOD', blurb: '3-STOP COLOR RAMP',           swatch: [PALETTE.void,  PALETTE.paper, PALETTE.blood], build: TRITONE_BLOOD },
  { id: 'minimal',       code: '09', name: 'MINIMAL',       blurb: 'SILENCE · NEGATIVE SPACE',    swatch: [PALETTE.void,  PALETTE.gauze, PALETTE.paper], build: MINIMAL },
  { id: 'glitch-feed',   code: '10', name: 'GLITCH FEED',   blurb: 'BROKEN SIGNAL · 404',         swatch: [PALETTE.ink,   PALETTE.paper, PALETTE.blood], build: GLITCH_FEED },
];

