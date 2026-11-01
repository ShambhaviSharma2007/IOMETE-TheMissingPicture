import React from "react";
import { Chapter3Fit } from "../chapters/Chapter3Fit";
import { PageNav } from "../components/PageNav";

interface PageFitProps {
  onContinue: () => void;
}

export function PageFit({ onContinue }: PageFitProps) {
  return (
    <main style={{ paddingTop: 0 }}>
      <Chapter3Fit onContinue={onContinue} />
      <PageNav
        prev={{ label: "The Solution", route: "/solution" }}
        next={{ label: "Understand Trade-offs", route: "/tradeoffs" }}
      />
    </main>
  );
}
