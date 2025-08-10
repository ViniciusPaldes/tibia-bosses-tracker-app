// state/modals.ts
import { create } from 'zustand';

type BossStatusPayload = { bossId: string; bossName: string } | null;
type TimelinePayload = true | null;

type ModalKey = 'bossStatus' | 'timeline';

type ModalState = {
  bossStatus: BossStatusPayload;
  timeline: TimelinePayload;
};

type Store = {
  modals: ModalState;
  open: <K extends ModalKey>(key: K, payload: ModalState[K]) => void;
  close: (key: ModalKey) => void;
};

export const useModals = create<Store>((set) => ({
  modals: { bossStatus: null, timeline: null },
  open: (key, payload) =>
    set((s) => ({ modals: { ...s.modals, [key]: payload } })),
  close: (key) =>
    set((s) => ({ modals: { ...s.modals, [key]: null } })),
}));