import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Activity,
  Cloud,
  Layers,
  Cpu,
  ShieldCheck,
  BarChart3,
  Bot,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface InteractiveDataLandscapeProps {
  onExplore: () => void;
  onOpenScenario: () => void;
}

export function InteractiveDataLandscape({
  onExplore,
  onOpenScenario,
}: InteractiveDataLandscapeProps) {
  const [viewState, setViewState] = useState<"scattered" | "unified">(
    "scattered",
  );
  const [activeNode, setActiveNode] = useState<string | null>("lakehouse");

  const sources = [
    {
      id: "db",
      label: "Operational DBs",
      type: "source",
      icon: Database,
      tech: "PostgreSQL, MySQL, Oracle",
      status: "Siloed replicas",
    },
    {
      id: "stream",
      label: "Real-time Streams",
      type: "source",
      icon: Activity,
      tech: "Kafka, Kinesis, Webhooks",
      status: "High latency lag",
    },
    {
      id: "warehouse",
      label: "Cloud Warehouses",
      type: "source",
      icon: Cloud,
      tech: "Snowflake, BigQuery",
      status: "Expensive egress",
    },
    {
      id: "saas",
      label: "Business SaaS",
      type: "source",
      icon: Layers,
      tech: "Salesforce, Stripe, APIs",
      status: "Isolated extracts",
    },
  ];

  const consumers = [
    {
      id: "bi",
      label: "Executive BI",
      type: "consumer",
      icon: BarChart3,
      tech: "PowerBI, Tableau, Superset",
      need: "Consistent metrics",
    },
    {
      id: "ai",
      label: "ML & AI Models",
      type: "consumer",
      icon: Bot,
      tech: "PySpark, Feature Stores",
      need: "Direct Parquet access",
    },
    {
      id: "audit",
      label: "Audit & Governance",
      type: "consumer",
      icon: ShieldCheck,
      tech: "Lineage, RBAC, Masking",
      need: "Sovereign perimeter",
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        paddingBottom: "3.5rem",
      }}
    >
      {/* Background subtle mesh glow */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1000,
          height: 600,
          background:
            "radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.08) 0%, rgba(224, 231, 255, 0.05) 50%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="container container--wide"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Hero Opening Header */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 840,
            margin: "2.5rem auto 2.5rem",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 14px",
              borderRadius: 999,
              background: "#EEF2FF",
              border: "1px solid #C7D2FE",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4F46E5",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#4F46E5",
                letterSpacing: "0.04em",
              }}
            >
              INTERACTIVE ARCHITECTURE NAVIGATOR
            </span>
          </div>

          <h1
            className="text-display"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              color: "#0F172A",
              letterSpacing: "-0.025em",
              marginBottom: "1.25rem",
              lineHeight: 1.15,
            }}
          >
            Your data tells a story.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Can you see the whole picture?
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "#475569",
              lineHeight: 1.6,
              maxWidth: 720,
              margin: "0 auto 2rem",
            }}
          >
            Explore your data challenges, discover where IOMETE may fit, and
            identify what you need to validate before making a decision.
          </p>

          {/* Primary Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onExplore}
              className="btn btn--primary"
              style={{
                fontSize: "1rem",
                padding: "0.75rem 1.75rem",
                borderRadius: 12,
                boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <span>Explore your data landscape</span>
              <ChevronDown size={18} />
            </button>

            <button
              onClick={onOpenScenario}
              className="btn btn--secondary"
              style={{
                fontSize: "1rem",
                padding: "0.75rem 1.5rem",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              <span>View Example Scenario (Aurelia Capital)</span>
            </button>
          </div>
        </div>

        {/* Interactive Data Landscape Canvas */}
        <div
          className="card"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 24,
            padding: "2rem",
            boxShadow:
              "0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)",
            maxWidth: 1160,
            margin: "0 auto",
          }}
        >
          {/* Top Control Bar for Diagram */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #F1F5F9",
              paddingBottom: "1.25rem",
              marginBottom: "1.75rem",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#64748B",
                }}
              >
                ARCHITECTURE SIMULATOR
              </div>
              <div
                style={{ fontSize: "1rem", fontWeight: 600, color: "#0F172A" }}
              >
                {viewState === "scattered"
                  ? "Scattered Silos: Point-to-Point Complexity"
                  : "Unified Lakehouse: Open Formats in Your VPC"}
              </div>
            </div>

            {/* View State Toggle Pills */}
            <div
              style={{
                display: "inline-flex",
                padding: 4,
                borderRadius: 12,
                background: "#F1F5F9",
                border: "1px solid #E2E8F0",
              }}
            >
              <button
                onClick={() => setViewState("scattered")}
                style={{
                  border: "none",
                  background:
                    viewState === "scattered" ? "#FFFFFF" : "transparent",
                  color: viewState === "scattered" ? "#0F172A" : "#64748B",
                  boxShadow:
                    viewState === "scattered"
                      ? "0 1px 3px rgba(0,0,0,0.1)"
                      : "none",
                  fontWeight: viewState === "scattered" ? 600 : 500,
                  fontSize: "0.8125rem",
                  padding: "6px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                1. Scattered Today
              </button>
              <button
                onClick={() => setViewState("unified")}
                style={{
                  border: "none",
                  background:
                    viewState === "unified" ? "#4F46E5" : "transparent",
                  color: viewState === "unified" ? "#FFFFFF" : "#64748B",
                  boxShadow:
                    viewState === "unified"
                      ? "0 2px 6px rgba(79, 70, 229, 0.25)"
                      : "none",
                  fontWeight: viewState === "unified" ? 600 : 500,
                  fontSize: "0.8125rem",
                  padding: "6px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                2. Unified with IOMETE
              </button>
            </div>
          </div>

          {/* Connected Nodes Diagram */}
          <div
            style={{
              position: "relative",
              minHeight: 380,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            {/* SVG Connector Lines */}
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#065F46" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* Render dynamic connector lines depending on viewState */}
              {viewState === "unified" ? (
                <>
                  {/* Left sources connecting to central lakehouse */}
                  <line
                    x1="22%"
                    y1="18%"
                    x2="50%"
                    y2="50%"
                    stroke="url(#flowGrad)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="22%"
                    y1="39%"
                    x2="50%"
                    y2="50%"
                    stroke="url(#flowGrad)"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="22%"
                    y1="61%"
                    x2="50%"
                    y2="50%"
                    stroke="url(#flowGrad)"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="22%"
                    y1="82%"
                    x2="50%"
                    y2="50%"
                    stroke="url(#flowGrad)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Central lakehouse connecting to consumers */}
                  <line
                    x1="50%"
                    y1="50%"
                    x2="78%"
                    y2="25%"
                    stroke="url(#flowGrad)"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="78%"
                    y2="50%"
                    stroke="url(#flowGrad)"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="78%"
                    y2="75%"
                    stroke="url(#flowGrad)"
                    strokeWidth="2.5"
                  />

                  {/* Animated Data Packets Flowing In */}
                  <circle r="4" fill="#4F46E5">
                    <animate
                      attributeName="cx"
                      from="22%"
                      to="50%"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      from="39%"
                      to="50%"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  <circle r="4" fill="#6366F1">
                    <animate
                      attributeName="cx"
                      from="22%"
                      to="50%"
                      dur="2.8s"
                      repeatCount="indefinite"
                      begin="0.8s"
                    />
                    <animate
                      attributeName="cy"
                      from="61%"
                      to="50%"
                      dur="2.8s"
                      repeatCount="indefinite"
                      begin="0.8s"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      dur="2.8s"
                      repeatCount="indefinite"
                      begin="0.8s"
                    />
                  </circle>

                  {/* Animated Data Packets Flowing Out to BI */}
                  <circle r="4" fill="#059669">
                    <animate
                      attributeName="cx"
                      from="50%"
                      to="78%"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      from="50%"
                      to="25%"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  <circle r="4" fill="#059669">
                    <animate
                      attributeName="cx"
                      from="50%"
                      to="78%"
                      dur="2.3s"
                      repeatCount="indefinite"
                      begin="0.5s"
                    />
                    <animate
                      attributeName="cy"
                      from="50%"
                      to="50%"
                      dur="2.3s"
                      repeatCount="indefinite"
                      begin="0.5s"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      dur="2.3s"
                      repeatCount="indefinite"
                      begin="0.5s"
                    />
                  </circle>
                </>
              ) : (
                <>
                  {/* Broken, criss-crossing point-to-point lines */}
                  <line
                    x1="22%"
                    y1="18%"
                    x2="78%"
                    y2="25%"
                    stroke="#FCA5A5"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                  <line
                    x1="22%"
                    y1="39%"
                    x2="78%"
                    y2="50%"
                    stroke="#FCA5A5"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="22%"
                    y1="61%"
                    x2="78%"
                    y2="75%"
                    stroke="#FCD34D"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="22%"
                    y1="82%"
                    x2="78%"
                    y2="25%"
                    stroke="#FCA5A5"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                  />
                  <line
                    x1="22%"
                    y1="18%"
                    x2="78%"
                    y2="75%"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray="8 6"
                  />
                </>
              )}
            </svg>

            {/* Left Column: Data Sources */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                width: "26%",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748B",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Inputs & Sources
              </div>
              {sources.map((src) => {
                const Icon = src.icon;
                const isSelected = activeNode === src.id;
                return (
                  <div
                    key={src.id}
                    onClick={() => setActiveNode(src.id)}
                    style={{
                      background: isSelected ? "#FFFFFF" : "#F8FAFC",
                      border: `1px solid ${isSelected ? "#4F46E5" : "#E2E8F0"}`,
                      borderRadius: 12,
                      padding: "10px 14px",
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 4px 12px rgba(79, 70, 229, 0.12)"
                        : "none",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: isSelected ? "#EEF2FF" : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isSelected ? "#4F46E5" : "#475569",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "#0F172A",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {src.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          color:
                            viewState === "scattered" ? "#D97706" : "#64748B",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {viewState === "scattered" ? src.status : src.tech}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center: The Core / Convergence Hub */}
            <div
              style={{
                width: "38%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <AnimatePresence mode="wait">
                {viewState === "unified" ? (
                  <motion.div
                    key="unified-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setActiveNode("lakehouse")}
                    style={{
                      width: "100%",
                      background:
                        "linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%)",
                      border: "2px solid #6366F1",
                      borderRadius: 20,
                      padding: "1.5rem",
                      boxShadow: "0 12px 30px -4px rgba(79, 70, 229, 0.18)",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        background: "#4F46E5",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.35)",
                      }}
                    >
                      <Cpu size={26} />
                    </div>
                    <div
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "#0F172A",
                        marginBottom: 4,
                      }}
                    >
                      IOMETE Lakehouse
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#4F46E5",
                        fontWeight: 600,
                        marginBottom: 12,
                      }}
                    >
                      Inside Your Kubernetes Perimeter
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        textAlign: "left",
                        marginTop: 10,
                      }}
                    >
                      <div
                        style={{
                          background: "#FFFFFF",
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: "1px solid #E0E7FF",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            color: "#6366F1",
                          }}
                        >
                          Apache Iceberg
                        </div>
                        <div style={{ fontSize: "0.625rem", color: "#475569" }}>
                          ACID open tables
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#FFFFFF",
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: "1px solid #E0E7FF",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            color: "#6366F1",
                          }}
                        >
                          Apache Spark
                        </div>
                        <div style={{ fontSize: "0.625rem", color: "#475569" }}>
                          Decoupled SQL compute
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="scattered-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setActiveNode("gap")}
                    style={{
                      width: "100%",
                      background: "#FEF2F2",
                      border: "2px dashed #FCA5A5",
                      borderRadius: 20,
                      padding: "1.5rem",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 88,
                        borderRadius: 14,
                        background: "#FEE2E2",
                        color: "#DC2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                      }}
                    >
                      <Layers size={24} />
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#991B1B",
                        marginBottom: 4,
                      }}
                    >
                      Missing Unified Layer
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#B91C1C",
                        lineHeight: 1.5,
                      }}
                    >
                      Fragile point-to-point ETL scripts, duplicate
                      reconciliations, and isolated copies.
                    </div>
                    <div style={{ marginTop: 12 }}></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Business Consumers */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                width: "26%",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748B",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Business Consumers
              </div>
              {consumers.map((cons) => {
                const Icon = cons.icon;
                const isSelected = activeNode === cons.id;
                return (
                  <div
                    key={cons.id}
                    onClick={() => setActiveNode(cons.id)}
                    style={{
                      background: isSelected ? "#FFFFFF" : "#F8FAFC",
                      border: `1px solid ${isSelected ? "#059669" : "#E2E8F0"}`,
                      borderRadius: 12,
                      padding: "10px 14px",
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 4px 12px rgba(5, 150, 105, 0.12)"
                        : "none",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: isSelected ? "#ECFDF5" : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isSelected ? "#059669" : "#475569",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "#0F172A",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {cons.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          color:
                            viewState === "scattered" ? "#DC2626" : "#059669",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {viewState === "scattered"
                          ? "Stale / contradictory"
                          : "Single source of truth"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Inspection Drawer below the diagram */}
          <div
            style={{
              marginTop: "1.75rem",
              padding: "1rem 1.25rem",
              borderRadius: 14,
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#4F46E5",
                }}
              />
              <div style={{ fontSize: "0.8125rem", color: "#334155" }}>
                {viewState === "scattered" ? (
                  <span>
                    <strong>The Core Problem:</strong> Disconnected systems
                    create conflicting figures, vendor lock-in, and ballooning
                    cloud bills.
                  </span>
                ) : (
                  <span>
                    <strong>The IOMETE Difference:</strong> Full data
                    sovereignty on Kubernetes, open table formats (Iceberg), and
                    zero markup on cloud compute.
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onExplore}
              style={{
                border: "none",
                background: "transparent",
                color: "#4F46E5",
                fontSize: "0.8125rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              <span>Explore Chapter 1: The Problem</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
