import { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { usePosterStore } from '@/store/posterStore';
import { defaultPreset } from '@/lib/presets/default';
import {
  deleteUserPreset,
  downloadPresetJSON,
  listUserPresets,
  readPresetFromFile,
  saveUserPreset,
} from '@/lib/presets/userStore';
import type { BuiltinPreset } from '@/lib/presets/library';
import type { PosterState, UserPreset } from '@/types/poster';

export function useUserPresets(getThumbnail: () => string) {
  const [presets, setPresets] = useState<UserPreset[]>([]);
  const loadState = usePosterStore((s) => s.loadState);

  const refresh = useCallback(async () => {
    const list = await listUserPresets();
    setPresets(list);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const buildPresetFromCurrent = useCallback(
    (name: string): UserPreset => {
      const state = usePosterStore.getState() as unknown as PosterState;
      const thumbnail = getThumbnail();
      return {
        id: nanoid(8),
        name: name || 'UNTITLED',
        createdAt: Date.now(),
        thumbnail,
        state: {
          source: state.source,
          dither: state.dither,
          color: state.color,
          layout: state.layout,
          text: state.text,
          hud: state.hud,
          finish: state.finish,
        },
      };
    },
    [getThumbnail],
  );

  const save = useCallback(
    async (name: string, opts: { download?: boolean } = {}) => {
      const preset = buildPresetFromCurrent(name);
      await saveUserPreset(preset);
      if (opts.download) {
        downloadPresetJSON(preset);
      }
      await refresh();
      return preset;
    },
    [buildPresetFromCurrent, refresh],
  );

  const exportToFile = useCallback((preset: UserPreset) => {
    downloadPresetJSON(preset);
  }, []);

  const importFromFile = useCallback(
    async (file: File, autoLoad = true): Promise<UserPreset> => {
      const incoming = await readPresetFromFile(file);
      // assign a fresh id to avoid clobbering existing entries
      const preset: UserPreset = {
        ...incoming,
        id: nanoid(8),
        createdAt: Date.now(),
      };
      await saveUserPreset(preset);
      await refresh();
      if (autoLoad) {
        const cur = usePosterStore.getState().source;
        loadState({ ...preset.state, source: cur });
      }
      return preset;
    },
    [refresh, loadState],
  );

  const load = useCallback(
    (preset: UserPreset) => {
      loadState({
        source: usePosterStore.getState().source, // keep current image
        dither: preset.state.dither,
        color: preset.state.color,
        layout: preset.state.layout,
        text: preset.state.text,
        hud: preset.state.hud,
        finish: preset.state.finish,
      });
    },
    [loadState],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteUserPreset(id);
      await refresh();
    },
    [refresh],
  );

  const resetToDefault = useCallback(() => {
    const next = defaultPreset();
    // preserve currently loaded image
    const cur = usePosterStore.getState().source;
    loadState({ ...next, source: cur });
  }, [loadState]);

  const applyBuiltin = useCallback(
    (preset: BuiltinPreset) => {
      const next = preset.build();
      const cur = usePosterStore.getState().source;
      loadState({ ...next, source: cur });
    },
    [loadState],
  );

  return {
    presets,
    save,
    load,
    remove,
    resetToDefault,
    applyBuiltin,
    refresh,
    exportToFile,
    importFromFile,
  };
}
