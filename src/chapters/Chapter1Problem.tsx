import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "../context/SessionContext";
import { SETUP_CHALLENGES } from "../data/generalContent";
import { CheckCircle2, ArrowRight, BookOpen } from "lucide-react";

interface Chapter1ProblemProps {
  onOpenScenario: () => void;
  onContinue: () => void;
}

export function Chapter1Problem({
  onOpenScenario,
  onContinue,
}: Chapter1ProblemProps) {
  const { state, toggleChallenge } = useSession();
  const [selectedBottleneck, setSelectedBottleneck] =
    useState<string>("ingestion");

  const bottlenecks = [
    {
      id: "ingestion",
      title: "Batch Ingestion Lag",
      tag: "Latency",
      description:
        "Overnight data arrives too late, leaving dashboards outdated.",
      symptom: "Finance and Operations dispute figures every morning.",
      bg: "#FFFBEB",
      border: "#FDE68A",
      tagColor: "#D97706",
      dot: "#D97706",
    },
    {
      id: "reconciliation",
      title: "Manual Reconciliation Breaks",
      tag: "Data Quality",
      description:
        "Schema changes break brittle scripts, forcing manual fixes.",
      symptom: "Hours wasted diagnosing missing keys and broken joins.",
      bg: "#FFF1F2",
      border: "#FECDD3",
      tagColor: "#DC2626",
      dot: "#DC2626",
    },
    {
      id: "egress",
      title: "Runaway Cloud & Egress Bills",
      tag: "Cost Friction",
      description: "Warehouse markups and data egress fees drive up costs.",
      symptom: "Unpredictable monthly invoices and CFO escalation.",
      bg: "#F5F3FF",
      border: "#DDD6FE",
      tagColor: "#7C3AED",
      dot: "#7C3AED",
    },
    {
      id: "governance",
      title: "Access Silos & Compliance Risk",
      tag: "Security",
      description:
        "Strict privacy rules make safe, shared data access difficult.",
      symptom: "Auditors flag undocumented copies and data sprawl.",
      bg: "#F0F7FF",
      border: "#BAE6FD",
      tagColor: "#0284C7",
      dot: "#0284C7",
    },
  ];

  const active =
    bottlenecks.find((b) => b.id === selectedBottleneck) || bottlenecks[0];

  return (
    <section id="chapter-1" className="chapter-section chapter-section--warm">
      <div className="container container--wide">
        {/* Chapter Header */}
        <div className="chapter-header">
          <div className="chapter-pill">
            <span>Chapter 01</span>
            <span>·</span>
            <span>The Problem</span>
          </div>
          <h2 className="chapter-title">How your data works today</h2>
          <p className="chapter-subtitle">
            Most organisations didn't plan for data fragmentation — it happened
            organically as new databases, SaaS tools, and cloud warehouses were
            added over time.
          </p>
        </div>

        {/* ─── Interactive Bottleneck Map ─── */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 20,
            padding: "2rem",
            marginBottom: "2.5rem",
            boxShadow: "0 4px 16px -2px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                VISUAL BOTTLENECK MAP
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#0F172A",
                }}
              >
                Where does data get stuck?
              </h3>
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#94A3B8" }}>
              Click any bottleneck to inspect the breakdown
            </div>
          </div>

          {/* Bottleneck Tiles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 16,
              marginBottom: "1.5rem",
            }}
          >
            {bottlenecks.map((b, idx) => {
              const isSelected = selectedBottleneck === b.id;
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: idx * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: `0 10px 24px rgba(15,23,42,0.09)`,
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedBottleneck(b.id)}
                  style={{
                    background: isSelected ? b.bg : "#F8FAFC",
                    border: `1.5px solid ${isSelected ? b.border : "#E2E8F0"}`,
                    borderRadius: 14,
                    padding: "1.25rem",
                    cursor: "pointer",
                    transition: "border-color 0.2s ease, background 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: isSelected ? "#FFFFFF" : "#F1F5F9",
                        color: isSelected ? b.tagColor : "#64748B",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {b.tag}
                    </span>
                    {isSelected && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: b.dot,
                          display: "inline-block",
                        }}
                      />
                    )}
                  </div>
                  <h4
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "#0F172A",
                      marginBottom: 6,
                    }}
                  >
                    {b.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#475569",
                      lineHeight: 1.5,
                      marginBottom: 8,
                    }}
                  >
                    {b.description}
                  </p>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: b.tagColor,
                      fontWeight: 500,
                    }}
                  >
                    ⚠️ {b.symptom}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Active detail strip */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              style={{
                background: active.bg,
                border: `1px solid ${active.border}`,
                borderRadius: 12,
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: active.dot,
                  flexShrink: 0,
                }}
              />
              <div style={{ fontSize: "0.875rem", color: "#334155" }}>
                <strong style={{ color: active.tagColor }}>
                  {active.title}:{" "}
                </strong>
                {active.symptom}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Challenge Selection Matrix ─── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ maxWidth: 700, marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1.375rem",
                fontWeight: 600,
                color: "#0F172A",
                marginBottom: 6,
              }}
            >
              Select the challenges your team experiences
            </h3>
            <p style={{ fontSize: "0.9375rem", color: "#64748B" }}>
              Your selections tailor the evaluation criteria and recommendations
              throughout this report.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
              gap: 16,
            }}
          >
            {SETUP_CHALLENGES.map((ch, idx) => {
              const isSelected = state.selectedChallenges.includes(ch.id);
              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.38,
                    delay: idx * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 28px rgba(79,70,229,0.1)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleChallenge(ch.id)}
                  className={`card card--interactive ${isSelected ? "card--active" : ""}`}
                  style={{
                    background: isSelected ? "#FAFAFF" : "#FFFFFF",
                    border: `1.5px solid ${isSelected ? "#4F46E5" : "#E2E8F0"}`,
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#0F172A",
                          }}
                        >
                          {ch.title}
                        </h4>
                      </div>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          border: `1.5px solid ${isSelected ? "#4F46E5" : "#CBD5E1"}`,
                          background: isSelected ? "#4F46E5" : "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#FFFFFF",
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <CheckCircle2 size={14} />}
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#475569",
                        lineHeight: 1.5,
                        marginBottom: 12,
                      }}
                    >
                      {ch.description}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: isSelected ? "#EEF2FF" : "#F8FAFC",
                      border: "1px solid rgba(0,0,0,0.04)",
                      fontSize: "0.75rem",
                      color: "#64748B",
                    }}
                  >
                    <strong style={{ color: "#334155" }}>
                      Common symptom:{" "}
                    </strong>
                    {ch.commonExamples}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── Case Study Anchor Banner ─── */}
        <div
          style={{
            background: "linear-gradient(135deg, #F8FAFC 0%, #F5F3FF 100%)",
            border: "1px solid #DDD6FE",
            borderRadius: 20,
            padding: "1.75rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "2px 8px",
                borderRadius: 6,
                background: "#EDE9FE",
                color: "#7C3AED",
                fontSize: "0.6875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
              }}
            >
              <BookOpen size={12} />
              <span>Example Scenario</span>
            </div>
            <h4
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#0F172A",
                marginBottom: 4,
              }}
            >
              How Aurelia Capital tackled these challenges
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#475569",
                lineHeight: 1.5,
              }}
            >
              Explore how Maya Sharma, Director of Data Platforms at fictional
              Aurelia Capital, evaluated fragmented market feeds, custodian
              positions, and trade logs.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={onOpenScenario}
              className="btn btn--secondary"
              style={{
                fontSize: "0.875rem",
                padding: "0.625rem 1.25rem",
                borderRadius: 10,
                borderColor: "#C4B5FD",
                color: "#6D28D9",
                background: "#FFFFFF",
              }}
            >
              Open Case Study
            </button>
            <button
              onClick={onContinue}
              className="btn btn--primary"
              style={{
                fontSize: "0.875rem",
                padding: "0.625rem 1.25rem",
                borderRadius: 10,
              }}
            >
              <span>Next: The Solution</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
