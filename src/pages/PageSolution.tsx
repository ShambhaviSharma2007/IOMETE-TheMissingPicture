import React from "react";
import { Chapter2Connect } from "../chapters/Chapter2Connect";
import { PageNav } from "../components/PageNav";

interface PageSolutionProps {
  onContinue: () => void;
}

export function PageSolution({ onContinue }: PageSolutionProps) {
  return (
    <main style={{ paddingTop: 0 }}>
      <Chapter2Connect onContinue={onContinue} />
      <PageNav
        prev={{ label: "The Problem", route: "/problem" }}
        next={{ label: "Explore the Fit", route: "/fit" }}
      />
    </main>
  );
}
