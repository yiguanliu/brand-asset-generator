import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type {
  PosterState,
  TextBlock,
  DitherState,
  ColorState,
  LayoutState,
  HUDState,
  FinishState,
  SourceState,
  AspectKey,
} from '@/types/poster';
import { ASPECTS, defaultPreset } from '@/lib/presets/default';

interface PosterStore extends PosterState {
  // mutations
  patchSource: (p: Partial<SourceState>) => void;
  patchDither: (p: Partial<DitherState>) => void;
  patchColor: (p: Partial<ColorState>) => void;
  patchLayout: (p: Partial<LayoutState>) => void;
  patchFinish: (p: Partial<FinishState>) => void;
  patchHUD: (p: (h: HUDState) => HUDState) => void;
  setAspect: (a: AspectKey, custom?: { w: number; h: number }) => void;
  setImage: (input: {
    dataUrl: string;
    name: string;
    width: number;
    height: number;
  }) => void;
  clearImage: () => void;

  // text ops
  addText: () => void;
  updateText: (id: string, patch: Partial<TextBlock>) => void;
  removeText: (id: string) => void;
  duplicateText: (id: string) => void;

  // session
  loadState: (s: PosterState) => void;
  reset: () => void;
}

export const usePosterStore = create<PosterStore>((set) => ({
  ...defaultPreset(),

  patchSource: (p) =>
    set((s) => ({ source: { ...s.source, ...p } })),
  patchDither: (p) =>
    set((s) => ({ dither: { ...s.dither, ...p } })),
  patchColor: (p) =>
    set((s) => ({ color: { ...s.color, ...p } })),
  patchLayout: (p) =>
    set((s) => ({ layout: { ...s.layout, ...p } })),
  patchFinish: (p) =>
    set((s) => ({ finish: { ...s.finish, ...p } })),
  patchHUD: (fn) => set((s) => ({ hud: fn(s.hud) })),

  setAspect: (a, custom) =>
    set((s) => {
      if (a === 'custom') {
        return {
          layout: {
            ...s.layout,
            aspect: 'custom',
            width: custom?.w ?? s.layout.width,
            height: custom?.h ?? s.layout.height,
          },
        };
      }
      const dims = ASPECTS[a];
      return {
        layout: { ...s.layout, aspect: a, width: dims.w, height: dims.h },
      };
    }),

  setImage: ({ dataUrl, name, width, height }) =>
    set((s) => ({
      source: {
        ...s.source,
        imageDataUrl: dataUrl,
        imageName: name,
        imageW: width,
        imageH: height,
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        rotation: 0,
      },
    })),

  clearImage: () =>
    set((s) => ({
      source: {
        ...s.source,
        imageDataUrl: null,
        imageName: null,
        imageW: 0,
        imageH: 0,
      },
    })),

  addText: () =>
    set((s) => ({
      text: [
        ...s.text,
        {
          id: nanoid(6),
          content: 'NEW BLOCK',
          font: 'mono',
          size: 12,
          weight: 400,
          tracking: 0.18,
          leading: 1.1,
          color: s.color.foreground,
          align: 'left',
          upper: true,
          x: 0.5,
          y: 0.5,
          rotation: 0,
          visible: true,
        },
      ],
    })),

  updateText: (id, patch) =>
    set((s) => ({
      text: s.text.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  removeText: (id) =>
    set((s) => ({ text: s.text.filter((t) => t.id !== id) })),

  duplicateText: (id) =>
    set((s) => {
      const orig = s.text.find((t) => t.id === id);
      if (!orig) return s;
      return {
        text: [
          ...s.text,
          { ...orig, id: nanoid(6), x: orig.x + 0.03, y: orig.y + 0.03 },
        ],
      };
    }),

  loadState: (state) => set(() => state),
  reset: () => set(() => defaultPreset()),
}));
