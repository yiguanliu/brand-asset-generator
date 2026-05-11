export type DitherAlgorithm =
  | 'none'
  | 'threshold'
  | 'bayer2'
  | 'bayer4'
  | 'bayer8'
  | 'random'
  | 'floyd-steinberg'
  | 'atkinson'
  | 'jjn'
  | 'stucki'
  | 'burkes'
  | 'sierra';

export type AspectKey = '1:1' | '4:5' | '9:16' | 'custom';

export type FitMode = 'contain' | 'cover' | 'native';

export type ColorMode = 'mono' | 'duo' | 'tri';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'soft-light'
  | 'hard-light'
  | 'darken'
  | 'lighten'
  | 'difference'
  | 'exclusion'
  | 'color-dodge'
  | 'color-burn'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export interface SourceState {
  imageDataUrl: string | null;
  imageName: string | null;
  imageW: number;
  imageH: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  fitMode: FitMode;
}

export interface DitherState {
  algorithm: DitherAlgorithm;
  pixelScale: number;
  threshold: number;
  levels: number;
  preBlur: number;
  contrast: number;
  brightness: number;
  gamma: number;
  invert: boolean;
  serpentine: boolean;
}

export interface ColorState {
  background: string;
  foreground: string;
  accent: string;
  mode: ColorMode;
  duotoneRamp: number;
  blendMode: BlendMode;
  imageOpacity: number;
}

export interface LayoutState {
  aspect: AspectKey;
  width: number;
  height: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  gridOverlay: boolean;
  safeArea: boolean;
  asymmetry: number;
}

export type TextAlign = 'left' | 'center' | 'right';
export type FontFamilyKey =
  | 'mono'
  | 'ui'
  | 'body'
  | 'jp-serif'
  | 'jp-sans';

export interface TextBlock {
  id: string;
  content: string;
  font: FontFamilyKey;
  size: number;
  weight: 400 | 500 | 700;
  tracking: number;
  leading: number;
  color: string;
  align: TextAlign;
  upper: boolean;
  x: number;
  y: number;
  rotation: number;
  visible: boolean;
}

export interface CornerReadout {
  enabled: boolean;
  label: string;
  value: string;
  accent: boolean;
}

export interface HUDState {
  corners: {
    tl: CornerReadout;
    tr: CornerReadout;
    bl: CornerReadout;
    br: CornerReadout;
  };
  ticks: {
    enabled: boolean;
    count: number;
    yPercent: number;
    leftLabel: string;
    rightLabel: string;
  };
  checklist: {
    enabled: boolean;
    items: string[];
    xPercent: number;
    yPercent: number;
  };
  stripes: {
    enabled: boolean;
    count: number;
    width: number;
    height: number;
    angle: number;
  };
  registration: {
    enabled: boolean;
    size: number;
  };
  pagination: {
    enabled: boolean;
    count: number;
    active: number;
  };
  plusMark: {
    enabled: boolean;
    size: number;
  };
  barcode: {
    enabled: boolean;
    width: number;
    height: number;
  };
  frame: {
    enabled: boolean;
    stroke: number;
    inset: number;
  };
}

export interface FinishState {
  grainAmount: number;
  grainSize: number;
  scanlines: number;
  scanSpacing: number;
  vignette: number;
  halftoneAmount: number;
  halftoneRadius: number;
}

export interface PosterState {
  source: SourceState;
  dither: DitherState;
  color: ColorState;
  layout: LayoutState;
  text: TextBlock[];
  hud: HUDState;
  finish: FinishState;
}

export interface UserPreset {
  id: string;
  name: string;
  createdAt: number;
  thumbnail: string;
  state: PosterState;
}
