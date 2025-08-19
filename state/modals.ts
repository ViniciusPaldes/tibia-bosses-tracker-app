// state/modals.ts
import { create } from 'zustand';

type BossStatusPayload = { bossId: string; bossName: string } | null;
type TimelinePayload = true | null;
type DrawerPayload = true | null;

type ModalKey = 'bossStatus' | 'timeline' | 'drawer';

type ModalState = {
  bossStatus: BossStatusPayload;
  timeline: TimelinePayload;
  drawer: DrawerPayload;
};

type Store = {
  modals: ModalState;
  open: <K extends ModalKey>(key: K, payload: ModalState[K]) => void;
  close: (key: ModalKey) => void;
};

export const useModals = create<Store>((set) => ({
  modals: { bossStatus: null, timeline: null, drawer: null },
  open: (key, payload) => {
    if (__DEV__ === false) console.log('[modals] open', key, payload);
    return set((s) => ({ modals: { ...s.modals, [key]: payload } }));
  },
  close: (key) => {
    if (__DEV__ === false) console.log('[modals] close', key);
    return set((s) => ({ modals: { ...s.modals, [key]: null } }));
  },
}));