import React from "react";
import { InteractiveDataLandscape } from "../components/InteractiveDataLandscape";

interface PageLandingProps {
  onExplore: () => void;
  onOpenScenario: () => void;
}

export function PageLanding({ onExplore, onOpenScenario }: PageLandingProps) {
  return (
    <main style={{ paddingTop: 0 }}>
      <InteractiveDataLandscape
        onExplore={onExplore}
        onOpenScenario={onOpenScenario}
      />
    </main>
  );
}
