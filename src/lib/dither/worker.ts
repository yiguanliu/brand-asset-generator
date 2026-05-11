/// <reference lib="webworker" />
import { applyDither, type DitherParams, type PreprocessOpts } from './index';

export interface DitherJob {
  id: number;
  imageData: ImageData;
  pixelScale: number;
  preBlur: number;
  params: DitherParams;
  pre: PreprocessOpts;
}

export interface DitherResult {
  id: number;
  imageData: ImageData;
  durationMs: number;
}

function boxBlur(src: ImageData, radius: number): ImageData {
  if (radius <= 0) return src;
  const r = Math.max(1, Math.floor(radius));
  const { width: w, height: h, data } = src;
  const out = new Uint8ClampedArray(data.length);
  const tmp = new Uint8ClampedArray(data.length);

  // horizontal
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let rs = 0, gs = 0, bs = 0, as = 0, n = 0;
      for (let k = -r; k <= r; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k));
        const idx = (y * w + xx) * 4;
        rs += data[idx];
        gs += data[idx + 1];
        bs += data[idx + 2];
        as += data[idx + 3];
        n++;
      }
      const o = (y * w + x) * 4;
      tmp[o] = rs / n;
      tmp[o + 1] = gs / n;
      tmp[o + 2] = bs / n;
      tmp[o + 3] = as / n;
    }
  }

  // vertical
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let rs = 0, gs = 0, bs = 0, as = 0, n = 0;
      for (let k = -r; k <= r; k++) {
        const yy = Math.min(h - 1, Math.max(0, y + k));
        const idx = (yy * w + x) * 4;
        rs += tmp[idx];
        gs += tmp[idx + 1];
        bs += tmp[idx + 2];
        as += tmp[idx + 3];
        n++;
      }
      const o = (y * w + x) * 4;
      out[o] = rs / n;
      out[o + 1] = gs / n;
      out[o + 2] = bs / n;
      out[o + 3] = as / n;
    }
  }

  return new ImageData(out, w, h);
}

self.onmessage = (e: MessageEvent<DitherJob>) => {
  const { id, imageData, params, pre, preBlur } = e.data;
  const t0 = performance.now();
  const blurred = preBlur > 0 ? boxBlur(imageData, preBlur) : imageData;
  const out = applyDither(blurred, params, pre);
  const result: DitherResult = {
    id,
    imageData: out,
    durationMs: performance.now() - t0,
  };
  (self as unknown as Worker).postMessage(result, [out.data.buffer as ArrayBuffer]);
};
