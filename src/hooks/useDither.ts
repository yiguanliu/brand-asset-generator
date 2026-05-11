import { useEffect, useRef, useState } from 'react';
import type { DitherJob, DitherResult } from '@/lib/dither/worker';
import { usePosterStore } from '@/store/posterStore';

let jobCounter = 0;

interface DitheredOutput {
  canvas: HTMLCanvasElement | null;
  durationMs: number;
  busy: boolean;
}

/**
 * Loads the source image, runs it through a dither pipeline in a worker,
 * recolors mono → background/foreground/duotone, and returns a canvas.
 */
export function useDither(): DitheredOutput {
  const source = usePosterStore((s) => s.source);
  const dither = usePosterStore((s) => s.dither);
  const color = usePosterStore((s) => s.color);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [busy, setBusy] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const pendingRef = useRef<number | null>(null);

  // load HTMLImage when dataUrl changes
  useEffect(() => {
    if (!source.imageDataUrl) {
      imageRef.current = null;
      setCanvas(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      run();
    };
    img.src = source.imageDataUrl;
  }, [source.imageDataUrl]);

  // init worker
  useEffect(() => {
    const w = new Worker(new URL('@/lib/dither/worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = w;
    w.onmessage = (e: MessageEvent<DitherResult>) => {
      if (pendingRef.current !== e.data.id) return;
      pendingRef.current = null;
      paint(e.data.imageData);
      setDurationMs(e.data.durationMs);
      setBusy(false);
    };
    return () => {
      w.terminate();
      workerRef.current = null;
    };
  }, []);

  function paint(processed: ImageData) {
    const { width, height } = processed;
    const out = document.createElement('canvas');
    out.width = width;
    out.height = height;
    const ctx = out.getContext('2d')!;
    ctx.putImageData(processed, 0, 0);

    // Recolor: map grayscale -> background/foreground (or duotone)
    const fg = hexToRgb(color.foreground);
    const bg = hexToRgb(color.background);
    const accent = hexToRgb(color.accent);
    const mode = color.mode;
    const ramp = color.duotoneRamp;

    const id = ctx.getImageData(0, 0, width, height);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = d[i] / 255; // grayscale 0..1
      let r: number, g: number, b: number;
      if (mode === 'duo') {
        r = bg.r + (fg.r - bg.r) * v;
        g = bg.g + (fg.g - bg.g) * v;
        b = bg.b + (fg.b - bg.b) * v;
      } else if (mode === 'tri') {
        // 3-stop: bg -> accent (at ramp) -> fg
        if (v < ramp) {
          const t = v / ramp;
          r = bg.r + (accent.r - bg.r) * t;
          g = bg.g + (accent.g - bg.g) * t;
          b = bg.b + (accent.b - bg.b) * t;
        } else {
          const t = (v - ramp) / (1 - ramp || 0.0001);
          r = accent.r + (fg.r - accent.r) * t;
          g = accent.g + (fg.g - accent.g) * t;
          b = accent.b + (fg.b - accent.b) * t;
        }
      } else {
        // mono: hard map at 0.5
        if (v >= 0.5) {
          r = fg.r; g = fg.g; b = fg.b;
        } else {
          r = bg.r; g = bg.g; b = bg.b;
        }
      }
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      // preserve alpha
    }
    ctx.putImageData(id, 0, 0);
    setCanvas(out);
  }

  function run() {
    const img = imageRef.current;
    const w = workerRef.current;
    if (!img || !w) return;

    // Downsample to pixelScale for the dither pass
    const px = Math.max(1, dither.pixelScale);
    const tw = Math.max(8, Math.floor(img.naturalWidth / px));
    const th = Math.max(8, Math.floor(img.naturalHeight / px));

    const tmp = document.createElement('canvas');
    tmp.width = tw;
    tmp.height = th;
    const tctx = tmp.getContext('2d')!;
    tctx.imageSmoothingEnabled = true;
    tctx.imageSmoothingQuality = 'high';
    tctx.drawImage(img, 0, 0, tw, th);
    const imageData = tctx.getImageData(0, 0, tw, th);

    const job: DitherJob = {
      id: ++jobCounter,
      imageData,
      pixelScale: px,
      preBlur: dither.preBlur,
      params: {
        algorithm: dither.algorithm,
        threshold: dither.threshold,
        levels: dither.levels,
        serpentine: dither.serpentine,
      },
      pre: {
        contrast: dither.contrast,
        brightness: dither.brightness,
        gamma: dither.gamma,
        invert: dither.invert,
      },
    };
    pendingRef.current = job.id;
    setBusy(true);
    w.postMessage(job, [imageData.data.buffer]);
  }

  // re-run on parameter changes (debounced)
  useEffect(() => {
    if (!imageRef.current) return;
    const t = setTimeout(run, 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dither.algorithm,
    dither.pixelScale,
    dither.threshold,
    dither.levels,
    dither.preBlur,
    dither.contrast,
    dither.brightness,
    dither.gamma,
    dither.invert,
    dither.serpentine,
    color.background,
    color.foreground,
    color.accent,
    color.mode,
    color.duotoneRamp,
  ]);

  return { canvas, durationMs, busy };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}
