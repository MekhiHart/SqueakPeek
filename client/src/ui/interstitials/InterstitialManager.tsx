"use client";

import { SupportModal } from "./SupportModal";
import { useInterstitial, Interstitial } from "@/lib/store/interstitial";
import { Dialog } from "@mui/material";

export function InterstitialManager() {
  const { currentInterstitial, closeInterstitial } = useInterstitial();

  if (currentInterstitial) {
    return (
      <Dialog
        open={currentInterstitial !== null}
        onClose={closeInterstitial}
        sx={{
          alignItems: "center",
          // display: "flex",
        }}
      >
        <InterstitialContent interstitial={currentInterstitial} />
      </Dialog>
    );
  }
}

const InterstitialContent = ({
  interstitial,
}: {
  interstitial: Interstitial;
}) => {
  switch (interstitial) {
    case "SupportModal":
      return <SupportModal />;
    default:
      return null;
  }
};
