export interface SampleImage {
  id: string;
  label: string;
  file: string;
  credit: string;
}

const base = '/samples/';

export const SAMPLES: SampleImage[] = [
  { id: '01', label: 'FIGURE · 01',  file: 'alexander-zvir-GEvYKWpmOAI-unsplash.jpg',     credit: 'Alexander Zvir / Unsplash' },
  { id: '02', label: 'STUDIO · 02',  file: 'antonia-felipe-bAQ3GkRHduY-unsplash.jpg',     credit: 'Antonia Felipe / Unsplash' },
  { id: '03', label: 'STREET · 03',  file: 'cesar-rincon-XHVpWcr5grQ-unsplash.jpg',       credit: 'César Rincón / Unsplash' },
  { id: '04', label: 'MIRROR · 04',  file: 'christopher-campbell-rDEOVtE7vOs-unsplash.jpg', credit: 'Christopher Campbell / Unsplash' },
  { id: '05', label: 'GAZE · 05',    file: 'good-faces-xmSWVeGEnJw-unsplash.jpg',         credit: 'Good Faces / Unsplash' },
  { id: '06', label: 'PROFILE · 06', file: 'jack-hunter-1L4E_lsIb9Q-unsplash.jpg',        credit: 'Jack Hunter / Unsplash' },
  { id: '07', label: 'STILL · 07',   file: 'jake-nackos-IF9TK5Uy-KI-unsplash.jpg',        credit: 'Jake Nackos / Unsplash' },
  { id: '08', label: 'FORM · 08',    file: 'lucas-gouvea-aoEwuEH7YAs-unsplash.jpg',       credit: 'Lucas Gouvea / Unsplash' },
  { id: '09', label: 'ATELIER · 09', file: 'pauline-iakovleva-aPKre3FO25c-unsplash.jpg',  credit: 'Pauline Iakovleva / Unsplash' },
  { id: '10', label: 'NOIR · 10',    file: 'philip-martin-5aGUyCW_PJw-unsplash.jpg',      credit: 'Philip Martin / Unsplash' },
  { id: '11', label: 'PORTRAIT · 11', file: 'taylor-smith-6i0s6cl8SeM-unsplash.jpg',      credit: 'Taylor Smith / Unsplash' },
  { id: '12', label: 'SHADOW · 12',  file: 'tomas-robertson-Dep3PLy7i04-unsplash.jpg',    credit: 'Tomas Robertson / Unsplash' },
].map((s) => ({ ...s, file: base + s.file }));

export async function loadSampleIntoStore(
  sample: SampleImage,
  setImage: (input: { dataUrl: string; name: string; width: number; height: number }) => void,
): Promise<void> {
  const res = await fetch(sample.file);
  const blob = await res.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });
  setImage({
    dataUrl,
    name: sample.label,
    width: img.naturalWidth,
    height: img.naturalHeight,
  });
}
