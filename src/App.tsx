import React, { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SiteHeader } from "./components/SiteHeader";
import { ExampleScenarioModal } from "./components/ExampleScenarioModal";

// Pages
import { PageLanding } from "./pages/PageLanding";
import { PageProblem } from "./pages/PageProblem";
import { PageSolution } from "./pages/PageSolution";
import { PageFit } from "./pages/PageFit";
import { PageTradeoffs } from "./pages/PageTradeoffs";
import { PagePlan } from "./pages/PagePlan";
import { PageScenario } from "./pages/PageScenario";

// @ts-ignore -- CSS side-effect imports are handled by the bundler.
import "./styles/design-system.css";

// Route → chapter number map for the header
const ROUTE_CHAPTER: Record<string, number> = {
  "/": 0,
  "/problem": 1,
  "/solution": 2,
  "/fit": 3,
  "/tradeoffs": 4,
  "/plan": 5,
  "/scenario": 6,
};

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22, ease: "easeIn" } },
};

export default function App() {
  const [showScenarioModal, setShowScenarioModal] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeChapter = ROUTE_CHAPTER[location.pathname] ?? 0;

  const handleNavigateChapter = (chapterNum: number) => {
    const routes = [
      "/",
      "/problem",
      "/solution",
      "/fit",
      "/tradeoffs",
      "/plan",
      "/scenario",
    ];
    const route = routes[chapterNum] ?? "/";
    if (chapterNum === 0) {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
      }}
    >
      {/* Sticky Header — DO NOT modify visuals */}
      <SiteHeader
        activeChapter={activeChapter}
        onNavigateChapter={handleNavigateChapter}
        onOpenScenario={() => setShowScenarioModal(true)}
      />

      {/* Animated page transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Routes location={location}>
            <Route
              path="/"
              element={
                <PageLanding
                  onExplore={() => handleNavigateChapter(1)}
                  onOpenScenario={() => setShowScenarioModal(true)}
                />
              }
            />
            <Route
              path="/problem"
              element={
                <PageProblem
                  onContinue={() => handleNavigateChapter(2)}
                  onOpenScenario={() => setShowScenarioModal(true)}
                />
              }
            />
            <Route
              path="/solution"
              element={
                <PageSolution onContinue={() => handleNavigateChapter(3)} />
              }
            />
            <Route
              path="/fit"
              element={<PageFit onContinue={() => handleNavigateChapter(4)} />}
            />
            <Route
              path="/tradeoffs"
              element={
                <PageTradeoffs onContinue={() => handleNavigateChapter(5)} />
              }
            />
            <Route path="/plan" element={<PagePlan />} />
            <Route
              path="/scenario"
              element={
                <PageScenario
                  onApplyScenario={() => {
                    setShowScenarioModal(false);
                    handleNavigateChapter(1);
                  }}
                />
              }
            />
          </Routes>

          {/* Site Footer (shown on all pages) */}
          <footer
            style={{
              background: "#FFFFFF",
              borderTop: "1px solid #E2E8F0",
              padding: "2.5rem 0",
              marginTop: "2rem",
              textAlign: "center",
            }}
          >
            <div className="container container--wide">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: "#4F46E5",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "0.6875rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    IO
                  </div>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    IOMETE
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                    — Modern Lakehouse on Kubernetes
                  </span>
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#64748B" }}>
                  Built for transparent enterprise evaluations · Grounded in
                  official documentation
                </div>
              </div>
            </div>
          </footer>
        </motion.div>
      </AnimatePresence>

      {/* Global Scenario Modal */}
      <ExampleScenarioModal
        isOpen={showScenarioModal}
        onClose={() => setShowScenarioModal(false)}
        onScenarioLoaded={() => {
          setShowScenarioModal(false);
          navigate("/problem");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
