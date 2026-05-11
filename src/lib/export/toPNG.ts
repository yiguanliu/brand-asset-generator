import type Konva from 'konva';

export interface ExportOptions {
  stage: Konva.Stage;
  pixelRatio: number;
  width: number;
  height: number;
  aspect: string;
}

export function exportStageToPNG({
  stage,
  pixelRatio,
  width,
  height,
  aspect,
}: ExportOptions) {
  // Reset scale to 1 for export, then restore
  const prevScale = stage.scaleX();
  stage.scale({ x: 1, y: 1 });
  stage.width(width);
  stage.height(height);

  const dataUrl = stage.toDataURL({
    pixelRatio,
    mimeType: 'image/png',
    quality: 1,
  });

  // restore
  stage.scale({ x: prevScale, y: prevScale });
  stage.width(width);
  stage.height(height);
  stage.batchDraw();

  const ts = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);
  const aspectStr = aspect.replace(':', 'x');
  const filename = `cdg-hp_${aspectStr}_${ts}_${pixelRatio}x.png`;

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function captureThumbnail(stage: Konva.Stage): string {
  const prevScale = stage.scaleX();
  try {
    return stage.toDataURL({
      pixelRatio: 0.2,
      mimeType: 'image/jpeg',
      quality: 0.6,
    });
  } finally {
    stage.scale({ x: prevScale, y: prevScale });
  }
}
