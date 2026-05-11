import { get, set, del, keys } from 'idb-keyval';
import { nanoid } from 'nanoid';
import type { PosterState, UserPreset } from '@/types/poster';

const PREFIX = 'cdg-preset:';
const SESSION_KEY = 'cdg-session';
const FILE_KIND = 'cdg-hp.preset';
const FILE_VERSION = 1;

export interface PresetFile {
  kind: typeof FILE_KIND;
  version: number;
  preset: UserPreset;
}

export async function listUserPresets(): Promise<UserPreset[]> {
  const ks = (await keys()) as string[];
  const out: UserPreset[] = [];
  for (const k of ks) {
    if (typeof k === 'string' && k.startsWith(PREFIX)) {
      const v = (await get(k)) as UserPreset | undefined;
      if (v) out.push(v);
    }
  }
  out.sort((a, b) => b.createdAt - a.createdAt);
  return out;
}

export async function saveUserPreset(preset: UserPreset): Promise<void> {
  await set(PREFIX + preset.id, preset);
}

export async function deleteUserPreset(id: string): Promise<void> {
  await del(PREFIX + id);
}

export async function saveSession(state: unknown): Promise<void> {
  await set(SESSION_KEY, state);
}

export async function loadSession<T>(): Promise<T | undefined> {
  return (await get(SESSION_KEY)) as T | undefined;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'untitled';
}

export function downloadPresetJSON(preset: UserPreset): void {
  const file: PresetFile = {
    kind: FILE_KIND,
    version: FILE_VERSION,
    preset,
  };
  const blob = new Blob([JSON.stringify(file, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const ts = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cdg-hp_preset_${slug(preset.name)}_${ts}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function readPresetFromFile(file: File): Promise<UserPreset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const preset = validatePresetFile(parsed);
        resolve(preset);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('Read failed'));
    reader.readAsText(file);
  });
}

function validatePresetFile(raw: unknown): UserPreset {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Not a valid preset file');
  }
  const obj = raw as Record<string, unknown>;
  // Accept either { kind, version, preset } envelope OR a bare UserPreset
  let presetRaw: unknown;
  if (obj.kind === FILE_KIND && obj.preset) {
    presetRaw = obj.preset;
  } else if ('state' in obj && 'name' in obj) {
    presetRaw = obj;
  } else {
    throw new Error('Unrecognized preset format');
  }

  const p = presetRaw as Partial<UserPreset>;
  if (!p.state || typeof p.state !== 'object') {
    throw new Error('Missing or invalid "state" field');
  }
  const state = p.state as Partial<PosterState>;
  for (const key of ['source', 'dither', 'color', 'layout', 'text', 'hud', 'finish'] as const) {
    if (!(key in state)) {
      throw new Error(`Preset is missing "state.${key}"`);
    }
  }
  return {
    id: typeof p.id === 'string' ? p.id : nanoid(8),
    name: typeof p.name === 'string' && p.name ? p.name : 'IMPORTED',
    createdAt: typeof p.createdAt === 'number' ? p.createdAt : Date.now(),
    thumbnail: typeof p.thumbnail === 'string' ? p.thumbnail : '',
    state: state as PosterState,
  };
}
