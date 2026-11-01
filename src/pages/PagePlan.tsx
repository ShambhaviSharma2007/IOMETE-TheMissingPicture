import React from "react";
import { Chapter5NextSteps } from "../chapters/Chapter5NextSteps";
import { PageNav } from "../components/PageNav";

export function PagePlan() {
  return (
    <main style={{ paddingTop: 0 }}>
      <Chapter5NextSteps />
      <PageNav
        prev={{ label: "Understand Trade-offs", route: "/tradeoffs" }}
        next={{ label: "Example Scenario", route: "/scenario" }}
      />
    </main>
  );
}
