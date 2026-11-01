import React, { useState, useEffect } from "react";
import { useSession } from "../context/SessionContext";
import { Sparkles, BookOpen, FileText, CheckCircle2 } from "lucide-react";

interface SiteHeaderProps {
  onOpenScenario: () => void;
  activeChapter: number;
  onNavigateChapter: (chapterNumber: number) => void;
}

const CHAPTERS = [
  { id: 1, name: "The Problem", targetId: "chapter-1" },
  { id: 2, name: "The Solution", targetId: "chapter-2" },
  { id: 3, name: "Explore the Fit", targetId: "chapter-3" },
  { id: 4, name: "Understand\nTrade-offs", targetId: "chapter-4" },
  { id: 5, name: "Decide What\nComes Next", targetId: "chapter-5" },
];

export function SiteHeader({
  onOpenScenario,
  activeChapter,
  onNavigateChapter,
}: SiteHeaderProps) {
  const { state } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute overall evaluation completeness
  const challengesCount = state.selectedChallenges.length;
  const outcomesCount = state.selectedOutcomes.length;
  const questionsAnswered = Object.keys(state.questionDispositions).length;

  let readinessScore = 0;
  if (challengesCount > 0) readinessScore += 20;
  if (outcomesCount > 0) readinessScore += 30;
  if (questionsAnswered > 0) readinessScore += 25;
  if (state.financialModel.currentAnnualCosts[0]?.value > 0)
    readinessScore += 15;
  if (state.customPlanItems.length > 0) readinessScore += 10;

  return (
    <header
      className="site-header"
      style={{
        boxShadow: scrolled ? "0 4px 20px -2px rgba(15, 23, 42, 0.08)" : "none",
        background: scrolled
          ? "rgba(255, 255, 255, 0.94)"
          : "rgba(250, 249, 246, 0.94)",
      }}
    >
      <div className="container container--wide">
        <div className="site-header__inner">
          {/* Brand */}
          <div
            className="site-brand"
            onClick={() => onNavigateChapter(0)}
            title="Return to top"
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              IO
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  className="site-brand__logo"
                  style={{ color: "#0F172A", fontWeight: 800 }}
                >
                  IOMETE
                </span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: 4,
                    background: "#EEF2FF",
                    color: "#4F46E5",
                    letterSpacing: "0.04em",
                  }}
                >
                  NAVIGATOR
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "#64748B",
                  paddingBottom: 1,
                }}
              >
                The Missing Picture
              </div>
            </div>
          </div>

          {/* Chapters Navigation */}
          <nav
            className="chapter-nav-links"
            style={{ display: "flex", gap: 4 }}
          >
            {CHAPTERS.map((ch) => {
              const isActive = activeChapter === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => onNavigateChapter(ch.id)}
                  className={`chapter-nav-item ${isActive ? "active" : ""}`}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    background: isActive ? "#EEF2FF" : "transparent",
                    color: isActive ? "#4F46E5" : "#475569",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 600 : 500,
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: isActive ? "#4F46E5" : "#E2E8F0",
                      color: isActive ? "#FFFFFF" : "#64748B",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      marginRight: 6,
                    }}
                  >
                    {ch.id}
                  </span>
                  <span style={{ whiteSpace: "pre-line", textAlign: "left" }}>
                    {ch.name}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Case Study Pill */}
            <button
              onClick={onOpenScenario}
              className="btn btn--secondary"
              style={{
                fontSize: "0.75rem",
                padding: "5px 10px",
                borderRadius: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: state.isScenarioLoaded ? "#F5F3FF" : "#FFFFFF",
                borderColor: state.isScenarioLoaded ? "#DDD6FE" : "#E2E8F0",
                color: state.isScenarioLoaded ? "#7C3AED" : "#475569",
              }}
              title="View fictional Aurelia Capital case study"
            >
              <BookOpen
                size={13}
                color={state.isScenarioLoaded ? "#7C3AED" : "#64748B"}
              />
              <span>
                {state.isScenarioLoaded
                  ? "Aurelia Scenario Active"
                  : "Example: Aurelia Capital"}
              </span>
            </button>

            {/* Jump to Report button */}
            <button
              onClick={() => onNavigateChapter(5)}
              className="btn btn--primary"
              style={{
                fontSize: "0.75rem",
                padding: "5px 12px",
                borderRadius: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FileText size={13} />
              <span>Report</span>
              {readinessScore > 0 && (
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.25)",
                    borderRadius: 10,
                    padding: "1px 5px",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                  }}
                >
                  {readinessScore}%
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
