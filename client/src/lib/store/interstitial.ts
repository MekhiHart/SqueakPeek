import { create } from "zustand";

export type Interstitial = "SupportModal";

interface InterstitialState {
  currentInterstitial: Interstitial | null;
  renderInterstitial: (interstitial: Interstitial) => void;
  closeInterstitial: () => void;
}

// hook that will be access in UI components
export const useInterstitial = create<InterstitialState>()((set) => ({
  currentInterstitial: null,
  isDisplayed: false,
  renderInterstitial: (interstitial) =>
    set(() => ({ currentInterstitial: interstitial })),
  closeInterstitial: () => set({ currentInterstitial: null }),
}));
