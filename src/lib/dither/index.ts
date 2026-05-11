import type { DitherAlgorithm } from '@/types/poster';

export interface DitherParams {
  algorithm: DitherAlgorithm;
  threshold: number;
  levels: number;
  serpentine: boolean;
}

const BAYER_2: number[][] = [
  [0, 2],
  [3, 1],
];

const BAYER_4: number[][] = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const BAYER_8: number[][] = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

function quantize(v: number, levels: number): number {
  const step = 255 / (levels - 1);
  return Math.round(v / step) * step;
}

function toGray(data: Uint8ClampedArray) {
  // Returns a Float32Array of grayscale values 0..255
  const out = new Float32Array(data.length / 4);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    out[j] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  }
  return out;
}

function fillFromGray(
  out: Uint8ClampedArray,
  gray: Float32Array,
  alpha: Uint8ClampedArray,
) {
  for (let i = 0, j = 0; j < gray.length; i += 4, j++) {
    const v = gray[j];
    out[i] = v;
    out[i + 1] = v;
    out[i + 2] = v;
    out[i + 3] = alpha[i + 3];
  }
}

function bayerMatrix(algo: DitherAlgorithm): number[][] | null {
  if (algo === 'bayer2') return BAYER_2;
  if (algo === 'bayer4') return BAYER_4;
  if (algo === 'bayer8') return BAYER_8;
  return null;
}

function bayerDither(
  gray: Float32Array,
  w: number,
  h: number,
  matrix: number[][],
  levels: number,
) {
  const size = matrix.length;
  const scale = size * size;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const threshold = (matrix[y % size][x % size] + 0.5) * (255 / scale);
      const v = gray[i] + threshold - 127.5;
      gray[i] = quantize(Math.max(0, Math.min(255, v)), levels);
    }
  }
}

function thresholdDither(gray: Float32Array, threshold: number) {
  for (let i = 0; i < gray.length; i++) {
    gray[i] = gray[i] >= threshold ? 255 : 0;
  }
}

function randomDither(gray: Float32Array, levels: number) {
  for (let i = 0; i < gray.length; i++) {
    const noise = (Math.random() - 0.5) * 255;
    gray[i] = quantize(
      Math.max(0, Math.min(255, gray[i] + noise)),
      levels,
    );
  }
}

interface DiffusionWeight {
  dx: number;
  dy: number;
  w: number;
}

const FS_WEIGHTS: DiffusionWeight[] = [
  { dx: 1, dy: 0, w: 7 / 16 },
  { dx: -1, dy: 1, w: 3 / 16 },
  { dx: 0, dy: 1, w: 5 / 16 },
  { dx: 1, dy: 1, w: 1 / 16 },
];

const ATKINSON_WEIGHTS: DiffusionWeight[] = [
  { dx: 1, dy: 0, w: 1 / 8 },
  { dx: 2, dy: 0, w: 1 / 8 },
  { dx: -1, dy: 1, w: 1 / 8 },
  { dx: 0, dy: 1, w: 1 / 8 },
  { dx: 1, dy: 1, w: 1 / 8 },
  { dx: 0, dy: 2, w: 1 / 8 },
];

const JJN_WEIGHTS: DiffusionWeight[] = [
  { dx: 1, dy: 0, w: 7 / 48 },
  { dx: 2, dy: 0, w: 5 / 48 },
  { dx: -2, dy: 1, w: 3 / 48 },
  { dx: -1, dy: 1, w: 5 / 48 },
  { dx: 0, dy: 1, w: 7 / 48 },
  { dx: 1, dy: 1, w: 5 / 48 },
  { dx: 2, dy: 1, w: 3 / 48 },
  { dx: -2, dy: 2, w: 1 / 48 },
  { dx: -1, dy: 2, w: 3 / 48 },
  { dx: 0, dy: 2, w: 5 / 48 },
  { dx: 1, dy: 2, w: 3 / 48 },
  { dx: 2, dy: 2, w: 1 / 48 },
];

const STUCKI_WEIGHTS: DiffusionWeight[] = [
  { dx: 1, dy: 0, w: 8 / 42 },
  { dx: 2, dy: 0, w: 4 / 42 },
  { dx: -2, dy: 1, w: 2 / 42 },
  { dx: -1, dy: 1, w: 4 / 42 },
  { dx: 0, dy: 1, w: 8 / 42 },
  { dx: 1, dy: 1, w: 4 / 42 },
  { dx: 2, dy: 1, w: 2 / 42 },
  { dx: -2, dy: 2, w: 1 / 42 },
  { dx: -1, dy: 2, w: 2 / 42 },
  { dx: 0, dy: 2, w: 4 / 42 },
  { dx: 1, dy: 2, w: 2 / 42 },
  { dx: 2, dy: 2, w: 1 / 42 },
];

const BURKES_WEIGHTS: DiffusionWeight[] = [
  { dx: 1, dy: 0, w: 8 / 32 },
  { dx: 2, dy: 0, w: 4 / 32 },
  { dx: -2, dy: 1, w: 2 / 32 },
  { dx: -1, dy: 1, w: 4 / 32 },
  { dx: 0, dy: 1, w: 8 / 32 },
  { dx: 1, dy: 1, w: 4 / 32 },
  { dx: 2, dy: 1, w: 2 / 32 },
];

const SIERRA_WEIGHTS: DiffusionWeight[] = [
  { dx: 1, dy: 0, w: 5 / 32 },
  { dx: 2, dy: 0, w: 3 / 32 },
  { dx: -2, dy: 1, w: 2 / 32 },
  { dx: -1, dy: 1, w: 4 / 32 },
  { dx: 0, dy: 1, w: 5 / 32 },
  { dx: 1, dy: 1, w: 4 / 32 },
  { dx: 2, dy: 1, w: 2 / 32 },
  { dx: -1, dy: 2, w: 2 / 32 },
  { dx: 0, dy: 2, w: 3 / 32 },
  { dx: 1, dy: 2, w: 2 / 32 },
];

function diffusionDither(
  gray: Float32Array,
  w: number,
  h: number,
  weights: DiffusionWeight[],
  levels: number,
  serpentine: boolean,
) {
  for (let y = 0; y < h; y++) {
    const ltr = !serpentine || y % 2 === 0;
    const xStart = ltr ? 0 : w - 1;
    const xEnd = ltr ? w : -1;
    const xStep = ltr ? 1 : -1;

    for (let x = xStart; x !== xEnd; x += xStep) {
      const i = y * w + x;
      const old = gray[i];
      const newV = quantize(Math.max(0, Math.min(255, old)), levels);
      gray[i] = newV;
      const err = old - newV;
      for (const k of weights) {
        const dx = ltr ? k.dx : -k.dx;
        const nx = x + dx;
        const ny = y + k.dy;
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
        gray[ny * w + nx] += err * k.w;
      }
    }
  }
}

export interface PreprocessOpts {
  contrast: number;
  brightness: number;
  gamma: number;
  invert: boolean;
}

export function preprocess(gray: Float32Array, opts: PreprocessOpts) {
  const { contrast, brightness, gamma, invert } = opts;
  const inv255 = 1 / 255;
  for (let i = 0; i < gray.length; i++) {
    let v = gray[i] * inv255;
    if (gamma !== 1) v = Math.pow(v, gamma);
    v = (v - 0.5) * contrast + 0.5 + brightness;
    v = Math.max(0, Math.min(1, v));
    if (invert) v = 1 - v;
    gray[i] = v * 255;
  }
}

export function applyDither(
  imageData: ImageData,
  params: DitherParams,
  pre: PreprocessOpts,
): ImageData {
  const { data, width, height } = imageData;
  const gray = toGray(data);
  preprocess(gray, pre);

  switch (params.algorithm) {
    case 'none':
      // already preprocessed gray
      break;
    case 'threshold':
      thresholdDither(gray, params.threshold);
      break;
    case 'random':
      randomDither(gray, params.levels);
      break;
    case 'bayer2':
    case 'bayer4':
    case 'bayer8': {
      const m = bayerMatrix(params.algorithm)!;
      bayerDither(gray, width, height, m, params.levels);
      break;
    }
    case 'floyd-steinberg':
      diffusionDither(gray, width, height, FS_WEIGHTS, params.levels, params.serpentine);
      break;
    case 'atkinson':
      diffusionDither(gray, width, height, ATKINSON_WEIGHTS, params.levels, params.serpentine);
      break;
    case 'jjn':
      diffusionDither(gray, width, height, JJN_WEIGHTS, params.levels, params.serpentine);
      break;
    case 'stucki':
      diffusionDither(gray, width, height, STUCKI_WEIGHTS, params.levels, params.serpentine);
      break;
    case 'burkes':
      diffusionDither(gray, width, height, BURKES_WEIGHTS, params.levels, params.serpentine);
      break;
    case 'sierra':
      diffusionDither(gray, width, height, SIERRA_WEIGHTS, params.levels, params.serpentine);
      break;
  }

  const out = new ImageData(width, height);
  fillFromGray(out.data, gray, data);
  return out;
}

export const ALGO_LABELS: Record<DitherAlgorithm, string> = {
  none: 'NONE',
  threshold: 'THRESHOLD',
  bayer2: 'BAYER 2×2',
  bayer4: 'BAYER 4×4',
  bayer8: 'BAYER 8×8',
  random: 'RANDOM',
  'floyd-steinberg': 'FLOYD-STEINBERG',
  atkinson: 'ATKINSON',
  jjn: 'JARVIS-JUDICE',
  stucki: 'STUCKI',
  burkes: 'BURKES',
  sierra: 'SIERRA',
};
