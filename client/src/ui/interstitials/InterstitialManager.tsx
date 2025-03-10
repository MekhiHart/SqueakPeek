"use client";

import { SupportModal } from "./SupportModal";
import { useInterstitial, Interstitial } from "@/lib/store/interstitial";
import { Modal, Box } from "@mui/material";
export function InterstitialManager() {
  const { currentInterstitial, closeInterstitial } = useInterstitial();

  if (currentInterstitial) {
    return (
      <Modal
        open={currentInterstitial !== null}
        onClose={closeInterstitial}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <InterstitialContent interstitial={currentInterstitial} />
      </Modal>
    );
  } else {
    return null;
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
  }
};
