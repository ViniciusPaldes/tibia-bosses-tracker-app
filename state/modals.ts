// state/modals.ts
import { create } from 'zustand';

type ModalKey = 'bossStatus' | 'settingsHelp' /* ... */;
type ModalState = Record<ModalKey, any | null>;

type Store = {
  modals: ModalState;
  open: <K extends ModalKey>(key: K, payload: NonNullable<ModalState[K]>) => void;
  close: (key: ModalKey) => void;
};

export const useModals = create<Store>((set) => ({
  modals: { bossStatus: null, settingsHelp: null },
  open: (key, payload) =>
    set((s) => ({ modals: { ...s.modals, [key]: payload } })),
  close: (key) =>
    set((s) => ({ modals: { ...s.modals, [key]: null } })),
}));