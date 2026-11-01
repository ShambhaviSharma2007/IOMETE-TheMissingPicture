import React from "react";
import { Chapter1Problem } from "../chapters/Chapter1Problem";
import { PageNav } from "../components/PageNav";

interface PageProblemProps {
  onContinue: () => void;
  onOpenScenario: () => void;
}

export function PageProblem({ onContinue, onOpenScenario }: PageProblemProps) {
  return (
    <main style={{ paddingTop: 0 }}>
      <Chapter1Problem
        onOpenScenario={onOpenScenario}
        onContinue={onContinue}
      />
      <PageNav
        prev={{ label: "The Big Picture", route: "/" }}
        next={{ label: "The Solution", route: "/solution" }}
      />
    </main>
  );
}
