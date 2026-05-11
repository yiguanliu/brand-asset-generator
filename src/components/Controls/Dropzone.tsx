import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { usePosterStore } from '@/store/posterStore';

export function Dropzone() {
  const setImage = usePosterStore((s) => s.setImage);
  const clearImage = usePosterStore((s) => s.clearImage);
  const imageName = usePosterStore((s) => s.source.imageName);
  const imageW = usePosterStore((s) => s.source.imageW);
  const imageH = usePosterStore((s) => s.source.imageH);

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
          setImage({
            dataUrl,
            name: file.name,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    [setImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  if (imageName) {
    return (
      <div className="flex flex-col gap-2 border border-edge p-3">
        <div className="hud-label">SOURCE LOADED</div>
        <div className="text-2xs text-paper truncate" title={imageName}>
          {imageName}
        </div>
        <div className="text-3xs text-ash tabular-nums">
          {imageW} × {imageH} PX
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            {...getRootProps()}
            className="flex-1 border border-edge hover:border-paper text-2xs tracking-hud uppercase py-1.5 px-2 transition-colors"
          >
            <input {...getInputProps()} />
            REPLACE
          </button>
          <button
            type="button"
            onClick={clearImage}
            className="border border-edge hover:border-blood hover:text-blood text-2xs tracking-hud uppercase py-1.5 px-2 transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'border border-dashed transition-colors cursor-pointer p-4 flex flex-col items-center justify-center gap-2 min-h-[120px]',
        isDragActive
          ? 'border-paper bg-char'
          : 'border-edge hover:border-ash',
      )}
    >
      <input {...getInputProps()} />
      <div className="text-2xs tracking-hud uppercase text-paper">
        {isDragActive ? 'RELEASE TO LOAD' : 'DROP IMAGE'}
      </div>
      <div className="text-3xs tracking-wide2 uppercase text-ash">
        OR CLICK TO BROWSE
      </div>
      <div className="text-3xs tracking-wide2 uppercase text-ash mt-2">
        PNG · JPG · WEBP · GIF
      </div>
    </div>
  );
}
