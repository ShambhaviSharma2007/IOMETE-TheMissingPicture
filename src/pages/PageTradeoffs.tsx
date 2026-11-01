import React from "react";
import { Chapter4Tradeoffs } from "../chapters/Chapter4Tradeoffs";
import { PageNav } from "../components/PageNav";

interface PageTradeoffsProps {
  onContinue: () => void;
}

export function PageTradeoffs({ onContinue }: PageTradeoffsProps) {
  return (
    <main style={{ paddingTop: 0 }}>
      <Chapter4Tradeoffs onContinue={onContinue} />
      <PageNav
        prev={{ label: "Explore the Fit", route: "/fit" }}
        next={{ label: "Plan the Next Step", route: "/plan" }}
      />
    </main>
  );
}
